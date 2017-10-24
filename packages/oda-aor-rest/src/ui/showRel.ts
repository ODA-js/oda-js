import { actionType } from './consts';

export default function (relname, props) {
  let select = false;
  let edit = false;
  let type = props[relname + 'Type'];
  switch (type) {
    case actionType.USE:
      select = true;
      break;
    case actionType.CLONE:
      select = true;
      edit = true;
      break;
    case actionType.CREATE:
      edit = true;
      break;
    case actionType.UPDATE:
      select = true;
      edit = true;
      break;
    case actionType.UNLINK:
      break;
    default:
      select = true;
  }
  return {
    select,
    edit,
    type,
  }
}