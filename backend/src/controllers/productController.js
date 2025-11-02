import Product from '../models/Product.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

export const listProducts = async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    // category may be slug or ObjectId; only include _id condition if valid
    const or = [{ slug: category }];
    if (mongoose.Types.ObjectId.isValid(category)) or.push({ _id: category });
    const cat = await Category.findOne({ $or: or });
    if (cat) filter.category = cat._id;
    else return res.json([]);
  }
  const items = await Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 });
  res.json(items);
};

export const getProduct = async (req, res) => {
  const item = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!item) return res.status(404).json({ message: 'Product not found' });
  res.json(item);
};

export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl, stock, category } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Missing fields' });
  let categoryId = undefined;
  if (category) {
    const or = [{ slug: category }];
    if (mongoose.Types.ObjectId.isValid(category)) or.push({ _id: category });
    const cat = await Category.findOne({ $or: or });
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    categoryId = cat._id;
  }
  const created = await Product.create({ name, description, price, imageUrl, stock, category: categoryId });
  res.status(201).json(created);
};

export const updateProduct = async (req, res) => {
  const body = { ...req.body };
  if (body.category) {
    const or = [{ slug: body.category }];
    if (mongoose.Types.ObjectId.isValid(body.category)) or.push({ _id: body.category });
    const cat = await Category.findOne({ $or: or });
    if (!cat) return res.status(400).json({ message: 'Invalid category' });
    body.category = cat._id;
  }
  const updated = await Product.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

export const deleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Deleted' });
};
