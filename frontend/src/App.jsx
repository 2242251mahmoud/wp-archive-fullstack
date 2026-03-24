import { useEffect, useMemo, useState } from 'react';
import './App.css';
import ItemCard from './components/ItemCard';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import Sidebar from './components/Sidebar';

function App() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState({
    hidden_gems: [],
    heavy_hitters: [],
    fresh_finds: []
  });
  const [insights, setInsights] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pagination, setPagination] = useState({});
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('checking');
  const [sortBy, setSortBy] = useState('updated');
  const [activeCollection, setActiveCollection] = useState('hidden_gems');
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wp-archive-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [compareItems, setCompareItems] = useState([]);
  const [compareData, setCompareData] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    checkApiStatus();
    fetchItems();
    fetchCategories();
    fetchTrending();
    fetchCollections();
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, selectedCategory]);

  useEffect(() => {
    localStorage.setItem('wp-archive-favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    if (compareItems.length < 2) {
      setCompareData(compareItems);
      return;
    }

    fetchCompare(compareItems.map((item) => item.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compareItems]);

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

  const fetchCollections = async () => {
    try {
      const response = await fetch(`${API_URL}/items/collections?limit=6`);
      if (!response.ok) {
        throw new Error('Failed to load collections');
      }
      const data = await response.json();
      setCollections(data);
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${API_URL}/items/insights`);
      if (!response.ok) {
        throw new Error('Failed to load insights');
      }
      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching insights:', err);
    }
  };

  const fetchCompare = async (ids) => {
    try {
      const response = await fetch(`${API_URL}/items/compare?ids=${ids.join(',')}`);
      if (!response.ok) {
        throw new Error('Failed to compare items');
      }
      const data = await response.json();
      setCompareData(data.items || []);
    } catch (err) {
      console.error('Error fetching compare data:', err);
      setCompareData(compareItems);
    }
  };

  const retryAll = () => {
    checkApiStatus();
    fetchItems();
    fetchCategories();
    fetchTrending();
    fetchCollections();
    fetchInsights();
  };

  const toggleFavorite = (item) => {
    setFavoriteIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      }
      return [...prev, item.id];
    });
  };

  const toggleCompare = (item) => {
    setCompareItems((prev) => {
      const exists = prev.some((entry) => entry.id === item.id);
      if (exists) {
        return prev.filter((entry) => entry.id !== item.id);
      }

      if (prev.length >= 3) {
        return [...prev.slice(1), item];
      }

      return [...prev, item];
    });
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

  const itemLookup = useMemo(() => {
    const all = [
      ...items,
      ...trending,
      ...(collections.hidden_gems || []),
      ...(collections.heavy_hitters || []),
      ...(collections.fresh_finds || []),
      ...compareItems
    ];

    return all.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [items, trending, collections, compareItems]);

  const favoriteItems = favoriteIds.map((id) => itemLookup[id]).filter(Boolean);
  const activeCollectionItems = collections[activeCollection] || [];

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
          <SearchBar value={search} onChange={handleSearch} />

          <section className="toolbar" aria-label="Results controls">
            <div className="stats-row">
              <span className="stat-pill">{totalItems.toLocaleString()} items</span>
              <span className="stat-pill">{categories.length} categories</span>
              <span className="stat-pill">{categoryLabel}</span>
              <span className="stat-pill">{favoriteIds.length} saved</span>
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

          <section className="insights-panel">
            <div className="insight-tile">
              <h4>Average Rating</h4>
              <p>{Number(insights?.stats?.avg_rating || 0).toFixed(2)}</p>
            </div>
            <div className="insight-tile">
              <h4>Largest Download Count</h4>
              <p>{Number(insights?.stats?.max_download_count || 0).toLocaleString()}</p>
            </div>
            <div className="insight-tile">
              <h4>Top Category</h4>
              <p>{insights?.top_category?.name || 'Loading...'}</p>
            </div>
            <div className="insight-tile">
              <h4>Top Rated Pick</h4>
              <p>{insights?.top_rated?.name || 'Loading...'}</p>
            </div>
          </section>

          <section className="discovery-lab">
            <div className="section-head">
              <h3>Discovery Lab</h3>
              <div className="collection-switch">
                <button
                  type="button"
                  className={activeCollection === 'hidden_gems' ? 'switch-btn active' : 'switch-btn'}
                  onClick={() => setActiveCollection('hidden_gems')}
                >
                  Hidden Gems
                </button>
                <button
                  type="button"
                  className={activeCollection === 'heavy_hitters' ? 'switch-btn active' : 'switch-btn'}
                  onClick={() => setActiveCollection('heavy_hitters')}
                >
                  Heavy Hitters
                </button>
                <button
                  type="button"
                  className={activeCollection === 'fresh_finds' ? 'switch-btn active' : 'switch-btn'}
                  onClick={() => setActiveCollection('fresh_finds')}
                >
                  Fresh Finds
                </button>
              </div>
            </div>

            <div className="collection-grid">
              {activeCollectionItems.map((item) => (
                <ItemCard
                  key={`collection-${item.id}`}
                  item={item}
                  isFavorite={favoriteIds.includes(item.id)}
                  isCompared={compareItems.some((entry) => entry.id === item.id)}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          </section>

          {compareItems.length > 0 && (
            <section className="compare-bench">
              <div className="section-head">
                <h3>Stack Compare Bench</h3>
                <button type="button" className="switch-btn" onClick={() => setCompareItems([])}>
                  Clear
                </button>
              </div>
              <div className="compare-grid">
                {compareData.map((item) => (
                  <div key={`compare-${item.id}`} className="compare-card">
                    <h4>{item.name}</h4>
                    <p>Rating: {Number(item.rating || 0).toFixed(1)}</p>
                    <p>Downloads: {Number(item.download_count || 0).toLocaleString()}</p>
                    <p>Author: {item.author || 'Unknown'}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {favoriteItems.length > 0 && (
            <section className="favorites-vault">
              <div className="section-head">
                <h3>Favorites Vault</h3>
                <span className="vault-count">{favoriteItems.length} saved</span>
              </div>
              <div className="collection-grid">
                {favoriteItems.map((item) => (
                  <ItemCard
                    key={`favorite-${item.id}`}
                    item={item}
                    isFavorite
                    isCompared={compareItems.some((entry) => entry.id === item.id)}
                    onToggleFavorite={toggleFavorite}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            </section>
          )}

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
              <div className="section-head main-results-head">
                <h3>All Results</h3>
              </div>
              <div className="items-grid">
                {sortedItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isFavorite={favoriteIds.includes(item.id)}
                    isCompared={compareItems.some((entry) => entry.id === item.id)}
                    onToggleFavorite={toggleFavorite}
                    onToggleCompare={toggleCompare}
                  />
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
