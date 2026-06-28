# 🛒 BrandStore — Full-Stack eCommerce App

> DevelopersHub Corporation Internship Project  
> Built with React.js, Node.js, Express.js, and MongoDB

---

## 🗂️ Project Structure

```
ecommerce-fullstack-design/
├── frontend/          # React.js application
│   └── src/
│       ├── components/   (Navbar, Footer, ProductCard, etc.)
│       ├── pages/        (Home, ProductListing, ProductDetails, Cart, Login, Signup, Admin)
│       └── context/      (AuthContext, CartContext)
├── backend/           # Node.js + Express API
│   ├── models/        (User, Product, Order)
│   ├── routes/        (auth, products, orders, admin)
│   ├── middleware/    (auth/JWT, errorHandler)
│   └── seed/          (sample data seeder)
├── package.json       (root scripts to run both)
├── render.yaml        (Render deployment)
└── vercel.json        (Vercel deployment)
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-fullstack-design.git
cd ecommerce-fullstack-design
```

### 2. Install all dependencies
```bash
npm run install-all
```

### 3. Configure environment variables
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here_make_it_long
PORT=5000
NODE_ENV=development
```

> **MongoDB Atlas (recommended):** Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) and replace MONGO_URI with your connection string.

### 4. Seed the database with sample data
```bash
npm run seed
```

This creates:
- **Admin account:** `admin@test.com` / `admin123`
- **Test user:** `user@test.com` / `user123`
- **16 sample products** across all categories

### 5. Start development servers
```bash
npm run dev
```

This starts:
- Frontend at `http://localhost:3000`
- Backend at `http://localhost:5000`

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get profile | Private |
| PUT | `/api/auth/profile` | Update profile | Private |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get all (filter/sort/paginate) | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products/:id/reviews` | Add review | Private |

**Query params for GET /api/products:**
- `search` - text search
- `category` - filter by category
- `sort` - `price_asc`, `price_desc`, `newest`, `rating`
- `page` / `limit` - pagination
- `minPrice` / `maxPrice` - price range
- `featured=true` - featured only
- `deals=true` - discounted only

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create order | Private |
| GET | `/api/orders/myorders` | My orders | Private |
| GET | `/api/orders/:id` | Single order | Private |

### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST | `/api/admin/products` | List / Create product |
| PUT/DELETE | `/api/admin/products/:id` | Update / Delete product |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/orders` | All orders |

---

## 🚀 Deployment

### Option A: Render (Recommended)

1. Push code to GitHub
2. Create account at [render.com](https://render.com)
3. New Web Service → Connect GitHub repo
4. Render auto-detects `render.yaml`
5. Add environment variables in Render dashboard:
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → any long random string
   - `FRONTEND_URL` → your Render URL

### Option B: Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard.

### Option C: Heroku

```bash
heroku create your-app-name
heroku config:set MONGO_URI=... JWT_SECRET=... NODE_ENV=production
git push heroku main
```

---

## 📱 Features

### Week 1 — Frontend ✅
- [x] Responsive Home Page with hero, categories, featured products
- [x] Product Listing with filters (category, price, rating), sorting, pagination
- [x] Product Details with image gallery, quantity selector, reviews tab
- [x] Shopping Cart with quantity controls and order summary
- [x] Mobile-responsive design (CSS Grid + Flexbox)

### Week 2 — Backend ✅
- [x] MongoDB schemas (User, Product, Order)
- [x] REST API with full CRUD for products
- [x] Dynamic product fetching in all pages
- [x] Search bar filtering by name/category
- [x] Sample data seeder with 16 products

### Week 3 — Features + Deployment ✅
- [x] JWT Authentication (login/signup/profile)
- [x] Cart persistence via localStorage
- [x] Admin Panel with product CRUD + dashboard stats
- [x] Protected admin routes
- [x] Deployment configs for Render/Vercel/Heroku
- [x] Responsive testing for mobile + desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router 6, Axios |
| Styling | CSS3, CSS Variables, CSS Grid/Flexbox |
| Icons | react-icons (Feather) |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Notifications | react-toastify |
| Deployment | Render / Vercel / Heroku |

---

## 📸 Pages

- `/` — Home Page
- `/products` — Product Listing (with filters)
- `/products/:id` — Product Details
- `/cart` — Shopping Cart
- `/login` — Sign In
- `/signup` — Create Account
- `/admin` — Admin Dashboard *(admin only)*
- `/admin/products` — Product Management *(admin only)*
- `/admin/products/new` — Add Product *(admin only)*

---

## 👤 Author

Built for **DevelopersHub Corporation** Internship Program  
GitHub: [ecommerce-fullstack-design](https://github.com/YOUR_USERNAME/ecommerce-fullstack-design)

---

*Good Luck! Make sure your project is well-documented, responsive, and fully functional.*
