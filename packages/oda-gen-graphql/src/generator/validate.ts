import { Factory } from 'fte.js';
import {
  MetaModel, IValidationResult,
  ValidationResultType,
} from 'oda-model';
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
import { error } from 'util';


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

  const actualTypeMapper = deepMerge(defaultTypeMapper, context.typeMapper || {});

  function knownTypes(typeMapper: { [key: string]: { [key: string]: string[] } }) {
    const result = {};
    Object.keys(typeMapper).forEach(mapper => {
      Object.keys(typeMapper[mapper]).forEach(type => {
        typeMapper[mapper][type].reduce((mapper, type) => {
          result[type.toLowerCase()] = true;
          return result;
        }, result);
      });
    });
    return result;
  }

  const existingTypes = knownTypes(actualTypeMapper);

  // generate per package
  const errors: IValidationResult[] = [];
  packages.forEach(pkg => {
    errors.push(...pkg.validate());
    debugger;
    Array.from(pkg.entities.values()).forEach((cur) => {
      Array.from(cur.fields.values())
        .filter(f => !f.relation)
        .forEach(fld => {
          if (!existingTypes[fld.type.toLowerCase()]) {
            errors.push({
              entity: cur.name,
              field: fld.name,
              result: ValidationResultType.error,
              message: 'type have proper mapping'
            });
          }
        });
    }, {});
  });
  console.log(errors.filter(f => f.result === ValidationResultType.error));

  console.log(errors.filter(f => f.result === ValidationResultType.warning));

  console.log(errors.filter(f => f.result === ValidationResultType.critics));
};
