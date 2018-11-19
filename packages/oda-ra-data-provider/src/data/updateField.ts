import { isEqual } from 'lodash';
import { isNil } from 'lodash';

export default function(
  data: object,
  previousData: object = {},
  field: string,
) {
  if (!isEqual(data[field], previousData[field])) {
    return {
      [field]: !isNil(data[field]) ? data[field] : null,
    };
  }
}
