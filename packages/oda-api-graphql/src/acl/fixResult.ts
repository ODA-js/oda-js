export default guard => fn => async (...args) => {
  const result = await fn(...args);
  return await guard(result);
};
