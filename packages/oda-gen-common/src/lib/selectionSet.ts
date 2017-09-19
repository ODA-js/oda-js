export default function traverse(operation, obj = {}) {
  if (operation) {
    if (Array.isArray(operation)) {
      operation.forEach(item => traverse(item, obj));
      return obj;
    } else {
      switch (operation.kind) {
        case 'SelectionSet':
          return traverse(operation.selections, obj) || true;
        case 'OperationDefinition':
          obj[operation.name] = traverse(operation.selectionSet) || true;
          return obj;
        case 'Field':
          obj[operation.alias || operation.name.value] = traverse(operation.selectionSet) || true;
          return obj;
      }
    }
  }
}