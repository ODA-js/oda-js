export default () => {
  return {
    edges: [],
    pageInfo: {
      count: 0,
      startCursor: null,
      endCursor: null,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };
};
