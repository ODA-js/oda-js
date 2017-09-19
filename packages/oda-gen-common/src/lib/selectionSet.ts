import * as get from 'lodash/get';

export default function getSelection(info) {
  if (!info) {
    throw new Error('must provide not null graphql info');
  }
  const selectionSet = traverse(info.operation.selectionSet);
  const path = getPath(info.path);
  const result = get(selectionSet, path);
  return normalize(result);
}

function normalize(tree) {
  if (tree) {
    return Object.keys(tree).filter(f => f !== '___$$$___node')
      .reduce((obj, curr) => {
        const name = tree[curr].___$$$___node.name.value;
        obj[name] = normalize(tree[curr]);
        return obj;
      }, {});
  } else {
    return true;
  }
}

function traverse(operation, obj = {}) {
  if (operation) {
    if (Array.isArray(operation)) {
      operation.forEach(item => traverse(item, obj));
      return obj;
    } else {
      let field = (operation.alias ? operation.alias.value : '') || (operation.name ? operation.name.value : '');
      switch (operation.kind) {
        case 'SelectionSet':
          return traverse(operation.selections, obj) || {};
        case 'OperationDefinition':
          obj[field] = traverse(operation.selectionSet) || {};
          obj[field].___$$$___node = operation;
          return obj;
        case 'Field':
          obj[field] = traverse(operation.selectionSet) || {};
          obj[field].___$$$___node = operation;
          return obj;
      }
    }
  }
}

function getPath(path) {
  if (!path) {
    return '';
  } else {
    const prev = getPath(path.prev);
    if (typeof path.key === 'string') {
      return `${prev}${prev ? '.' : ''}${path.key}`;
    } else {
      return prev;
    }
  }
}