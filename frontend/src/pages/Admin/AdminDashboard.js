import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiPackage, FiUsers, FiShoppingCart, FiDollarSign,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiHome, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

export default function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
        </Routes>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">⚙️ Admin Panel</div>
      <nav className="admin-nav">
        <Link to="/admin" className="admin-nav-link"><FiHome /> Dashboard</Link>
        <Link to="/admin/products" className="admin-nav-link"><FiPackage /> Products</Link>
        <Link to="/" className="admin-nav-link"><FiShoppingCart /> View Store</Link>
      </nav>
      <button className="admin-nav-link logout" onClick={() => { logout(); navigate('/'); }}>
        <FiLogOut /> Logout
      </button>
    </aside>
  );
}

function AdminHome() {
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0, revenue: 0 });
  useEffect(() => {
    axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);
  const CARDS = [
    { icon: <FiPackage />, label: 'Total Products', value: stats.products, color: '#e3f2fd', accent: '#1976d2' },
    { icon: <FiUsers />, label: 'Total Users', value: stats.users, color: '#e8f5e9', accent: '#388e3c' },
    { icon: <FiShoppingCart />, label: 'Total Orders', value: stats.orders, color: '#fff3e0', accent: '#f57c00' },
    { icon: <FiDollarSign />, label: 'Revenue', value: `$${stats.revenue?.toLocaleString()}`, color: '#fce4ec', accent: '#c2185b' },
  ];
  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <Link to="/admin/products/new" className="btn btn-primary"><FiPlus /> Add Product</Link>
      </div>
      <div className="stats-grid">
        {CARDS.map((c, i) => (
          <div className="stat-card" key={i} style={{ background: c.color }}>
            <div className="stat-icon" style={{ color: c.accent }}>{c.icon}</div>
            <div>
              <div className="stat-value" style={{ color: c.accent }}>{c.value}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="admin-quick-links">
        <Link to="/admin/products" className="admin-card card">
          <FiPackage size={32} />
          <h3>Manage Products</h3>
          <p>Add, edit, or delete products</p>
        </Link>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get('/api/admin/products');
      setProducts(r.data || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <h1>Products ({products.length})</h1>
        <Link to="/admin/products/new" className="btn btn-primary"><FiPlus /> Add Product</Link>
      </div>

      <div className="admin-toolbar">
        <div className="input-icon-wrap" style={{ maxWidth: 300 }}>
          <FiSearch className="input-icon" />
          <input className="form-control" style={{ paddingLeft: 38 }}
            placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th><th>Name</th><th>Category</th>
                <th>Price</th><th>Stock</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || `https://via.placeholder.com/50?text=${p.name?.[0]}`}
                      alt={p.name} className="admin-product-img"
                    />
                  </td>
                  <td className="admin-product-name">{p.name}</td>
                  <td><span className="badge badge-primary">{p.category}</span></td>
                  <td><strong>${p.price?.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge ${p.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {p.stock > 0 ? p.stock : 'Out'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/admin/products/edit/${p._id}`} className="btn btn-outline btn-sm">
                        <FiEdit2 />
                      </Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state"><p>No products found.</p></div>
          )}
        </div>
      )}
    </div>
  );
}

function ProductForm() {
  const navigate = useNavigate();
  const { id } = require('react-router-dom').useParams();
  const isEdit = !!id;
  const [form, setForm] = useState({
    name: '', price: '', originalPrice: '', description: '',
    category: '', stock: '', image: '', featured: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      axios.get(`/api/products/${id}`).then(r => setForm({
        name: r.data.name || '',
        price: r.data.price || '',
        originalPrice: r.data.originalPrice || '',
        description: r.data.description || '',
        category: r.data.category || '',
        stock: r.data.stock || '',
        image: r.data.image || '',
        featured: r.data.featured || false,
      })).catch(() => toast.error('Failed to load product'));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await axios.put(`/api/admin/products/${id}`, form);
        toast.success('Product updated!');
      } else {
        await axios.post('/api/admin/products', form);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const CATEGORIES = ['Electronics','Clothing','Home & Garden','Sports','Books','Toys','Beauty','Automotive','Food','Health'];

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        <button className="btn btn-outline" onClick={() => navigate('/admin/products')}>← Back</button>
      </div>

      <div className="product-form-card card">
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input className="form-control" required placeholder="Enter product name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select className="form-control" required value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($) *</label>
              <input className="form-control" type="number" step="0.01" min="0" required placeholder="0.00"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Original Price ($)</label>
              <input className="form-control" type="number" step="0.01" min="0" placeholder="0.00"
                value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input className="form-control" type="number" min="0" required placeholder="0"
                value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input className="form-control" type="url" placeholder="https://example.com/image.jpg"
              value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
            {form.image && <img src={form.image} alt="preview" className="img-preview" />}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea className="form-control" rows={5} required
              placeholder="Enter product description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <label className="checkbox-label">
            <input type="checkbox" checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })} />
            <span>Mark as Featured Product</span>
          </label>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
