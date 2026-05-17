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
        <p id="arrow" onClick={(e) => paginate(page - 1, e)}>
          &laquo;
        </p>
      )}
      {pageNumbers
        .slice(page - 1, page + limitPagesPagination)
        .map((number) => (
          <p
            key={number}
            className={number === page ? "number active" : "number"}
            onClick={(e) => paginate(number, e)}
          >
            {number}
          </p>
        ))}

      {page < Math.ceil(wordLength / postPerPage) && (
        <p className="arrow" onClick={(e) => paginate(page + 1, e)}>
          &raquo;
        </p>
      )}
    </div>
  );
};

export default Pagination;
