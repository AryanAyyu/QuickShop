import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

const run = async () => {
  await connectDB();

  // Ensure default admin exists
  const adminEmail = 'admin@admin.com';
  const adminPass = '12345678';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashed = await bcrypt.hash(adminPass, 10);
    admin = await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log('Admin user created:', adminEmail);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
    console.log('Existing user promoted to admin:', adminEmail);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  await Category.deleteMany({});
  await Product.deleteMany({});

  const categories = await Category.insertMany([
    { name: 'Apparel', slug: 'apparel' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Accessories', slug: 'accessories' },
  ]);

  const map = Object.fromEntries(categories.map(c => [c.slug, c._id]));

  const products = [
    { name: 'Basic T-Shirt', description: 'Comfortable cotton tee', price: 499, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1520975940209-7a5d26bb0d71?w=800&q=80', category: map['apparel'] },
    { name: 'Ceramic Mug', description: 'Dishwasher safe 350ml', price: 199, stock: 120, imageUrl: 'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&q=80', category: map['home-kitchen'] },
    { name: 'Canvas Tote', description: 'Reusable shopping bag', price: 149, stock: 80, imageUrl: 'https://images.unsplash.com/photo-1542382257-80dedb725088?w=800&q=80', category: map['accessories'] },
    { name: 'Hoodie', description: 'Warm fleece hoodie', price: 1299, stock: 35, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', category: map['apparel'] },
  ];

  await Product.insertMany(products);

  console.log('Seed complete. Categories and products added.');
  await mongoose.connection.close();
};

run().catch(err => { console.error(err); process.exit(1); });
