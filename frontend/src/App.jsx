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
  const [sortBy, setSortBy] = useState('updated');
  const [apiPlaygroundLoading, setApiPlaygroundLoading] = useState(false);
  const [apiPlaygroundError, setApiPlaygroundError] = useState('');
  const [apiPlaygroundRequest, setApiPlaygroundRequest] = useState('');
  const [apiPlaygroundResult, setApiPlaygroundResult] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // Fetch items
  useEffect(() => {
    checkApiStatus();
    fetchItems();
    fetchCategories();
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch items on page/search/category change
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const runApiPlaygroundRequest = async (path) => {
    try {
      setApiPlaygroundLoading(true);
      setApiPlaygroundError('');
      const requestUrl = `${API_URL}${path}`;
      setApiPlaygroundRequest(`GET ${requestUrl}`);

      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setApiPlaygroundResult(data);
    } catch (err) {
      setApiPlaygroundError(err.message || 'Request failed');
      setApiPlaygroundResult(null);
    } finally {
      setApiPlaygroundLoading(false);
    }
  };

  const getSortedItems = () => {
    const list = [...items];

    if (sortBy === 'rating') {
      return list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sortBy === 'downloads') {
      return list.sort((a, b) => Number(b.download_count || 0) - Number(a.download_count || 0));
    }

    if (sortBy === 'name-asc') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    if (sortBy === 'name-desc') {
      return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    return list;
  };

  const sortedItems = getSortedItems();
  const totalItems = pagination.total || 0;
  const categoryLabel = selectedCategory === 'all'
    ? 'All categories'
    : categories.find((cat) => cat.id === selectedCategory)?.name || 'Filtered category';

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
          <p>Curated discovery for WordPress themes and plugins</p>
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
          <section className="api-playground" aria-label="API playground">
            <h2>API Playground</h2>
            <p>Click an endpoint to send a live request and inspect the JSON response.</p>
            <div className="api-playground-actions">
              <button
                type="button"
                disabled={apiPlaygroundLoading}
                onClick={() => runApiPlaygroundRequest('/health')}
              >
                GET /health
              </button>
              <button
                type="button"
                disabled={apiPlaygroundLoading}
                onClick={() => runApiPlaygroundRequest('/categories')}
              >
                GET /categories
              </button>
              <button
                type="button"
                disabled={apiPlaygroundLoading}
                onClick={() => runApiPlaygroundRequest('/items?page=1&limit=5')}
              >
                GET /items?page=1&limit=5
              </button>
            </div>
            <div className="api-playground-feedback" aria-live="polite" aria-atomic="true">
              {apiPlaygroundRequest && <p className="api-playground-request">{apiPlaygroundRequest}</p>}
              {apiPlaygroundLoading && <p className="api-playground-state">Loading response...</p>}
              {apiPlaygroundError && <p className="api-playground-error">{apiPlaygroundError}</p>}
              {!apiPlaygroundLoading && apiPlaygroundResult && (
                <pre className="api-playground-result">{JSON.stringify(apiPlaygroundResult, null, 2)}</pre>
              )}
            </div>
          </section>

          <SearchBar value={search} onChange={handleSearch} />

          <section className="toolbar" aria-label="Results controls">
            <div className="stats-row">
              <span className="stat-pill">{totalItems.toLocaleString()} items</span>
              <span className="stat-pill">{categories.length} categories</span>
              <span className="stat-pill">{categoryLabel}</span>
            </div>

            <label className="sort-wrap" htmlFor="sortBy">
              Sort by
              <select
                id="sortBy"
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="updated">Recently updated</option>
                <option value="rating">Top rated</option>
                <option value="downloads">Most downloaded</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </label>
          </section>

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
                {sortedItems.map((item) => (
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
