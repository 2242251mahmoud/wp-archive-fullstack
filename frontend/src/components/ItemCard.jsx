import { useState } from 'react';

export default function ItemCard({
  item,
  isFavorite = false,
  isCompared = false,
  onToggleFavorite,
  onToggleCompare
}) {
  const [copied, setCopied] = useState(false);

  const slug = item.slug || item.name?.toLowerCase().replace(/\s+/g, '-');
  const installType = item.category_id === 1 ? 'theme' : 'plugin';
  const wpCliCommand = `wp ${installType} install ${slug} --activate`;

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(wpCliCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch (err) {
      console.error('Could not copy command', err);
    }
  };

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
        <div className="card-action-row">
          <button
            type="button"
            className={isFavorite ? 'btn-chip active' : 'btn-chip'}
            onClick={() => onToggleFavorite?.(item)}
          >
            {isFavorite ? 'Saved' : 'Save'}
          </button>
          <button
            type="button"
            className={isCompared ? 'btn-chip active' : 'btn-chip'}
            onClick={() => onToggleCompare?.(item)}
          >
            {isCompared ? 'In Compare' : 'Compare'}
          </button>
          <button
            type="button"
            className={copied ? 'btn-chip copied' : 'btn-chip'}
            onClick={handleCopyCommand}
            title="Copy WP-CLI install command"
          >
            {copied ? 'Copied' : 'WP-CLI'}
          </button>
        </div>
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
