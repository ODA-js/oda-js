import pre from './pre';
import SecurityLayer from './securityLayer';

export default pre(async (root, args, context, info) => {
  if (!await SecurityLayer.canAccess(root, args, context, info)) {
    throw new Error('not allowed operation');
  }
});
