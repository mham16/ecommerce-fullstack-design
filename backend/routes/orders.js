const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

router.use(protect);

// @route  POST /api/orders
// @desc   Create new order
// @access Private
router.post('/', asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400); throw new Error('No order items');
  }

  // Calculate prices
  const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice >= 50 ? 0 : 9.99;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Reduce stock
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'Card',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  res.status(201).json(order);
}));

// @route  GET /api/orders/myorders
// @desc   Get logged-in user's orders
// @access Private
router.get('/myorders', asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
}));

// @route  GET /api/orders/:id
// @desc   Get order by ID
// @access Private
router.get('/:id', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json(order);
}));

// @route  PUT /api/orders/:id/pay
// @desc   Update order to paid
// @access Private
router.put('/:id/pay', asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'processing';
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    emailAddress: req.body.payer?.email_address,
  };
  const updated = await order.save();
  res.json(updated);
}));

module.exports = router;
