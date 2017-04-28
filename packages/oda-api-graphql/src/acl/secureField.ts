import secureMethod from './secureMethod';

export default typeResolver => {
  if (typeof typeResolver.resolve === 'function') {
    typeResolver.resolve = secureMethod(typeResolver.resolve);
  }
  return typeResolver;
};
