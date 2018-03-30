import { PREFIX } from './consts';
import { unbase64 } from 'oda-isomorfic';

export default (cursor) => {
  let result;
  try {
    result = unbase64(cursor).substring(PREFIX.length);
  } catch (e) { }
  return result;
};
