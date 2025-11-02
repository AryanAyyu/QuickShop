import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  const token = generateToken(user);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
};

export const login = async (req, res) => {
  const { identifier, email, password } = req.body;
  const query = identifier ? { $or: [{ email: identifier }, { name: identifier }] } : { email };
  const user = await User.findOne(query);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token });
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  res.json(req.user);
};
