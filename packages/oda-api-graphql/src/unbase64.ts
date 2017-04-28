export default (i) => {
  return ((new Buffer(i, 'base64')).toString('ascii'));
};
