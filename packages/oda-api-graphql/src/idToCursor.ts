import { PREFIX } from './consts';
import base64 from './base64';

export default (id) => {
  let result;
  try {
    result = base64(PREFIX + id);
  } catch(e){}
  return result;
};
