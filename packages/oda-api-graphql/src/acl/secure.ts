import secureField from './secureField';
import secureMethod from './secureMethod';

export default obj => {
  if (typeof obj === 'object') {
    return secureField(obj);
  } else if (typeof obj === 'function') {
    return secureMethod(obj);
  }
  return obj;
};
