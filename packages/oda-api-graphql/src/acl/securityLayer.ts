export default {
  getInfo(info) {
    console.warn('info =>>>>>', info);
    return {
      fieldName: info.fieldName,
      typeName: info.parentType.name,
      operation: {
        type: info.operation ? info.operation.operation : '',
        name: (info.operation && info.operation.name) ? info.operation.name.value : '',
      },
      path: info.path,
      variables: info.variableValues ? info.variableValues.input_0 : {},
    };
  },
  async canAccess(root, args, context, info) {
    console.warn('info====>>>>> ', info);
    console.warn(this.getInfo(info));
    return true;
  },
};
