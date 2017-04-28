export default guard => fn => async (...args) => {
  const fixed = await guard(...args);
  return await fn(...fixed);
};
