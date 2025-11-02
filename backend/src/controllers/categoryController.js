import Category from '../models/Category.js';

export const listCategories = async (req, res) => {
  const cats = await Category.find().sort({ createdAt: -1 });
  res.json(cats);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const exists = await Category.findOne({ $or: [{ name }, { slug }] });
  if (exists) return res.status(400).json({ message: 'Category already exists' });
  const created = await Category.create({ name, slug });
  res.status(201).json(created);
};

export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
