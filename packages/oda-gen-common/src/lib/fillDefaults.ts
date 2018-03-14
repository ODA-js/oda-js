import { mergeWith, isArray } from 'lodash';

function mergeAll(srcValue, dstValue) {
  if (isArray(dstValue)) {
    return dstValue;
  }
  if (dstValue === null) {
    return dstValue;
  }
}

export default function override(...args: Object[]) {
  if (args.length > 2) {
    return override(args[0], override(...args.slice(1)));
  } else if (args.length === 2) {
    return _override(args[0], args[1]);
  } else if (args.length === 1) {
    return args[0];
  }
}

function _override(src, dst) {
  return mergeWith(src, dst, mergeAll);
}