export default guard => fn => async (...args) => {
  let result = await fn(...args);
  await guard(result);
  return result;
};
