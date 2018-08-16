import { lib } from 'oda-gen-common';
import { IValidationResult, ValidationResultType, Validator } from 'oda-model';
import * as path from 'path';

import AclDefault from '../acl';
import * as template from '../graphql-backend-template';
import initModel from './initModel';
import { MetaModel } from 'oda-model';
import { GeneratorInit } from './init';

const { deepMerge } = lib;
const { defaultTypeMapper } = template.utils;

export function hasResult(
  log: IValidationResult[],
  type: ValidationResultType,
) {
  return log.some(item => item.result === type);
}

export function showLog(
  log,
  visibility: ValidationResultType | ValidationResultType[] = [
    'error',
    'warning',
    'critics',
    'fixable',
  ],
) {
  if (!Array.isArray(visibility)) {
    visibility = [visibility];
  }

  visibility.forEach(visibilityItem => {
    const current = log.filter(item => item.result === visibilityItem);

    const errorLog = current.reduce((status, item) => {
      if (!status[item.package]) {
        status[item.package] = {};
      }
      if (!status[item.package][item.entity]) {
        status[item.package][item.entity] = {};
      }
      if (!status[item.package][item.entity][item.field]) {
        status[item.package][item.entity][item.field] = {};
      }
      if (!status[item.package][item.entity][item.field][item.result]) {
        status[item.package][item.entity][item.field][item.result] = [];
      }
      status[item.package][item.entity][item.field][item.result].push(
        item.message,
      );
      return status;
    }, {});

    if (current.length > 0) {
      console.log(visibilityItem);
      Object.keys(errorLog).forEach(pkg => {
        console.log(`package: ${pkg}`);
        Object.keys(errorLog[pkg]).forEach(entity => {
          console.log(`  ${entity}`);
          Object.keys(errorLog[pkg][entity]).forEach(field => {
            const errList = Object.keys(errorLog[pkg][entity][field]).filter(
              c => c === visibilityItem,
            );
            if (errList.length > 0) {
              console.log(`    ${field}`);
              errorLog[pkg][entity][field][errList[0]].forEach(m => {
                console.log(`      ${m}`);
              });
            }
          });
        });
      });
    }
  });
}

export function knownTypes(typeMapper: {
  [key: string]: { [key: string]: string[] };
}) {
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
  const pkg = model.defaultPackage;
  Array.from(pkg.entities.values()).forEach(cur => {
    Array.from(cur.fields.values())
      .filter(f => !f.relation)
      .forEach(fld => {
        if (!existingTypes[fld.type.toLowerCase()]) {
          errors.push({
            package: pkg.name,
            entity: cur.name,
            field: fld.name,
            result: 'error',
            message: `type '${fld.type}' have no proper mapping`,
          });
        }
      });
  }, {});
  return errors;
}

export default function validate(args: GeneratorInit) {
  let {
    hooks,
    schema,
    acl,
    context = {} as {
      typeMapper: any;
      defaultAdapter: string;
    },
    logs,
  } = args;

  // передавать в методы кодогенерации.
  let secureAcl = new AclDefault(acl);

  //mutating config...
  const { modelStore } = initModel({
    schema,
    hooks,
    secureAcl,
  });

  const actualTypeMapper = deepMerge(
    defaultTypeMapper,
    context.typeMapper || {},
  );

  const existingTypes = knownTypes(actualTypeMapper);
  // generate per package
  const errors: IValidationResult[] = collectErrors(modelStore, existingTypes);

  showLog(errors, logs);
}
