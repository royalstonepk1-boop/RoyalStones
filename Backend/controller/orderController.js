const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

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
    const orderItems = cart?.items?.map(i => ({
      productId: i.productId._id,
      price: i.productId.discountPrice || i.productId.price,
      quantity: i.quantity,
      carretValue: i.carretValue,
      fingerSize: i.fingerSize,
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

async function getOrders(req, res) {
  const orders = await Order.find(req.user.role === 'admin' ? {} : { userId: req.user._id }).populate('orderItems.productId');
  res.json(orders);
}

async function getOrder(req, res) {
  const order = await Order.findById(req.params.id).populate('orderItems.productId');
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
  res.json(order);
}

async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };
