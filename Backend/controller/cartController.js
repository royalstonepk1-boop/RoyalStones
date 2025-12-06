const Cart = require('../models/Cart');

async function getCart(req, res) {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
  res.json(cart);
}

async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id, items: [{ productId, quantity }] });
    return res.json(cart);
  }
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx > -1) cart.items[idx].quantity += +quantity;
  else cart.items.push({ productId, quantity });
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
}

async function updateCartItem(req, res) {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const idx = cart.items.findIndex(i => i.productId.toString() === productId);
  if (idx === -1) return res.status(404).json({ message: 'Item not found' });
  if (quantity <= 0) cart.items.splice(idx, 1);
  else cart.items[idx].quantity = quantity;
  cart.updatedAt = Date.now();
  await cart.save();
  res.json(cart);
}

async function clearCart(req, res) {
  await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
  res.json({ message: 'Cart cleared' });
}

module.exports = { getCart, addToCart, updateCartItem, clearCart };
