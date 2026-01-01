const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// create product (supports multipart/form-data images)
async function createProduct(req, res) {
  try {
    const { name, slug, description, categoryId, price, discountPrice, stockQuantity, vedioUrl, carretRate } = req.body;
    const images = [];
    let certificateImageUrl = '';

    // Handle files when using upload.fields()
    if (req.files) {
      // Handle product images
      if (req.files.images && req.files.images.length > 0) {
        for (const f of req.files.images) {
          const url = await uploadToCloudinary(f.buffer, f.originalname);
          images.push({ url, isPrimary: false });
        }
        if (images.length > 0) images[0].isPrimary = true;
      }

      // Handle certificate image
      if (req.files.certificateImage && req.files.certificateImage.length > 0) {
        certificateImageUrl = await uploadToCloudinary(
          req.files.certificateImage[0].buffer, 
          req.files.certificateImage[0].originalname
        );
      }
    }

    // Parse carretRate if it's a string
    let parsedCarretRate = null;
    if (carretRate) {
      if (typeof carretRate === 'string') {
        parsedCarretRate = JSON.parse(carretRate);
      } else {
        parsedCarretRate = carretRate;
      }
    }

    const p = await Product.create({
      name, 
      slug, 
      description,
      categoryId,
      price: +price,
      discountPrice: discountPrice ? +discountPrice : undefined,
      stockQuantity: +stockQuantity || 0,
      vedioUrl: vedioUrl || null,
      carretRate: parsedCarretRate ? { 
        min: parseFloat(parsedCarretRate.min) || 1, 
        max: parseFloat(parsedCarretRate.max) || 1 
      } : undefined,
      certificateImage: certificateImageUrl || '',
      images
    });

    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    const updates = { ...req.body };
    
    // Handle files when using upload.fields()
    if (req.files) {
      // Handle product images
      if (req.files.images && req.files.images.length > 0) {
        const newImages = [];
        
        for (const f of req.files.images) {
          const url = await uploadToCloudinary(f.buffer, f.originalname);
          newImages.push({ url, isPrimary: false });
        }
        
        // Merge with existing images if any
        if (newImages.length > 0) {
          if (!updates.images) updates.images = [];
          updates.images = updates.images.concat(newImages);
        }
      }

      // Handle certificate image
      if (req.files.certificateImage && req.files.certificateImage.length > 0) {
        updates.certificateImage = await uploadToCloudinary(
          req.files.certificateImage[0].buffer,
          req.files.certificateImage[0].originalname
        );
      }
    }

    // Parse carretRate if it's a string
    if (updates.carretRate) {
      if (typeof updates.carretRate === 'string') {
        updates.carretRate = JSON.parse(updates.carretRate);
      }
      updates.carretRate = {
        min: parseFloat(updates.carretRate.min) || 1,
        max: parseFloat(updates.carretRate.max) || 1
      };
    }

    // Convert numeric fields
    if (updates.price) updates.price = Number(updates.price);
    if (updates.discountPrice) updates.discountPrice = Number(updates.discountPrice);
    if (updates.stockQuantity !== undefined) updates.stockQuantity = Number(updates.stockQuantity);

    const p = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('categoryId');
    
    if (!p) return res.status(404).json({ message: 'Product not found' });
    
    res.json(p);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ message: err.message });
  }
}

// ... rest of your functions remain the same
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
      .sort({ createdAt: -1 })
      .populate('categoryId');

    res.json(products);
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteProduct(req, res) {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
}

async function countByCategory(req, res) {
  try {
    const count = await Product.countDocuments({ categoryId: req.params.categoryId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { createProduct, listProducts, listProductsForNavBar, getProduct, updateProduct, deleteProduct, countByCategory };