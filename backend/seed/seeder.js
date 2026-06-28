require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

const users = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@test.com',
    password: 'user123',
    role: 'user',
  },
];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones Pro',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals alike.',
    price: 79.99,
    originalPrice: 129.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 50,
    featured: true,
    rating: 4.5,
    numReviews: 128,
  },
  {
    name: 'Apple iPhone 14 Pro Max 256GB',
    description: 'The latest iPhone with a stunning Super Retina XDR display, A16 Bionic chip, and an incredible camera system with 48MP main sensor.',
    price: 999.99,
    originalPrice: 1199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500',
    stock: 25,
    featured: true,
    rating: 4.8,
    numReviews: 342,
  },
  {
    name: 'Canon EOS R6 Mirrorless Camera',
    description: 'Full-frame mirrorless camera with 20MP sensor, 4K video, in-body image stabilization, and dual card slots. Ideal for photographers and videographers.',
    price: 2499.99,
    originalPrice: 2799.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    stock: 10,
    featured: true,
    rating: 4.7,
    numReviews: 89,
  },
  {
    name: 'Samsung 55" 4K QLED Smart TV',
    description: 'Quantum Dot technology delivers stunning 4K picture quality. Smart TV with built-in streaming apps, voice control, and sleek design.',
    price: 699.99,
    originalPrice: 999.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
    stock: 15,
    featured: true,
    rating: 4.4,
    numReviews: 215,
  },
  {
    name: 'MacBook Pro 14" M3 Chip',
    description: 'Supercharged by M3 chip, this MacBook Pro delivers exceptional performance, up to 22 hours of battery life, and a stunning Liquid Retina XDR display.',
    price: 1999.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    stock: 20,
    featured: true,
    rating: 4.9,
    numReviews: 178,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with Auto NC Optimizer. Up to 30 hours battery. Multipoint connection for two devices simultaneously.',
    price: 249.99,
    originalPrice: 349.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
    stock: 35,
    featured: false,
    rating: 4.6,
    numReviews: 203,
  },
  {
    name: 'Apple Watch Series 9 GPS',
    description: 'Advanced health sensors, crash detection, double tap gesture, and a brighter Always-On Retina display. The ultimate smartwatch.',
    price: 399.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
    stock: 40,
    featured: false,
    rating: 4.5,
    numReviews: 156,
  },
  {
    name: 'Gaming Mechanical Keyboard RGB',
    description: 'Ultra-responsive mechanical switches, full RGB backlighting, N-key rollover, and durable aluminum frame. Perfect for gamers and typists.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    stock: 60,
    featured: false,
    rating: 4.3,
    numReviews: 94,
  },
  {
    name: 'Nike Air Max 270 Sneakers',
    description: 'Lightweight and breathable running shoes with Max Air unit in the heel for all-day comfort. Available in multiple colors.',
    price: 129.99,
    originalPrice: 159.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 80,
    featured: true,
    rating: 4.4,
    numReviews: 267,
  },
  {
    name: 'Adidas Ultraboost Running Shoes',
    description: 'Responsive Boost midsole returns energy with every stride. Primeknit upper for a sock-like fit. The most comfortable running shoe ever.',
    price: 149.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    stock: 45,
    featured: false,
    rating: 4.6,
    numReviews: 189,
  },
  {
    name: 'Men\'s Slim Fit Casual Shirt',
    description: 'Premium cotton blend casual shirt with modern slim fit. Available in sizes S-XXL and multiple colors. Perfect for office or casual wear.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
    stock: 120,
    featured: false,
    rating: 4.2,
    numReviews: 143,
  },
  {
    name: 'Women\'s Floral Summer Dress',
    description: 'Lightweight floral print dress perfect for summer. Features adjustable straps and a flowing A-line silhouette. Machine washable.',
    price: 49.99,
    originalPrice: 79.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500',
    stock: 75,
    featured: true,
    rating: 4.5,
    numReviews: 98,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support, adjustable armrests, breathable mesh back, and 360-degree swivel. Designed for 8+ hours of comfort.',
    price: 299.99,
    originalPrice: 449.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
    stock: 20,
    featured: true,
    rating: 4.7,
    numReviews: 211,
  },
  {
    name: 'Instant Pot Duo 7-in-1 Cooker',
    description: 'Replace 7 kitchen appliances: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1585515656973-c07e39fefa99?w=500',
    stock: 30,
    featured: false,
    rating: 4.8,
    numReviews: 432,
  },
  {
    name: 'Yoga Mat Non-Slip Premium',
    description: 'Extra thick 6mm non-slip yoga mat with alignment lines, carry strap included. Eco-friendly TPE material, sweat-resistant surface.',
    price: 34.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    stock: 90,
    featured: false,
    rating: 4.3,
    numReviews: 167,
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. One of the most important finance books of the decade.',
    price: 14.99,
    originalPrice: 24.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
    stock: 200,
    featured: false,
    rating: 4.9,
    numReviews: 512,
  },
];

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create users
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: admin@test.com / admin123');
    console.log('User:  user@test.com  / user123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seed();
