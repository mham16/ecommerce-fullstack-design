const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route  GET /api/products
// @desc   Get all products with filtering, sorting, pagination
// @access Public
router.get('/', asyncHandler(async (req, res) => {
  const {
    search, category, sort, page = 1, limit = 12,
    minPrice, maxPrice, featured, rating, deals
  } = req.query;

  const query = {};

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) query.category = category;

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Featured
  if (featured === 'true') query.featured = true;

  // Rating filter
  if (rating) query.rating = { $gte: Number(rating) };

  // Deals (discounted products)
  if (deals === 'true') query.originalPrice = { $exists: true, $ne: null };

  // Sort
  let sortOption = {};
  switch (sort) {
    case 'price_asc': sortOption = { price: 1 }; break;
    case 'price_desc': sortOption = { price: -1 }; break;
    case 'newest': sortOption = { createdAt: -1 }; break;
    case 'rating': sortOption = { rating: -1 }; break;
    default: sortOption = { createdAt: -1 };
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({ products, total, page: pageNum, pages: Math.ceil(total / limitNum) });
}));

// @route  GET /api/products/:id
// @desc   Get single product
// @access Public
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json(product);
}));

// @route  POST /api/products/:id/reviews
// @desc   Add a review
// @access Private
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }

  const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (already) { res.status(400); throw new Error('You already reviewed this product'); }

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
}));

module.exports = router;
