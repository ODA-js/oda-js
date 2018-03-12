export default (i) => {
  return ((Buffer.from(i, 'base64')).toString('ascii'));
};
