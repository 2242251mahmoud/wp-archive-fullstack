export default function ItemCard({ item }) {
  return (
    <div className="item-card">
      <div className="item-card-header">
        <h3>{item.name}</h3>
      </div>
      <div className="item-card-body">
        <p className="description">{item.description?.substring(0, 100)}...</p>
        <div className="meta">
          <span className="author">By {item.author}</span>
          {item.rating > 0 && (
            <span className="rating">★ {item.rating.toFixed(1)}</span>
          )}
        </div>
      </div>
      <div className="item-card-footer">
        <a
          href={item.download_link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-download"
        >
          View on WordPress.org
        </a>
      </div>
    </div>
  );
}
