import { CursorType } from './cursor';
import { DIRECTION } from './consts';

export default function direction({
  orderBy,
  last,
  before,
  first,
  after,
}: CursorType): { [key: string]: DIRECTION } {
  const result: { [key: string]: DIRECTION } = {};
  if (orderBy) {
    if (!Array.isArray(orderBy)) {
      orderBy = [orderBy];
    }
    for (let i = 0, len = orderBy.length; i < len; i++) {
      const ob = orderBy[i];
      if (ob.match(/Asc$/)) {
        let fieldName = ob.substring(0, ob.length - 3);
        result[fieldName] = DIRECTION.FORWARD;
      } else if (ob.match(/Desc$/)) {
        let fieldName = ob.substring(0, ob.length - 4);
        result[fieldName] = DIRECTION.BACKWARD;
      }
    }
    if (Object.keys(result).length > 0) {
      result._id = DIRECTION.FORWARD;
    }
  } else {
    if (last || before) {
      result._id = DIRECTION.BACKWARD;
    } else if (first || after) {
      result._id = DIRECTION.FORWARD;
    }
  }
  return result;
}
