import emptyName from './emptyName';
import ACLRequired from './ACLRequired';
import noACLRequired from './noACLRequired';

export default [
  new emptyName(),
  new noACLRequired(),
  new ACLRequired(),
];
