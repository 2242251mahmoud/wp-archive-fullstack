export default function Pagination({ page, pages, onPageChange }) {
  const getPageNumbers = () => {
    const nums = [];
    const maxShow = 5;

    if (pages <= maxShow) {
      for (let i = 1; i <= pages; i++) {
        nums.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= maxShow; i++) {
          nums.push(i);
        }
      } else if (page >= pages - 2) {
        for (let i = pages - maxShow + 1; i <= pages; i++) {
          nums.push(i);
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          nums.push(i);
        }
      }
    }

    return nums;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-prev"
      >
        Previous
      </button>

      <div className="page-numbers">
        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={num === page ? 'page-num active' : 'page-num'}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn-next"
      >
        Next
      </button>
    </div>
  );
}
