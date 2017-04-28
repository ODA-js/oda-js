export const ownerDiscovery = (getOwner: (id: string) => Promise<{}>) => {
  return async (req, res, next) => {
    req.owner = await getOwner(req.user.id);
    next();
  };
};
