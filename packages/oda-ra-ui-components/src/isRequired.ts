import { required } from 'react-admin';

const isRequired = validate => {
  if (validate === required) return true;
  if (Array.isArray(validate)) {
    return validate.includes(required);
  }
  return false;
};

export default isRequired;
