import { utils } from 'oda-api-graphql';
import { IValidationResult, ModelPackage, ValidationResultType, Validator } from 'oda-model';
import * as path from 'path';

import AclDefault from '../acl';
import * as template from '../graphql-backend-template';
import initModel from './initModel';
import { Generator } from './interfaces';
import { MetaModel } from '../../../oda-model/dist/model/metamodel';

const { get, deepMerge } = utils;
const { defaultTypeMapper, prepareMapper } = template.utils;


function printWarning(...args) {
  console.warn(...args);
}

function printError(...args) {
  console.error(...args);
}

export function hasResult(log: IValidationResult[], type: ValidationResultType) {
  return log.some(item => item.result === type);
}

export function showLog(log,
  visibility: ValidationResultType[] = [
    ValidationResultType.error,
    ValidationResultType.warning,
    ValidationResultType.critics,
    ValidationResultType.fixable,
  ]) {
  visibility.forEach(visibilityItem => {
    const current = log
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

export function knownTypes(typeMapper: { [key: string]: { [key: string]: string[] } }) {
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

export function collectErrors(model: MetaModel, existingTypes: object) {
  const validator = Validator();
  const errors: IValidationResult[] = model.validate(validator);
  //custom validator
  model.packages.forEach((pkg: ModelPackage) => {
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
  return errors;
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
  const { packages, modelStore } = initModel({ pack, hooks, secureAcl, config });

  const actualTypeMapper = deepMerge(defaultTypeMapper, context.typeMapper || {});

  const existingTypes = knownTypes(actualTypeMapper);
  // generate per package

  // const errors: IValidationResult[] = collectErrors(packages, existingTypes);
  const errors: IValidationResult[] = collectErrors(modelStore, existingTypes);

  showLog(errors);
}



