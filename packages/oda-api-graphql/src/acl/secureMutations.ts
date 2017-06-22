import { Secure } from './secureAny';

export class SecureMutation extends Secure<boolean> {
  public userGroup: (context) => string;
  constructor(args) {
    super(args)
    this.userGroup = args.userGroup
    if (!this.userGroup) {
      this.userGroup = (context) => context.user.profileName;
    }
  }
  public getMutationInfo(info) {
    return {
      opType: info.operation ? info.operation.operation : '',
      name: info.fieldName,
    };
  }

  public secureMutation() {
    const getMutationInfo = this.getMutationInfo.bind(this);
    const allow = this.allow.bind(this);
    const getACLGroup = this.userGroup;
    return (source, args, context, info) => {
      const group = getACLGroup(context);
      let descriptor = getMutationInfo(info);
      if (descriptor.opType === 'mutation') {
        if (!allow(group, descriptor.name)) {
          throw new Error('operation not allowed');
        }
      }
      if (descriptor.opType === 'subscription') {
        return source;
      }
    };
  }
};
