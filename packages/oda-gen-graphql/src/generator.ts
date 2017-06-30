import { Factory } from 'fte.js';
import { MetaModel, ModelHook } from 'oda-model';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as template from './graphql-backend-template';
import AclDefault from './acl';

import { utils } from 'oda-api-graphql';

let get = utils.get;

export type GeneratorConfigPackage = {
  mutation?: boolean | string[] | {
    entry?: boolean | string[];
    types?: boolean | string[];
    resolver?: boolean | string[];
    index?: boolean | string[];
  },
  entity?: boolean | string[] | {
    index?: boolean | string[];
    type?: {
      entry?: boolean | string[];
      enums?: boolean | string[];
      resolver?: boolean | string[];
    };
    query?: boolean | string[] | {
      entry?: boolean | string[];
      resolver?: boolean | string[];
    };
    viewer?: boolean | string[] | {
      entry?: boolean | string[];
      resolver?: boolean | string[];
    };
    dataPump?: boolean | string[] | {
      queries?: boolean | string[];
      config?: boolean | string[];
    },
    mutations?: boolean | string[] | {
      entry?: boolean | string[];
      types?: boolean | string[];
      resolver?: boolean | string[];
    },
    subscriptions?: boolean | string[] | {
      entry?: boolean | string[];
      types?: boolean | string[];
      resolver?: boolean | string[];
    },
    data?: boolean | string[] | {
      mongoose?: {
        connector?: boolean | string[];
        schema?: boolean | string[];
      },
      types?: {
        model?: boolean | string[];
      },
    };
    connections?: boolean | string[] | {
      mutations?: boolean | string[] | {
        entry?: boolean | string[];
        types?: boolean | string[];
        resolver?: boolean | string[];
      }
      types?: boolean | string[];
    }
  },
  packages?: boolean | string[] | {
    typeIndex?: boolean | string[];
    mutationIndex?: boolean | string[];
  },
};

export type GeneratorConfig = {
  graphql?: boolean;
  ts?: boolean;
  schema?: boolean;
  packages?: boolean | string[] | { [key: string]: GeneratorConfigPackage; };
};

export type Generator = {
  hooks?: ModelHook[],
  // role: string,
  pack: string | {
    name: string;
    mutations: any[];
    entities: any[];
    packages: any[];
  };
  rootDir?: string;
  templateRoot?: string;
  config: GeneratorConfig;
  acl?: { [key: string]: number };
};

const def = {
  graphql: true,
  ts: true,
  schema: false,
  package: {
    mutation: {
      entry: true,
      types: true,
      resolver: true,
      index: true,
    },
    entity: {
      index: true,
      type: {
        entry: true,
        enums: true,
        resolver: true,
      },
      query: {
        entry: true,
        resolver: true,
      },
      viewer: {
        entry: true,
        resolver: true,
      },
      dataPump: {
        queries: true,
        config: true,
      },
      mutations: {
        entry: true,
        types: true,
        resolver: true,
      },
      subscriptions: {
        entry: true,
        types: true,
        resolver: true,
      },
      data: {
        mongoose: {
          connector: true,
          schema: true,
        },
        types: {
          model: true,
        },
      },
      connections: {
        mutations: {
          entry: true,
          types: true,
          resolver: true,
        },
        types: true,
      },
    },
    packages: {
      typeIndex: true,
      mutationIndex: true,
    },
  },
};

function ensureConfigValues(cp, pname) {
  if (!(cp.hasOwnProperty(pname)
    || typeof (cp[pname]) === 'boolean'
    || Array.isArray(cp[pname]))) {
    return false;
  } else {
    return cp[pname];
  }
}

