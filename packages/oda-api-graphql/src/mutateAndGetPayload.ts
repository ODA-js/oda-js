import { fromGlobalId } from './globalId';

export default mutation => async (root,
  { input }: { input: { clientMutationId: string } },
  context: { user: { id: string }, db: any },
  info) => {
  const payload = await mutation(input, context, info) || {};

  payload.clientMutationId = input.clientMutationId;

  if (context.user) {
    payload.viewer = {
      id: fromGlobalId(context.user.id).id,
    };
  }
  return payload;
};
