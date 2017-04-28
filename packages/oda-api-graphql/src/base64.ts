export default (i) => {
  return ((new Buffer(i, 'ascii')).toString('base64'));
};
