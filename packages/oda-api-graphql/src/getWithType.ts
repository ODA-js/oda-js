export default (promise, type) => {
  return promise.then(result => {
    if (result !== undefined && result !== null) {
      result.__type__ = type;
    }
    return result;
  });
};
