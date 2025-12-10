const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// create product (supports multipart/form-data images)
async function createProduct(req, res) {
  try {
    const { name, slug, description, categoryId, price, discountPrice, stockQuantity } = req.body;
    const images = [];

    if (req.files && req.files.length) {
      for (const f of req.files) {
        const url = await uploadToCloudinary(f.buffer, f.originalname);
        images.push({ url, isPrimary: false });
      }
      if (images.length) images[0].isPrimary = true;
    }

    const p = await Product.create({
      name, slug, description,
      categoryId,
      price: +price,
      discountPrice: discountPrice ? +discountPrice : undefined,
      stockQuantity: +stockQuantity || 0,
      images
    });

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function listProducts(req, res) {
  const products = await Product.find().populate('categoryId');
  res.json(products);
}

async function getProduct(req, res) {
  const p = await Product.findById(req.params.id).populate('categoryId');
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
}

async function listProductsForNavBar(req, res) {
  try {
    const { category, limit, skip } = req.query;
    const filter = {};
    if (category) filter.categoryId = String(category);

    const qLimit = Number(limit) || 0;
    const qSkip = Number(skip) || 0;

    const products = await Product.find(filter)
      .skip(qSkip)
      .limit(qLimit)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}



async function updateProduct(req, res) {
  try {
    const updates = req.body;
    if (req.files && req.files.length) {
      const images = [];
      for (const f of req.files) {
        const url = await uploadToCloudinary(f.buffer, f.originalname);
        images.push({ url, isPrimary: false });
      }
      if (!updates.images) updates.images = [];
      updates.images = updates.images.concat(images);
    }
    const p = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}

module.exports = { createProduct, listProducts, listProductsForNavBar,getProduct, updateProduct, deleteProduct };