function fill(src: Object, value: any) {
  const result = {};
  let keys = Object.keys(src);
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i];
    if (typeof src[key] === 'object') {
      result[key] = fill(src[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function traversePackage(src: any, origin: any): any {
  let result;
  if (src === undefined || src === null || src === '') {
    result = fill(origin, false);
  } else if (Array.isArray(src)) {
    for (let i = 0, len = src.length; i < len; i++) {
      result = fill(origin, src);
    }
  } else if (typeof src === 'boolean') {
    result = fill(origin, src);
  } else {
    result = {};
    let keys = Object.keys(origin);
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i];
      if (origin.hasOwnProperty(key)) {
        let origType = typeof origin[key];

        if (origType === 'boolean') {
          result[key] = ensureConfigValues(src, key);
        } else if (origType === 'object') {
          result[key] = traversePackage(src[key], origin[key]);
        }
      }
    }
  }
  return result;
}

export const expandConfig = (config: any, packages: string[]) => {
  let packConfig: GeneratorConfig = {} as GeneratorConfig;

  if (!config.hasOwnProperty('graphql')) {
    packConfig.graphql = def.graphql;
  } else {
    packConfig.graphql = config.graphql;
  }

  if (!config.hasOwnProperty('ts')) {
    packConfig.ts = def.ts;
  } else {
    packConfig.ts = config.ts;
  }

  if (!config.hasOwnProperty('schema')) {
    packConfig.schema = def.schema;
  } else {
    packConfig.schema = config.schema;
  }

  if (config.packages === undefined) {
    config.packages = def.package;
  }
  if (!Array.isArray(packages)) {
    packages = ['system'];
  } else if (packages.length === 0) {
    packages.push('system');
  }
  packConfig.packages = {};
  if (typeof config.packages === 'boolean') {
    if (config.packages) {
      config.packages = {};
      for (let i = 0, len = packages.length; i < len; i++) {
        packConfig.packages[packages[i]] = def.package;
      }
    }
  } else if (Array.isArray(config.packages)) {
    for (let i = 0, len = config.packages.length; i < len; i++) {
      packConfig.packages[config.packages[i]] = def.package;
    }
  } else if (typeof config.packages === 'object') {
    if (config.packages.hasOwnProperty('mutation')
      || config.packages.hasOwnProperty('entity')
      || config.packages.hasOwnProperty('package')
    ) {
      for (let i = 0, len = packages.length; i < len; i++) {
        packConfig.packages[packages[i]] = config.packages;
      }
    } else {
      // we guess that it contains package names with config;
      let packagesNames = Object.keys(config.packages);
      for (let i = 0, len = packagesNames.length; i < len; i++) {
        let currPack = config.packages[packagesNames[i]];
        // expand it
        packConfig.packages[packagesNames[i]] = traversePackage(currPack, def.package);
      }
    }
  }
  return packConfig;
};

function $generateGraphql(pkg, raw: Factory, rootDir: string, role: string, allow,
  collection, cfg, type, route: string, ext: string, fileName?: string) {
  let runConfig = get(cfg[type], route) as boolean | string[];
  if (runConfig) {
    let list;
    if (Array.isArray(runConfig)) {
      collection.filter(e => (runConfig as string[]).includes(e.name));
    } else {
      list = collection;
    }

    let parts = route.split('.');
    for (let entity of list) {
      let source = get(template, `${type}.${route}`).generate(raw, entity, pkg, role, allow);
      if (typeof source === 'string') {
        let parts = route.split('.');
        if (!fileName) {
          parts[parts.length - 1] = `${parts[parts.length - 1]}.${ext}`;
        } else {
          parts[parts.length - 1] = fileName;
        }
        let fn = path.join(rootDir, pkg.name, type, `${entity.name}`, ...parts);
        fs.ensureFileSync(fn);
        fs.writeFileSync(fn, source);
      } else if (Array.isArray(source)) {
        let parts = route.split('.');
        source.forEach(f => {
          parts[parts.length - 1] = `${f.file}.${ext}`;
          let fn = path.join(rootDir, pkg.name, type, `${entity.name}`, ...parts);
          fs.ensureFileSync(fn);
          fs.writeFileSync(fn, f.content);
        });
      }
    }
  }
}

function $generateData(pkg, raw: Factory, rootDir: string,
  collection, cfg, type, route: string, ext: string, fileName?: string) {
  let runConfig = get(cfg[type], route) as boolean | string[];
  if (runConfig) {
    let list;
    if (Array.isArray(runConfig)) {
      collection.filter(e => (runConfig as string[]).includes(e.name));
    } else {
      list = collection;
    }

    for (let entity of list) {
      let source = get(template, `${type}.${route}`).generate(raw, entity, pkg);
      if (typeof source === 'string') {
        let parts = route.split('.').slice(1); // it is always `data`, at least here
        if (!fileName) {
          parts[parts.length - 1] = `${parts[parts.length - 1]}.${ext}`;
        } else {
          parts[parts.length - 1] = fileName;
        }
        let fn = path.join(rootDir, 'data', `${entity.name}`, ...parts);
        fs.ensureFileSync(fn);
        fs.writeFileSync(fn, source);
      } else if (Array.isArray(source)) {
        let parts = route.split('.').slice(1); // it is always `data`, at least here
        source.forEach(f => {
          parts[parts.length - 1] = `${f.file}.${ext}`;
          let fn = path.join(rootDir, 'data', `${entity.name}`, ...parts);
          fs.ensureFileSync(fn);
          fs.writeFileSync(fn, f.content);
        });
      }
    }
  }
}

function $generateDataPkg(raw: Factory, rootDir: string,
  pkg: { name: string }, route: string, fileName?: string) {
  let source = get(template, `packages.${route}`).generate(raw, pkg);
  let fn = path.join(rootDir, 'data', fileName);
  fs.ensureFileSync(fn);
  fs.writeFileSync(fn, source);
}

function $generatePkg(raw: Factory, rootDir: string, pkg: { name: string }, type: string, route: string, fileName?: string) {
  let source = get(template, `packages.${route}`).generate(raw, pkg);
  let fn = type ? path.join(rootDir, pkg.name, type, fileName) : path.join(rootDir, pkg.name, fileName);
  fs.ensureFileSync(fn);
  fs.writeFileSync(fn, source);
}

// function $generateDataModel(raw, rootDir, model, route: string, fileName: string) {
//   let source = get(template, `model.${route}`).generate(raw, model);
//   let fn = path.join(rootDir, 'data', fileName);
//   fs.ensureFileSync(fn);
//   fs.writeFileSync(fn, source);
// }

function $generateModel(raw, rootDir, model, route: string, fileName: string) {
  let source = get(template, `model.${route}`).generate(raw, model);
  let fn = path.join(rootDir, fileName);
  fs.ensureFileSync(fn);
  fs.writeFileSync(fn, source);
}

export default (args: Generator) => {
  let {
    hooks,
    pack,
    rootDir,
    templateRoot = path.resolve(__dirname, '../js-templates'),
    config =
    {
      graphql: true,
      ts: true,
      packages: true,
    },
    acl,
  } = args;
  // передавать в методы кодогенерации.
  let secureAcl = new AclDefault(acl)
  const aclAllow = secureAcl.allow.bind(secureAcl);

  let raw = new Factory({
    root: templateRoot,
    debug: true,
  });

  let modelStore = new MetaModel('system');
  if (typeof pack === 'string') {
    modelStore.loadModel(path.resolve(__dirname, '../test.json'));
  } else {
    modelStore.loadPackage(pack, hooks);
    modelStore.saveModel('compiledModel.json');
  }

  // discover packages

  let pckgs = Object.keys(secureAcl.map).reduce((store, cur) => {
    store[cur] = {
      entities: {},
      mutations: {},
    };
    return store;
  }, {});

  const pushToAppropriate = (item, _acl, path) => {
    if (Array.isArray(_acl)) {
      for (let i = 0, len = _acl.length; i < len; i++) {
        pushToAppropriate(item, _acl[i], path);
      }
    } else {
      let count = secureAcl.map[_acl] + 1;
      let list = secureAcl.names.slice(0, count);
      for (let i = 0, len = list.length; i < len; i++) {
        pckgs[list[i]][path][item.name] = 1;
      }
    }
  };

  modelStore.entities.forEach((entity, key) => {
    pushToAppropriate(entity, get(entity, 'metadata.acl.create'), 'entities');
    pushToAppropriate(entity, get(entity, 'metadata.acl.read'), 'entities');
    pushToAppropriate(entity, get(entity, 'metadata.acl.update'), 'entities');
    pushToAppropriate(entity, get(entity, 'metadata.acl.delete'), 'entities');
    // if we didn't setup hooks at all
    pushToAppropriate(entity, 'system', 'entities');
  });

  modelStore.mutations.forEach((mutation, key) => {
    pushToAppropriate(mutation, get(mutation, 'metadata.acl.execute'), 'mutations');
    // if we didn't setup hooks at all
    pushToAppropriate(mutation, 'system', 'mutations');
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

  //
  fs.ensureDirSync(rootDir);
  const packageNames = Array.from(modelStore.packages.keys());

  config = expandConfig(config, packageNames);

  let generatedPackages = Object.keys(config.packages).reduce((hash, cur) => {
    hash[cur] = 1;
    return hash;
  }, {});

  let packages = new Map(Array.from(modelStore.packages.entries()).filter((i) => {
    return generatedPackages[i[0]];
  }));

  const packageList = Array.from(packages.values());

  if (config.ts) {
    // FIXIT:
    // generate data layer api
    let dataPackage = modelStore.packages.get('system');
    let curConfig = config.packages['system'];
    let generateData = $generateData.bind(null,
      dataPackage, raw, rootDir,
      Array.from(dataPackage.entities.values()), curConfig, 'entity');

    let generatePkg = $generateDataPkg.bind(null, raw, rootDir, dataPackage);

    generateData('data.mongoose.connector', 'ts');
    generateData('data.mongoose.schema', 'ts');
    generateData('data.types.model', 'ts');
    // data-awarness
    generatePkg('indexMongooseConnectors', 'connectorIndex.ts');
    generatePkg('registerMongooseConnectors', 'registerConnectors.ts');
    // make indexes for simplier access
    // $generateModel(raw, rootDir, 'system',
    //   { packages: new Map([['system', dataPackage]]) },
    //   'registerConnectors', 'registerConnectors.ts');
    // done
  }

  if (config.ts) {
    $generateModel(raw, rootDir, { packages }, 'registerConnectors', 'registerConnectors.ts');
  }

  // generate per package
  for (let i = 0, packLen = packageList.length; i < packLen; i++) {
    let pkg = packageList[i];
    let generate = $generateGraphql.bind(null, pkg, raw, rootDir, pkg.name/*role is package name*/, aclAllow);
    let generatePkg = $generatePkg.bind(null, raw, rootDir);
    const curConfig = config.packages[pkg.name];
    let missing = pkg.ensureAll();
    if (missing.length) {
      console.warn(`${pkg.name} has missing or wrong relation(s):`);
      pkg.ensureAll().forEach(f => {
        console.warn
          (`field ${f.entity}=>${f.name} has relation:` +
          ` ${f.relation.ref.entity}: ${f.relation.ref.field} not exists, not indexed, malformed with opposite relation`);
      });
    }

    const entities = Array.from(pkg.entities.values());
    const mutations = Array.from(pkg.mutations.values());

    // доделать фильтрацию по названиям сущностей, пакетов и т.п.
    // entity/connections

    if (!pkg.abstract) {
      if (config.graphql) {
        generate(entities, curConfig, 'entity', 'connections.mutations.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'connections.mutations.types', 'graphql');
        generate(entities, curConfig, 'entity', 'connections.types', 'graphql');
        generate(entities, curConfig, 'entity', 'mutations.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'mutations.types', 'graphql');
        generate(entities, curConfig, 'entity', 'dataPump.queries', 'graphql');
        generate(entities, curConfig, 'entity', 'subscriptions.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'subscriptions.types', 'graphql');
        generate(entities, curConfig, 'entity', 'query.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'viewer.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'type.entry', 'graphql');
        generate(entities, curConfig, 'entity', 'type.enums', 'graphql');
        generate(mutations, curConfig, 'mutation', 'types', 'graphql');
        generate(mutations, curConfig, 'mutation', 'entry', 'graphql');
      }

      if (config.ts) {
        generate(entities, curConfig, 'entity', 'connections.mutations.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'mutations.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'dataPump.config', 'ts');
        generate(entities, curConfig, 'entity', 'subscriptions.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'query.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'viewer.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'type.resolver', 'ts');
        generate(entities, curConfig, 'entity', 'index', 'ts');
        generate(mutations, curConfig, 'mutation', 'resolver', 'ts');
        generate(mutations, curConfig, 'mutation', 'index', 'ts');

        generatePkg(pkg, '', 'graphqlIndex', 'index.ts');
        generatePkg(pkg, '', 'graphqlSchema', 'schema.ts');

        generatePkg(pkg, 'entity', 'typeIndex', 'index.ts');
        generatePkg(pkg, 'entity', 'node', 'node.ts');
        generatePkg(pkg, 'entity', 'viewer', 'viewer.ts');
        generatePkg(pkg, 'mutation', 'mutationIndex', 'index.ts');
      }
    }

    if (config.schema) {
      generatePkg(pkg, 'schema', 'schemaPuml', 'schema.puml');
    }
  }

};
