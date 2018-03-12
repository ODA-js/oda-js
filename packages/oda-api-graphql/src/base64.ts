export default (i) => {
  return ((Buffer.from(i, 'ascii')).toString('base64'));
};
