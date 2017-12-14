import { Factory } from 'fte.js';
import { MetaModel } from 'oda-model';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as template from '../graphql-backend-template';
import AclDefault from '../acl';

import { utils } from 'oda-api-graphql';
import { BelongsTo } from '../../../oda-model/dist/model/belongsto';

const { get, deepMerge } = utils;
const { defaultTypeMapper, prepareMapper } = template.utils;

import { GeneratorConfigPackage, GeneratorConfig, Generator } from './interfaces';

import $generateGraphql from './generators/graphql';
import $generateData from './generators/data';
import $generateDataPkg from './generators/dataPackage';
import $generatePkg from './generators/package';
import $generateModel from './generators/model';
import templateEngine from './templateEngine';
import initModel from './initModel';


function printWarning(...args) {
  console.warn(...args);
}

function printError(...args) {
  console.error(...args);
}

export default (args: Generator) => {
  let {
    hooks,
    pack,
    rootDir,
    templateRoot = path.resolve(__dirname, '../../js-templates'),
    config =
    {
      graphql: false,
      ts: false,
      packages: false,
      ui: false,
    },
    acl,
    context = {} as {
      typeMapper: any,
      defaultAdapter: string,
    },
  } = args;

  // передавать в методы кодогенерации.
  let secureAcl = new AclDefault(acl)

  //mutating config...
  const { packages } = initModel({ pack, hooks, secureAcl, config });

  // generate per package
  packages.forEach(pkg => {
    Array.from(pkg.entities.values()).forEach((cur) => {
      Array.from(cur.fields.values())
        .filter(f => f.relation)
        .forEach((r) => {
          let ent = pkg.entities.get(r.relation.ref.entity);
          let fld = ent.fields.get(r.relation.ref.field);
          if (!fld) {
            printError(`${cur.name} has wrong relation ${r.name} references to not existing field`);
          } else {
            switch (r.relation.verb) {
              case 'BelongsTo': {
                if (!r.indexed && !r.relation.ref.backField) {
                  printError(`${cur.name}\t has wrong relataion ${r.name} BelongsTo must be indexed`);
                }

                if (!fld.identity) {
                  printError(`${cur.name}\t has wrong relation ${r.name} BelongsTo must ref to identity field`);
                }

                let opposites = Array.from(ent.fields.values())
                  .filter(f => f.relation && f.relation.ref.entity === cur.name && f.relation.ref.field === r.name);

                if (opposites.length > 2) {
                  printError(`${ent.name}\t has more than one relation referenced to ${cur.name}#${r.name} while it is "BelongsTo" type`);
                }

                if (opposites.length === 0) {
                  printWarning(`${ent.name}\t has no relation referenced to ${cur.name}#${r.name} while it is "BelongsTo" type`);
                }

                if (opposites.length === 1) {
                  const verb = opposites[0].relation.verb;
                  debugger;
                  if (!(verb === 'HasOne' || verb === 'HasMany')) {
                    printWarning(`${cur.name}\t has wrong opposite relation type to ${ent.name}.${r.name} must be one from: HasOne, HasMany`);
                  }
                }

                break;
              }
              case 'BelongsToMany':
                if (!fld.identity) {
                  console.log(`${cur.name} ${r.name}\t HasOne must ref to identity field`);
                }
                break;
              case 'HasOne': {
                if (fld.identity) {
                  console.log(`${cur.name} ${r.name}\t HasOne must not reference to identity field`);
                }
              }
                break;
              case 'HasMany': {
                if (fld.identity) {
                  console.log(`WARNING: ${cur.name} ${r.name}\t HasMany must ref to indexed field not to identity`);
                }
              }
                break;
            }
          }
        });
    }, {});
  });

};
