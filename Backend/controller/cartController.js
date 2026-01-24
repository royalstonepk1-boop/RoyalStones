const Cart = require('../models/Cart');

// ✅ Single DB call - returns populated cart
async function getCart(req, res) {
  try {
    let cart = await Cart.findOne({ userId: req.user._id })
      .populate('items.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }
    // console.log(cart, "cart")
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Optimized - single save + return updated cart
async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 , fingerSize ,carretValue, msgNote } = req.body;
    
    let cart = await Cart.findOne({ userId: req.user._id });
    
    if (!cart) {
      cart = new Cart({ 
        userId: req.user._id, 
        items: [{ productId, quantity, fingerSize,carretValue,msgNote }] 
      });
    } else {
      const idx = cart.items.findIndex(
        i => i.productId.toString() === productId &&
            i.fingerSize === fingerSize &&
            i.carretValue === carretValue
      );
      
      if (idx > -1) {
        cart.items[idx].quantity += quantity;
        cart.items[idx].fingerSize = fingerSize;
        cart.items[idx].carretValue = carretValue;
      } else {
        cart.items.push({ productId, quantity, fingerSize ,carretValue ,msgNote });
      }
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    
    // Populate before returning
    await cart.populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Update quantity - optimized single operation
async function updateCartItem(req, res) {
  try {
    const { productId, quantity , fingerSize ,carretValue } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const idx = cart.items.findIndex(
      i => i.productId.toString() === productId &&
          i.fingerSize === fingerSize &&
          i.carretValue === carretValue
    );
    
    if (idx === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (quantity <= 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    if (fingerSize) {
      cart.items[idx].fingerSize = fingerSize;
    }
    if (carretValue) {
      cart.items[idx].carretValue = carretValue;
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ✅ Remove entire item - fixed variable name bug
async function removeFullSingleItem(req, res) {
  try {
    const { productId,fingerSize, carretValue } = req.body;
    
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const idx = cart.items.findIndex(
      i => i.productId.toString() === productId &&
          i.fingerSize === fingerSize &&
          i.carretValue === carretValue
    );
    
    if (idx === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    cart.items.splice(idx, 1); // ✅ Fixed: was 'itemIndex'
    cart.updatedAt = Date.now();
    await cart.save();
    await cart.populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function clearCart(req, res) {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user._id }, 
      { items: [], updatedAt: Date.now() }
    );
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFullSingleItem, 
  clearCart 
};