const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { image, url } = require('../config/cloudinary');
const striptest = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createOrder(req, res) {
  try {
    const { billingAddress, shippingAddress, paymentMethod ,deliveryCharges } = req.body;
    // console.log(req.body);
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items?.length) return res.status(400).json({ message: 'Cart is empty' });

    const orders = await Order.find({});
    let orderNumber = 1000;
    if(orders.length > 0){
      const lastOrder = orders[orders.length - 1];
      const lastOrderNumber = parseInt(lastOrder.orderNumber);
      orderNumber = lastOrderNumber + 1;
    }
    console.log(cart);
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
      userId: req.user._id,
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
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

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

async function paymentCheckOutSession(req,res){
  const {products ,deliveryCharges} = req.body;
  console.log(products);
  const lineItems = products.map((item)=>({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.productId.name,
          description: item.productId.description,
          images: [item.productId.images[0].url]
        },
        unit_amount: Math.round(((item.productId.discountPrice ? item.productId.discountPrice :item.productId.price) * item.carretValue)*100),
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a separate line item
    if (deliveryCharges && deliveryCharges > 0) {
      lineItems.push({
        price_data: {
          currency: "pkr",
          product_data: {
            name: "Delivery Charges",
            description: "Shipping / Delivery Fee",
          },
          unit_amount: Math.round(deliveryCharges * 100), // in paisa
        },
        quantity: 1,
      });
    }
  const session = await striptest.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CORS_ORIGIN}/checkout-success`,
    cancel_url: `${process.env.CORS_ORIGIN}/cancel`,
  });
  res.json({ url: session.url });

}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus,cancelOrder ,listOrders ,paymentCheckOutSession };
