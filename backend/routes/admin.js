const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route  GET /api/admin/stats
// @desc   Dashboard statistics
// @access Admin
router.get('/stats', asyncHandler(async (req, res) => {
  const [products, users, orders] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments(),
    Order.countDocuments(),
  ]);

  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const revenue = revenueResult[0]?.total || 0;

  res.json({ products, users, orders, revenue });
}));

// @route  GET /api/admin/products
// @desc   Get all products (admin view, no pagination limit)
// @access Admin
router.get('/products', asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  res.json(products);
}));

// @route  POST /api/admin/products
// @desc   Create product
// @access Admin
router.post('/products', asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, stock, image, images, featured, specifications } = req.body;

  if (!name || !description || !price || !category || stock === undefined) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const product = await Product.create({
    name, description,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : null,
    category, stock: Number(stock),
    image: image || '',
    images: images || [],
    featured: featured || false,
    specifications: specifications || {},
  });

  res.status(201).json(product);
}));

// @route  PUT /api/admin/products/:id
// @desc   Update product
// @access Admin
router.put('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const { name, description, price, originalPrice, category, stock, image, images, featured, specifications } = req.body;

  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.originalPrice = originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : product.originalPrice;
  product.category = category ?? product.category;
  product.stock = stock !== undefined ? Number(stock) : product.stock;
  product.image = image ?? product.image;
  product.images = images ?? product.images;
  product.featured = featured !== undefined ? featured : product.featured;
  product.specifications = specifications ?? product.specifications;

  const updated = await product.save();
  res.json(updated);
}));

// @route  DELETE /api/admin/products/:id
// @desc   Delete product
// @access Admin
router.delete('/products/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.deleteOne();
  res.json({ message: 'Product deleted successfully' });
}));

// @route  GET /api/admin/users
// @desc   Get all users
// @access Admin
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
}));

// @route  DELETE /api/admin/users/:id
// @desc   Delete user
// @access Admin
router.delete('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin user'); }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
}));

// @route  GET /api/admin/orders
// @desc   Get all orders
// @access Admin
router.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// @route  PUT /api/admin/orders/:id/deliver
// @desc   Mark order as delivered
// @access Admin
router.put('/orders/:id/deliver', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';
  const updated = await order.save();
  res.json(updated);
}));

module.exports = router;
