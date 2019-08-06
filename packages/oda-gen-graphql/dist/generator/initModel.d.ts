import AclDefault from '../acl';
export default function ({ pack, hooks, secureAcl, config, }: {
    [keys: string]: any;
    secureAcl: AclDefault;
}): {
    modelStore: any;
    packages: Map<unknown, unknown>;
    config: any;
};
//# sourceMappingURL=initModel.d.ts.map