export const generatePaginationInfo = ({ totalElements, curPage, perPage }) => {
  const last = totalElements < perPage * curPage;
  const first = Number(curPage) === 1;
  const totalPages = Math.floor(totalElements / perPage) + 1;
  const size = Number(perPage);
  return {
    last,
    first,
    totalPages,
    size,
    totalElements,
    curPage: totalElements === 0 ? 0 : Number(curPage)
  };
};

export const generatePaginationResult = ({
  totalElements,
  curPage,
  perPage,
  content
}) => {
  return Object.assign(
    generatePaginationInfo({ totalElements, curPage, perPage }),
    { content }
  );
};
