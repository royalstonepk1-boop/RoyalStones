const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { image, url } = require('../config/cloudinary');
const striptest = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');

async function createOrder(req, res) {
  try {
    const { billingAddress, shippingAddress, paymentMethod ,deliveryCharges ,cart ,user } = req.body;
    // const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items?.length) return res.status(400).json({ message: 'Cart is empty' });

    const orders = await Order.find({});
    let orderNumber = 1000;
    if(orders.length > 0){
      const lastOrder = orders[orders.length - 1];
      const lastOrderNumber = parseInt(lastOrder.orderNumber);
      orderNumber = lastOrderNumber + 1;
    }
    //console.log(cart);
    const orderItems = cart?.items?.map(i => ({
      productId: i.productId._id,
      price: i.productId.discountPrice || i.productId.price,
      quantity: i.quantity,
      carretValue: i.carretValue,
      fingerSize: i.fingerSize,
      msgNote: i.msgNote,
    }));
    const totalAmount = orderItems.reduce((s, it) => s + (it.price) * it.carretValue * it.quantity,
    0);
    const SubTotal = totalAmount + deliveryCharges;
    // console.log("Subtotal",typeof(SubTotal) , orderItems);

    const order = await Order.create({
      userId: user ? user?._id : null,
      orderNumber: orderNumber,
      status: 'pending',
      billingAddress, shippingAddress, paymentMethod,
      totalAmount: SubTotal,
      deliveryCharges,
      orderItems
    });

    // reduce stock and log inventory
    for (const it of orderItems) {
      const prod = await Product.findById(it.productId);
      if (prod) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - it.quantity);
        await prod.save();
      }
    }

    // clear cart
    if(user){
      await Cart.findOneAndUpdate({ userId: user?._id }, { items: [] });
    }

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
async function cancelOrder(req, res) {
  try {
    const { orderID } = req.body;
    
    // Find the order
    const order = await Order.findById(orderID);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the user
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to cancel this order' });
    }
    
    // Check if order can be cancelled (only pending and paid orders)
    if (!['pending', 'paid'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }
    
    // Restore stock quantities
    for (const item of order.orderItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stockQuantity += item.quantity;
        await product.save();
      }
    }
    
    // Update order status to cancelled
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    await order.save();
    
    res.json({ 
      message: 'Order cancelled successfully', 
      order 
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function getOrders(req, res) {
  const orders = await Order.find({ userId: req.user._id }).populate('orderItems.productId');
  res.json(orders);
}
async function listOrders(req, res) {
  const orders = await Order.find().populate('orderItems.productId').populate('userId');
  res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id).populate('orderItems.productId');
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  res.json(order);
}

async function updateOrderStatus(req, res) {
  const { orderID, status } = req.body;
  const order = await Order.findByIdAndUpdate(orderID, { status }, { new: true });
  res.json(order);
}

async function paymentCheckOutSession(req, res) {
  try {
    const { products, deliveryCharges } = req.body;
    const userId = req.user._id;

    //console.log('🔍 Creating checkout for user:', userId);
    //console.log('📦 Products count:', products?.length);

    // Validate required data
    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'No products in cart' });
    }

    // Validate environment variables
    if (!process.env.LEMONSQUEEZY_API_KEY) {
      throw new Error('Missing LEMONSQUEEZY_API_KEY');
    }
    if (!process.env.LEMONSQUEEZY_STORE_ID) {
      throw new Error('Missing LEMONSQUEEZY_STORE_ID');
    }
    if (!process.env.LEMONSQUEEZY_VARIANT_ID) {
      throw new Error('Missing LEMONSQUEEZY_VARIANT_ID');
    }

    // Calculate total amount
    let totalAmount = 0;
    products.forEach((item) => {
      const price = item.productId?.discountPrice || item.productId?.price || 0;
      const carretValue = item.carretValue || 1;
      const quantity = item.quantity || 1;
      totalAmount += price * carretValue * quantity;
    });

    if (deliveryCharges && deliveryCharges > 0) {
      totalAmount += deliveryCharges;
    }

    //console.log('💵 Total amount:', totalAmount);

    // Prepare product list for description
    const productList = products
      .slice(0, 3)
      .map(p => p.productId?.name || 'Product')
      .join(', ');
    
    const description = products.length > 3 
      ? `${productList} and ${products.length - 3} more` 
      : productList;

    // Prepare custom data - ALL VALUES MUST BE STRINGS
    const customData = {
      user_id: userId.toString(),
      order_items: JSON.stringify(products.map(item => ({
        product_id: item.productId?._id?.toString() || '',
        product_name: item.productId?.name || '',
        quantity: item.quantity || 1,
        unit_price: item.productId?.discountPrice || item.productId?.price || 0,
        caret_value: item.carretValue || 1,
      }))),
      delivery_charges: String(deliveryCharges || 0),
      total_amount: String(totalAmount),
      timestamp: String(Date.now()),
    };

    //console.log('📦 Custom data prepared');

    // Create checkout data
    const checkoutData = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: customData, // All values are now strings
          },
          product_options: {
            name: `Order - ${products.length} item${products.length > 1 ? 's' : ''}`,
            description: description,
            redirect_url: `${process.env.FRONTEND_URL}/checkout-success`,
          },
          checkout_options: {
            button_color: '#2563eb',
          },
          custom_price: Math.round(totalAmount * 100), // in cents
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: String(process.env.LEMONSQUEEZY_STORE_ID),
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: String(process.env.LEMONSQUEEZY_VARIANT_ID),
            },
          },
        },
      },
    };

    //console.log('📤 Sending request to Lemon Squeezy...');

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(checkoutData),
    });

    const result = await response.json();

    //console.log('📥 Response status:', response.status);

    if (!response.ok) {
      console.error('❌ Lemon Squeezy error response:', JSON.stringify(result, null, 2));
      const errorDetail = result.errors?.[0]?.detail || result.errors?.[0]?.title || 'Checkout creation failed';
      throw new Error(errorDetail);
    }

    //console.log('✅ Checkout created successfully');
    //console.log('🔗 Checkout URL:', result.data.attributes.url);

    res.json({ url: result.data.attributes.url });
  } catch (error) {
    console.error('❌ Lemon Squeezy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to create checkout',
      details: error.message 
    });
  }
}

