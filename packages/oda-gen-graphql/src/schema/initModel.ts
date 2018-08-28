import { lib } from 'oda-gen-common';
import { MetaModel } from 'oda-model';
import * as pathLib from 'path';
import AclDefault from '../acl';

const { get } = lib;

export interface IPackageDef {
  [security: string]: {
    acl: number;
    entities: { [name: string]: boolean };
    mutations: { [name: string]: boolean };
    queries: { [name: string]: boolean };
    enums: { [name: string]: boolean };
    mixins: { [name: string]: boolean };
    unions: { [name: string]: boolean };
    scalars: { [name: string]: boolean };
    directives: { [name: string]: boolean };
  };
}

export function initPackages(secureAcl: AclDefault): IPackageDef {
  return Object.keys(secureAcl.map).reduce((store, cur) => {
    // only create if not exists!
    if (!store[cur]) {
      store[cur] = {
        acl: secureAcl.acl(cur),
        entities: {},
        mutations: {},
      };
    }
    return store;
  }, {});
}

export function pushToAppropriate({
  item,
  acl,
  path,
  secureAcl,
  packages,
}: {
  item: { name: string };
  acl: any;
  secureAcl: AclDefault;
  path: string;
  packages: IPackageDef;
}) {
  if (Array.isArray(acl)) {
    for (let i = 0, len = acl.length; i < len; i++) {
      pushToAppropriate({ item, acl: acl[i], path, secureAcl, packages });
    }
  } else {
    let count = secureAcl.map[acl] + 1;
    let list = secureAcl.names.slice(0, count);
    for (let i = 0, len = list.length; i < len; i++) {
      packages[list[i]][path][item.name] = true;
    }
  }
}

export default function({
  schema,
  hooks,
  secureAcl,
  packageList,
}: {
  [keys: string]: any;
  secureAcl: AclDefault;
}) {
  let modelStore = new MetaModel('system');
  if (typeof schema === 'string') {
    modelStore.loadModel(pathLib.resolve(__dirname, '../test.json'));
  } else {
    modelStore.loadPackage(schema, hooks);
    modelStore.saveModel('compiledModel.json');
  }
  let pckgs = initPackages(secureAcl);

  modelStore.entities.forEach((entity, key) => {
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.create'),
      path: 'entities',
      secureAcl,
      packages: pckgs,
    });

    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.read'),
      path: 'entities',
      secureAcl,
      packages: pckgs,
    });
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.update'),
      path: 'entities',
      secureAcl,
      packages: pckgs,
    });
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.delete'),
      path: 'entities',
      secureAcl,
      packages: pckgs,
    });
    // if we didn't setup hooks at all
    pushToAppropriate({
      item: entity,
      acl: 'system',
      path: 'entities',
      secureAcl,
      packages: pckgs,
    });
  });

  modelStore.mutations.forEach((mutation, key) => {
    pushToAppropriate({
      item: mutation,
      acl: get(mutation, 'metadata.acl.execute'),
      path: 'mutations',
      secureAcl,
      packages: pckgs,
    });
    // if we didn't setup hooks at all
    pushToAppropriate({
      item: mutation,
      acl: 'system',
      path: 'mutations',
      secureAcl,
      packages: pckgs,
    });
  });

  Object.keys(pckgs)
    .reduce((result, cur) => {
      result.push({
        name: cur,
        abstract: false,
        acl: pckgs[cur].acl,
        entities: Object.keys(pckgs[cur].entities),
        mutations: Object.keys(pckgs[cur].mutations),
      });
      return result;
    }, [])
    .forEach(p => {
      modelStore.addPackage(p);
    });

  if (!Array.isArray(packageList)) {
    packageList = Array.from(modelStore.packages.keys());
  } else {
    if (packageList.indexOf('system') === -1) {
      packageList.push('system');
    }
  }
  debugger;
  let packages = new Map(
    Array.from(modelStore.packages.entries()).filter(i => {
      return packageList.indexOf(i[0]) !== -1;
    }),
  );

  return {
    modelStore,
    packages,
  };
}
