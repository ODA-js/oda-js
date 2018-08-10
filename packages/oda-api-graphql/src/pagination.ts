export default function(
  args,
): {
  after?: string;
  before?: string;
  limit: number;
  skip: number;
} {
  let result: any = { limit: 0, skip: 0 };
  if (args.first || args.after) {
    result.limit = args.first || result.limit;
    if (args.after) {
      result.after = args.after;
    }
  } else if (args.last || args.before) {
    result.limit = args.last || result.limit;
    if (args.before) {
      result.before = args.before;
    }
  } else if (args.limit || args.skip) {
    result.limit = args.limit || result.limit;
    result.skip = args.skip || result.skip;
  }
  return result;
}
