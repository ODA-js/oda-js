import { isEqual } from 'lodash';

import get from './get';
import set from './set';

export function find(array: any[], item) {
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

export function arrayItemOperation(inp: any) {
  if (typeof inp === 'string') {
    if (inp.startsWith('^')) {
      return {
        $unset: arrayItemOperation(inp.slice(1, inp.length)),
      };
    } else if (inp.startsWith('[') && inp.endsWith(']')) {
      return inp.slice(1, inp.length - 1)
        .split(',')
        .map(f => f.trim())
        .filter(f => f && f !== 'undefined' && f !== 'null')
        .map(arrayItemOperation);
    } else {
      return inp;
    }
  } else {
    if (Array.isArray(inp)) {
      return inp.map(arrayItemOperation);
    } else {
      return inp
    }
  }
}

// разные варианты, обработки в том числе когда в одном массиве несколько вариантов удаление и добавление вперемешку
// написать тестик
export function processArrayItem(result: Object[], current: any) {
  const value = arrayItemOperation(current);
  if (value !== current) {
    Object.keys(value)
      .filter(k => k.startsWith('$'))
      .forEach(op => {
        if (op === '$unset') {
          const _item = value[op];
          if (Array.isArray(_item)) {
            _item.forEach(i => removeIfExists(i));
          } else {
            removeIfExists(_item);
          }
        }
      });
  }
  function removeIfExists(_item: any) {
    const index = find(result, _item);
    if (index !== -1) {
      result.splice(index, 1);
    }
  }
}

export function processArray(result: any[], current: any) {
  if (Array.isArray(current)) {
    current.forEach(item => {
      pushUnique(current);
    });
  } else {
    pushUnique(current);
  }

  function pushUnique(current) {
    if (find(result, current) === -1) {
      result.push(current);
    }
  }
}

export default function deepMerge(...args: object[]) {
  if (args.length > 0) {
    // дописать merge с массивами
    let result = new (<any>args[0].constructor)();
    for (let i = 0, len = args.length; i < len; i++) {
      let current = args[i];
      if (current !== undefined) {
        if (!Array.isArray(result)) {
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
          processArray(result, current);
        }
      }
    }
    return result;
  } else {
    return args[0];
  }
}


