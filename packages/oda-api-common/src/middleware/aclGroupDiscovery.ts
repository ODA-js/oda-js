export const aclGroupDiscovery = (getAclGroup: (id: string) => Promise<{}>) => {
  return async (req, res, next) => {
    req.aclGroup = await getAclGroup(req.user.id);
    next();
  };
};
