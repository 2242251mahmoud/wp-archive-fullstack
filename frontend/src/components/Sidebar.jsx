export default function Sidebar({ categories, selectedCategory, onCategoryChange, trending }) {
  return (
    <div className="sidebar-content">
      <div className="sidebar-section">
        <h2>Categories</h2>
        <div className="category-list">
          <button
            className={selectedCategory === 'all' ? 'category-btn active' : 'category-btn'}
            onClick={() => onCategoryChange('all')}
          >
            All Items
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              className={selectedCategory === cat.id ? 'category-btn active' : 'category-btn'}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.name} ({cat.item_count || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h2>Trending</h2>
        <div className="trending-list">
          {trending.length === 0 ? (
            <p className="no-items">No trending items yet</p>
          ) : (
            trending.map((item) => (
              <div key={item.id} className="trending-item">
                <h4>{item.name}</h4>
                {item.rating > 0 && (
                  <span className="rating">★ {item.rating.toFixed(1)}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
