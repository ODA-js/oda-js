import { isEqual } from 'lodash';

import get from './get';
import set from './set';

function find(array: any[], item) {
  let result = array.indexOf(item);
  if (result === -1 && typeof item === 'object') {
    array.some((f, i) => {
      const res = isEqual(f, item);
      if (res) {
       result = i;
      }
      return res;
    });
  }
  return result;
}

export default function deepMerge(...args: Object[]) {
  if (args.length > 0) {
    // дописать merge с массивами
    let result = new (<any>args[0].constructor)();
    let array = Array.isArray(result);
    for (let i = 0, len = args.length; i < len; i++) {
      let current = args[i];
      if (current !== undefined) {
        if (!array) {
          let keys = Object.keys(current);
          for (let j = 0, kLen = keys.length; j < kLen; j++) {
            let key = keys[j];
            if (current.hasOwnProperty(key)) {
              let cv = get(current, key);
              let rv = get(result, key);
              if (result.hasOwnProperty(key) && (typeof rv === 'object' && rv !== null)) {
                set(result, key, deepMerge(rv, cv));
              } else {
                set(result, key, cv);
              }
            }
          }
        } else {
          if (Array.isArray(current)) {
            (<Object[]>current).forEach(item => {
              if (find(result, item) === -1) {
                  result.push(item);
                }
              });
          } else {
            if (result.indexOf(current) === -1) {
              result.push(current);
            }
          }
        }
      }
    }
    return result;
  } else {
    return args[0];
  }
}