async function lemonSqueezyWebhook(req, res) {
  try {
    const signature = req.headers['x-signature'];
    
    if (!signature) {
      console.error('❌ No signature provided');
      return res.status(401).json({ error: 'No signature' });
    }

    // Get raw body - it should be a Buffer when using express.raw()
    let rawBody;
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body;
    } else if (typeof req.body === 'string') {
      rawBody = Buffer.from(req.body);
    } else {
      // If body was already parsed as JSON, we need to stringify it back
      rawBody = Buffer.from(JSON.stringify(req.body));
    }

    // Verify the signature
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(rawBody);
    const digest = hmac.digest('hex');

    // Compare signatures
    if (digest !== signature) {
      console.error('❌ Invalid signature');
      console.error('Expected:', digest);
      console.error('Received:', signature);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse the verified body
    const payload = JSON.parse(rawBody.toString());
    const eventName = payload.meta.event_name;

    //console.log('✅ Webhook verified and received:', eventName);
    //console.log('📦 Order ID:', payload.data.id);

    // Handle different events
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(payload);
        break;
      
      case 'order_refunded':
        await handleOrderRefunded(payload);
        break;
      
      default:
        //console.log('ℹ️  Unhandled event:', eventName);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ 
      error: 'Webhook processing failed',
      details: error.message 
    });
  }
}

async function handleOrderCreated(payload) {
  try {
    const orderAttributes = payload.data.attributes;
    
    // Get custom data from meta
    const customData = payload.meta.custom_data || {};

    //console.log('📦 Processing order...');
    //console.log('💰 Total:', orderAttributes.total_formatted);
    //console.log('📧 Customer email:', orderAttributes.user_email);

    // Parse the stringified data back to objects
    const userId = customData.user_id;
    const orderItems = customData.order_items ? JSON.parse(customData.order_items) : [];
    const deliveryCharges = parseFloat(customData.delivery_charges || 0);
    const totalAmount = parseFloat(customData.total_amount || 0);

    //console.log('👤 User ID:', userId);
    //console.log('📦 Order items:', orderItems.length);
    //console.log('🚚 Delivery charges:', deliveryCharges);

    // Update your database
    const Order = require('../models/Order');
    
    const updatedOrder = await Order.findOneAndUpdate(
      { 
        userId: userId,
        status: 'pending',
        createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 mins (increased window)
      },
      { 
        status: 'paid',
        lemonSqueezyOrderId: payload.data.id,
        paidAt: new Date(),
      },
      { 
        sort: { createdAt: -1 },
        new: true
      }
    );
    
    if (updatedOrder) {
      //console.log('✅ Order updated in database:', updatedOrder._id);
    } else {
      console.warn('⚠️  No pending order found for user:', userId);
    }

    //console.log('✅ Order webhook processed successfully');
  } catch (error) {
    console.error('❌ Error handling order creation:', error);
    throw error;
  }
}

async function handleOrderRefunded(payload) {
  //console.log('💸 Order refunded:', payload.data.id);
  
  try {
    const Order = require('../models/Order');
    
    await Order.findOneAndUpdate(
      { lemonSqueezyOrderId: payload.data.id },
      { 
        paymentStatus: 'refunded',
        refundedAt: new Date()
      }
    );
    
    //console.log('✅ Order refund processed');
  } catch (error) {
    console.error('❌ Error handling refund:', error);
    throw error;
  }
}

module.exports = { paymentCheckOutSession, lemonSqueezyWebhook };

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus,cancelOrder ,listOrders ,paymentCheckOutSession  ,lemonSqueezyWebhook};
