import {
  Source,
  Kind,
  parse,
  visit,
  print,
  DocumentNode,
} from 'graphql/language';

import { GraphQLError } from 'graphql/error/GraphQLError';

import { getOperationAST } from 'graphql/utilities/getOperationAST';
import { concatAST } from 'graphql/utilities/concatAST';
import { buildASTSchema } from 'graphql/utilities/buildASTSchema';

import {
  getArgumentValues,
} from 'graphql/execution/values';

import * as get from 'lodash/get.js';
import * as set from 'lodash/set.js';
import * as each from 'lodash/each.js';
import * as keyBy from 'lodash/keyBy.js';
import * as isEqual from 'lodash/isEqual.js';

import { applyTransformations } from './transformations';

import { lodashAST } from './schema';

export function graphqlLodash(query: string | DocumentNode, operationName?: string) {
  const pathToArgs = {};
  const queryAST = typeof query === 'string' ? parse(query) : query;
  traverseOperationFields(queryAST, operationName, (node, resultPath) => {
    var args = getLodashDirectiveArgs(node, lodashAST());
    if (args === null)
      return;

    // TODO: error if transformation applied on field that already
    // seen without any transformation
    const argsSetPath = [...resultPath, '@_'];
    const previousArgsValue = get(pathToArgs, argsSetPath, null);
    if (previousArgsValue !== null && !isEqual(previousArgsValue, args))
      throw Error(`Different "@_" args for the "${resultPath.join('.')}" path`);
    set(pathToArgs, argsSetPath, args);
  });
  return {
    apply: !!Object.keys(pathToArgs).length,
    query: stripQuery(queryAST),
    transform: data => applyLodashDirective(pathToArgs, data)
  };
}

function traverseOperationFields(queryAST, operationName, cb) {
  const fragments = {};
  const operationAST = getOperationAST(queryAST, operationName);
  if (!operationAST) {
    throw new GraphQLError(
      'Must provide operation name if query contains multiple operations.'
    );
  }

  queryAST.definitions.forEach(definition => {
    if (definition.kind === Kind.FRAGMENT_DEFINITION)
      fragments[definition.name.value] = definition;
  });

  const resultPath = [];
  cb(operationAST, resultPath);
  traverse(operationAST);

  function traverse(root) {
    visit(root, {
      enter(node) {
        if (node.kind === Kind.FIELD)
          resultPath.push((node.alias || node.name).value);

        if (node.kind === Kind.FRAGMENT_SPREAD) {
          const fragmentName = node.name.value;
          const fragment = fragments[fragmentName];
          if (!fragment)
            throw Error(`Unknown fragment: ${fragmentName}`);
          traverse(fragment);
        }
      },
      leave(node) {
        if (node.kind !== Kind.FIELD)
          return;
        cb(node, resultPath);
        resultPath.pop();
      }
    });
  }
}

function getLodashDirectiveArgs(node, lodashDirectiveDef) {
  let lodashNode = null;

  for (let directive of node.directives) {
    if (directive.name.value !== lodashDirectiveDef.name)
      continue;
    if (lodashNode)
      throw Error(`Duplicating "@_" on the "${node.name.value}"`);
    lodashNode = directive;
  }

  if (lodashNode === null)
    return null;

  const args = getArgumentValues(lodashDirectiveDef, lodashNode);
  return normalizeLodashArgs(lodashNode.arguments, args);
}

function normalizeLodashArgs(argNodes, args) {
  if (!argNodes)
    return args;

  //Restore order of arguments
  argNodes = keyBy(argNodes, argNode => argNode.name.value);
  const orderedArgs = {};
  each(argNodes, (node, name) => {
    const argValue = args[name];

    if (node.value.kind === 'ObjectValue')
      orderedArgs[name] = normalizeLodashArgs(node.value.fields, argValue);
    else if (node.value.kind === 'ListValue') {
      const nodeValues = node.value.values;

      orderedArgs[name] = [];
      for (let i = 0; i < nodeValues.length; ++i)
        orderedArgs[name][i] = normalizeLodashArgs(nodeValues[i].fields, argValue[i]);
    }
    else if (node.value.kind === 'EnumValue' && node.value.value === 'none')
      orderedArgs[name] = undefined;
    else
      orderedArgs[name] = argValue;
  });
  return orderedArgs;
}

function stripQuery(queryAST): DocumentNode {
  return visit(queryAST, {
    [Kind.DIRECTIVE]: (node) => {
      if (node.name.value === '_')
        return null;
    },
  });
}

function applyLodashDirective(pathToArgs, data) {
  if (data === null)
    return null;

  const changedData = applyOnPath(data, pathToArgs);
  return applyLodashArgs([], changedData, pathToArgs['@_']);
}

function applyOnPath(result, pathToArgs) {
  const currentPath = [];
  return traverse(result, pathToArgs);

  function traverse(root, pathRoot) {
    if (root === null || root === undefined)
      return null;
    if (Array.isArray(root))
      return root.map(item => traverse(item, pathRoot));

    if (typeof root === 'object') {
      const changedObject = Object.assign({}, root);
      for (const key in pathRoot) {
        if (key === '@_')
          continue;
        currentPath.push(key);

        let changedValue = traverse(root[key], pathRoot[key]);
        if (changedValue === null || changedValue === undefined)
          continue;

        const lodashArgs = pathRoot[key]['@_'];
        changedValue = applyLodashArgs(currentPath, changedValue, lodashArgs);
        if (typeof changedValue === 'function') {
          changedValue(changedObject, key);
        } else {
          changedObject[key] = changedValue;
        }
        currentPath.pop();
      }
      return changedObject;
    } else {
      return root;
    }
  }
}

function applyLodashArgs(path, object, args) {
  try {
    return applyTransformations(object, args);
  } catch (e) {
    // FIXME:
    console.log(path);
    throw e;
  }
}