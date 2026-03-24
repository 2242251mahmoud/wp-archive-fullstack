import { useState, useEffect } from 'react';
import './App.css';
import ItemCard from './components/ItemCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({});
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch items
  useEffect(() => {
    checkApiStatus();
    fetchItems();
    fetchCategories();
    fetchTrending();
  }, []);

  // Fetch items on page/search/category change
  useEffect(() => {
    fetchItems();
  }, [page, search, selectedCategory]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      setApiStatus('online');
    } catch (err) {
      console.error('Error checking API health:', err);
      setApiStatus('offline');
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      let url = `${API_URL}/items?page=${page}&limit=50`;

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load items');
      }
      setApiStatus('online');
      const data = await response.json();

      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching items:', err);
      setApiStatus('offline');
      setError('Could not load items. Please check that the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchTrending = async () => {
    try {
      const response = await fetch(`${API_URL}/items/trending/items?limit=5`);
      if (!response.ok) {
        throw new Error('Failed to load trending items');
      }
      const data = await response.json();
      setTrending(data);
    } catch (err) {
      console.error('Error fetching trending:', err);
    }
  };

  const retryAll = () => {
    checkApiStatus();
    fetchItems();
    fetchCategories();
    fetchTrending();
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-top-row">
            <h1>WordPress Archive</h1>
            <button
              type="button"
              className={`api-status-badge ${apiStatus}`}
              onClick={checkApiStatus}
              title="Click to re-check backend status"
            >
              API {apiStatus}
            </button>
          </div>
          <p>Browse thousands of WordPress themes and plugins</p>
        </div>
      </header>

      <div className="container main-content">
        <aside className="sidebar">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            trending={trending}
          />
        </aside>

        <main className="main">
          <SearchBar value={search} onChange={handleSearch} />

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button type="button" className="btn-retry" onClick={retryAll}>
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="loading">Loading...</div>
          ) : items.length === 0 ? (
            <div className="no-results">No items found</div>
          ) : (
            <>
              <div className="items-grid">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>

              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
