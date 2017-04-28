export default guard => fn => async (...args) => {
  await guard(...args);
  return await fn(...args);
};
