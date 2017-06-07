import cursorToId from './cursorToId';

export default function (args): {
  after?: string;
  before?: string;
  limit: number;
  skip: number;
} {
  let result: any = { limit: 10, skip: 0 };
  if (args.first) {
    result.limit = args.first;
    if (args.after) {
      let id = cursorToId(args.after);
      if (id) {
        result.after = id;
      }
    } else {
      result.after = '000000000000000000000000';
    }
  } else if (args.last) {
    result.limit = args.last;
    if (args.before) {
      let id = cursorToId(args.before);
      if (id) {
        result.before = id;
      }
    } else {
      result.before = 'ffffffffffffffffffffffff';
    }
  } else if (args.limit || args.skip) {
    result.limit = args.limit;
    result.skip = args.skip;
  }
  return result;
}
