import { initPackages, pushToAppropriate } from './utils';
import { utils } from 'oda-api-graphql';
import * as path from 'path';
import { MetaModel } from 'oda-model';
import { expandConfig } from './utils';

const { get } = utils;

export default function ({
  pack,
  hooks,
  secureAcl,
  config,
}) {

  let modelStore = new MetaModel('system');
  if (typeof pack === 'string') {
    modelStore.loadModel(path.resolve(__dirname, '../test.json'));
  } else {
    modelStore.loadPackage(pack, hooks);
    modelStore.saveModel('compiledModel.json');
  }

  let pckgs = initPackages(secureAcl);

  modelStore.entities.forEach((entity, key) => {
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.create'),
      path: 'entities',
      secureAcl,
      packages: pckgs
    });

    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.read'),
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.update'),
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
    pushToAppropriate({
      item: entity,
      acl: get(entity, 'metadata.acl.delete'),
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
    // if we didn't setup hooks at all
    pushToAppropriate({
      item: entity,
      acl: 'system',
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
  });

  modelStore.mutations.forEach((mutation, key) => {
    pushToAppropriate({
      item: mutation,
      acl: get(mutation, 'metadata.acl.execute'),
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
    // if we didn't setup hooks at all
    pushToAppropriate({
      item: mutation,
      acl: 'system',
      path: 'entities',
      secureAcl,
      packages: pckgs
    });
  });

  Object.keys(pckgs).reduce((result, cur) => {
    result.push({
      name: cur,
      abstract: false,
      entities: Object.keys(pckgs[cur].entities),
      mutations: Object.keys(pckgs[cur].mutations),
    });
    return result;
  }, []).forEach(p => {
    modelStore.addPackage(p);
  });

  const packageNames = Array.from(modelStore.packages.keys());

  config = expandConfig(config, packageNames);

  let generatedPackages = Object.keys(config.packages).reduce((hash, cur) => {
    hash[cur] = 1;
    return hash;
  }, {});

  let packages = new Map(Array.from(modelStore.packages.entries()).filter((i) => {
    return generatedPackages[i[0]];
  }));

  return {
    modelStore,
    packages,
    config,
  };
}
