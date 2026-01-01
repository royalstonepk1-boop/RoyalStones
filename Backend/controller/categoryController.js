const Category = require('../models/Category');

async function createCategory(req, res) {
  try {
    const { name, parentId ,hasFingerSize } = req.body;
    const cat = await Category.create({ name, parentId: parentId || null ,hasFingerSize:hasFingerSize});
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function listCategories(req, res) {
  const cats = await Category.find();
  res.json(cats);
}

async function getCategory(req, res) {
  // //console.log("triggered");
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Not found' });
  res.json(cat);
}

async function updateCategory(req, res) {
  const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
}

async function deleteCategory(req, res) {
  //console.log(req.params.id);
  const resp = await Category.findByIdAndDelete(req.params.id);
  //console.log(resp);
  res.json(resp);
}

module.exports = { createCategory, listCategories, getCategory, updateCategory, deleteCategory };
