import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FiFilter, FiGrid, FiList, FiChevronDown, FiX } from 'react-icons/fi';
import './ProductListing.css';

const CATEGORIES = ['Electronics','Clothing','Home & Garden','Sports','Books','Toys','Beauty','Automotive','Food','Health'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') || '';

  const LIMIT = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (featured) params.set('featured', featured);
      params.set('page', page);
      params.set('limit', LIMIT);
      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page, minPrice, maxPrice, featured]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="product-listing">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span>Home</span> / <span>Products</span>
          {category && <><span>/</span><span>{category}</span></>}
        </div>

        <div className="listing-layout">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
              <h3>Filters</h3>
              <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><FiX /></button>
            </div>

            {/* Category filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category <FiChevronDown /></h4>
              <div className="filter-list">
                <label className="filter-item">
                  <input type="radio" name="cat" value="" checked={category === ''} onChange={() => updateParam('category', '')} />
                  All Categories
                </label>
                {CATEGORIES.map(c => (
                  <label className="filter-item" key={c}>
                    <input type="radio" name="cat" value={c} checked={category === c} onChange={() => updateParam('category', c)} />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range <FiChevronDown /></h4>
              <div className="price-inputs">
                <input
                  className="form-control"
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                />
                <span>—</span>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                />
              </div>
              <div className="price-presets">
                {[['Under $50','','50'],['$50-$200','50','200'],['$200+','200','']].map(([l,min,max]) => (
                  <button key={l} className="preset-btn"
                    onClick={() => { updateParam('minPrice', min); updateParam('maxPrice', max); }}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Rating filter */}
            <div className="filter-group">
              <h4 className="filter-title">Rating <FiChevronDown /></h4>
              <div className="filter-list">
                {[4,3,2,1].map(r => (
                  <label className="filter-item" key={r}>
                    <input type="radio" name="rating" value={r} onChange={() => updateParam('rating', r)} />
                    {'⭐'.repeat(r)} & up
                  </label>
                ))}
              </div>
            </div>

            <button className="btn btn-outline" style={{ width: '100%' }}
              onClick={() => setSearchParams({})}>
              Clear All Filters
            </button>
          </aside>

          {/* Main */}
          <main className="listing-main">
            {/* Toolbar */}
            <div className="listing-toolbar">
              <div className="toolbar-left">
                <button className="btn btn-outline btn-sm mobile-filter-btn" onClick={() => setSidebarOpen(true)}>
                  <FiFilter /> Filters
                </button>
                <span className="results-count">
                  {loading ? '...' : `${total} products found`}
                  {search && ` for "${search}"`}
                  {category && ` in ${category}`}
                </span>
              </div>
              <div className="toolbar-right">
                <select
                  className="form-control"
                  style={{ width: 'auto' }}
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><FiGrid /></button>
                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><FiList /></button>
              </div>
            </div>

            {/* Active filters */}
            {(search || category || minPrice || maxPrice) && (
              <div className="active-filters">
                {search && <span className="filter-tag">Search: {search} <button onClick={() => updateParam('search', '')}>×</button></span>}
                {category && <span className="filter-tag">{category} <button onClick={() => updateParam('category', '')}>×</button></span>}
                {(minPrice || maxPrice) && (
                  <span className="filter-tag">
                    Price: {minPrice || '0'} - {maxPrice || '∞'}
                    <button onClick={() => { updateParam('minPrice',''); updateParam('maxPrice',''); }}>×</button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: 60 }}>🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={() => setSearchParams({})}>Clear Filters</button>
              </div>
            ) : (
              <div className={view === 'grid' ? 'products-grid-listing' : 'products-list'}>
                {products.map(p => (
                  view === 'grid'
                    ? <ProductCard key={p._id} product={p} />
                    : <ProductListItem key={p._id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" disabled={page === 1}
                  onClick={() => updateParam('page', page - 1)}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button key={n} className={`page-btn ${page === n ? 'active' : ''}`}
                    onClick={() => updateParam('page', n)}>{n}</button>
                ))}
                <button className="page-btn" disabled={page === totalPages}
                  onClick={() => updateParam('page', page + 1)}>›</button>
              </div>
            )}
          </main>
        </div>
      </div>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

function ProductListItem({ product }) {
  const { addToCart } = require('../../context/CartContext').useCart();
  return (
    <div className="product-list-item card">
      <img
        src={product.image || `https://via.placeholder.com/120?text=${encodeURIComponent(product.name)}`}
        alt={product.name}
        className="pli-img"
      />
      <div className="pli-body">
        <div className="pc-category">{product.category}</div>
        <h3 className="pli-name">{product.name}</h3>
        <p className="pli-desc">{product.description?.slice(0, 120)}...</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 'auto' }}>
          <span className="pc-price">${product.price?.toFixed(2)}</span>
          {product.originalPrice && <span className="pc-original">${product.originalPrice?.toFixed(2)}</span>}
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)} style={{ marginLeft: 'auto' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
