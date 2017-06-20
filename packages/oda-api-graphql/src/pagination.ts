import cursorToId from './cursorToId';

export default function (args, resolver = cursorToId): {
  after?: string;
  before?: string;
  limit: number;
  skip: number;
} {
  let result: any = { limit: 10, skip: 0 };
  if (args.first || args.after) {
    result.limit = args.first || result.limit;
    if (args.after) {
      result.after = resolver(args.after);
    }
  } else if (args.last || args.before) {
    result.limit = args.last || result.limit;
    if (args.before) {
      result.before = resolver(args.before);
    }
  } else if (args.limit || args.skip) {
    result.limit = args.limit;
    result.skip = args.skip;
  }
  return result;
}
