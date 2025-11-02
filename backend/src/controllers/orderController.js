import Order from '../models/Order.js';
import Product from '../models/Product.js';

const computeTotal = async (items) => {
  let total = 0;
  for (const it of items) {
    const p = await Product.findById(it.product);
    if (!p) throw new Error('Product not found');
    total += (p.price || 0) * (it.qty || 1);
  }
  return Number(total.toFixed(2));
};

export const createOrder = async (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Items required' });
  const total = await computeTotal(items);
  const order = await Order.create({ user: req.user._id, items, total });
  res.status(201).json(order);
};

export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.product');
  res.json(orders);
};

export const allOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product');
  res.json(orders);
};

export const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
};
