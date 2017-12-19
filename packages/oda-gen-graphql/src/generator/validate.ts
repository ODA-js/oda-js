import * as util from 'util';
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
import { ValidationErrorItem } from '../../../oda-api-graphql/node_modules/@types/sequelize';
import { index } from '../graphql-backend-template/entity/index';


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

  function showLog(log,
    visibility: ValidationResultType[] = [
      ValidationResultType.error,
      ValidationResultType.warning,
      ValidationResultType.critics
    ]) {
    visibility.forEach(visibilityItem => {
      const current = errors
        .filter(item => item.result === visibilityItem);

      const errorLog = current.reduce((status, item) => {
        if (!status[item.package]) {
          status[item.package] = {}
        }
        if (!status[item.package][item.entity]) {
          status[item.package][item.entity] = {}
        }
        if (!status[item.package][item.entity][item.field]) {
          status[item.package][item.entity][item.field] = {};
        }
        if (!status[item.package][item.entity][item.field][item.result]) {
          status[item.package][item.entity][item.field][item.result] = [];
        }
        status[item.package][item.entity][item.field][item.result].push(item.message);
        return status;
      }, {});

      if (current.length > 0) {
        console.log(visibilityItem);
        Object.keys(errorLog).forEach(pkg => {
          console.log(`package: ${pkg}`);
          Object.keys(errorLog[pkg]).forEach(entity => {
            console.log(`  ${entity}`);
            Object.keys(errorLog[pkg][entity]).forEach(field => {
              const errList = Object.keys(errorLog[pkg][entity][field]).filter(c => c === visibilityItem);
              if (errList.length > 0) {
                console.log(`    ${field}`);
                errorLog[pkg][entity][field][errList[0]].forEach(m => {
                  console.log(`      ${m}`);
                })
              }
            });
          });
        });
      }
    });
  }
  showLog(errors);
}
