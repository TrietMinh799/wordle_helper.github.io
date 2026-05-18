const Pagination = ({
  wordLength,
  postPerPage,
  page,
  setPage,
  limitPagesPagination,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(wordLength / postPerPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber, e) => {
    e.preventDefault();
    setPage(pageNumber);
  };

  return (
    <div className="pagination">
      {page > 1 && (
        <button
          type="button"
          className="arrow"
          aria-label="Previous page"
          onClick={(e) => paginate(page - 1, e)}
        >
          &laquo;
        </button>
      )}
      {pageNumbers
        .slice(page - 1, page + limitPagesPagination)
        .map((number) => (
          <button
            key={number}
            type="button"
            className={number === page ? "number active" : "number"}
            aria-current={number === page ? "page" : undefined}
            onClick={(e) => paginate(number, e)}
          >
            {number}
          </button>
        ))}

      {page < Math.ceil(wordLength / postPerPage) && (
        <button
          type="button"
          className="arrow"
          aria-label="Next page"
          onClick={(e) => paginate(page + 1, e)}
        >
          &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;
