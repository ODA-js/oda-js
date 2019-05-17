import { RegisterConnectorsBase } from './connector';

export default mutation => async (
  root,
  args,
  context: { connectors: RegisterConnectorsBase },
  info,
) => {
  const needCommit = await context.connectors.ensureTransaction();
  const txn = await context.connectors.transaction;
  try {
    const payload = (await mutation(root, args, context, info)) || {};
    if (needCommit) {
      return txn.commit().then(() => payload);
    } else {
      return payload;
    }
  } catch (e) {
    await txn.abort();
    throw e;
  }
};
