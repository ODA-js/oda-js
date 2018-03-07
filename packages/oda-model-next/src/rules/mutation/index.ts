import checkMutationName from './checkMutationName';
import ensureMetadata from './ensureMetadata';

export default [
  new checkMutationName(),
  new ensureMetadata(),
];
