import { ModelPackage, FieldType } from 'oda-model';
import { template } from './model/packages.registerConnectors.ts';

export function decapitalize(name: string): string {
  return name[0].toLowerCase() + name.slice(1);
}

export function capitalize(name: string): string {
  return name[0].toUpperCase() + name.slice(1);
}

export function printRequired(field: { required?: boolean }): string {
  return field.required ? '!' : '';
}
// двух уровневая система распознавания типов
// 1. уровень парсит типы чтобы было понятно что за тип
// 2. уровень должен извлекать конкретные данные для конкретного типа, на основе полной информации о типе
// полная информация хранит первый тип и все выведенные типы....
//
// * means default type
export const defaultTypeMapper = {
  aor: {
    Number: ['int', 'integer', 'number', 'float', 'double'],
    Text: ['string', '*', 'uuid', 'id', 'identity'],
    Date: ['date', 'time', 'datetime'],
    Boolean: ['bool', 'boolean'],
    LongText: ['text'],
    RichText: ['richtext'],
    File: ['file'],
    Image: ['image'],
    'uix.components.$type': ['json'],
    'uix.enums.$type': ['enum()'],
  },
  resource: {
    number: ['int', 'integer', 'number', 'float', 'double'],
    string: ['string', 'text', '*', 'uuid', 'id', 'identity', 'richtext'],
    date: ['date', 'time', 'datetime'],
    boolean: ['bool', 'boolean'],
  },
  aorFilter: {
    Number: ['int', 'integer', 'number', 'float', 'double'],
    Text: ['string', 'text', '*', 'richtext'],
    ID: ['uuid', 'id', 'identity'],
    Date: ['date', 'time', 'datetime'],
    Boolean: ['bool', 'boolean'],
    [`#{partial('uix.enums.$type')}`]: ['enum()'],
  },
  graphql: {
    Int: ['int', 'integer'],
    Float: ['number', 'float', 'double'],
    String: ['string', 'text', '*', 'uuid', 'richtext'],
    JSON: ['object', 'json'],
    Date: ['date', 'time', 'datetime'],
    Boolean: ['bool', 'boolean'],
    ID: ['id', 'identity'],
    $type: ['entity()', 'enum()'],
    '[$type]': ['many()'],
  },
  mongoose: {
    Number: ['int', 'integer', 'number', 'float', 'double', 'identity'],
    String: ['string', 'text', '*', 'uuid', 'richtext'],
    'mongoose.Schema.Types.Mixed': ['object', 'json'],
    Boolean: ['bool', 'boolean'],
    Date: ['date'],
    'mongoose.Schema.Types.ObjectId': ['id'],
    '$type[]': ['many()'],
    'common.schema.$type[]': ['entity()'],
  },
  sequelize: {
    'DataTypes.INTEGER': ['int', 'integer', 'identity'],
    'DataTypes.FLOAT': ['number', 'float', 'double'],
    'DataTypes.STRING(1000)': ['string', 'text', '*', 'richtext'],
    'DataTypes.BOOLEAN': ['bool', 'boolean'],
    'DataTypes.DATE': ['date'],
    'DataTypes.CHAR(24)': ['id'],
    'DataTypes.INTEGER, autoIncrement: true': ['identity_pk'],
    'DataTypes.UUID': ['uuid'],
    'DataTypes.UUID, defaultValue: Sequelize.UUIDV4': ['uuid_pk'],
    'DataTypes.CHAR(24), defaultValue: ()=> IdGenerator.generateMongoId()': [
      'id_pk',
    ],
    'DataTypes.JSON': ['many()'],
    'DataTypes.STRING': ['enum()'],
  },
  typescript: {
    number: ['int', 'integer', 'number', 'float', 'double', 'identity'],
    string: ['string', 'text', 'id', '*', 'uuid', 'richtext'],
    boolean: ['bool', 'boolean'],
    Date: ['date'],
    object: ['json', 'object'],
    '$type[]': ['many()'],
    'common.$type': ['entity()', 'enum()'],
  },
};

export function prepareMapper(
  mapper: { [key: string]: string[] },
  systemPackage: ModelPackage,
) {
  const specificMapper = Object.keys(mapper).reduce((hash, current) => {
    mapper[current].forEach(t => {
      hash[t.toLowerCase()] = current;
    });
    return hash;
  }, {});

  const hasEnums = specificMapper.hasOwnProperty('enum()');
  const hasMany = specificMapper.hasOwnProperty('many()');
  const hasEntity = specificMapper.hasOwnProperty('entity()');
  return (type: FieldType | void) => {
    let result;
    if (typeof type === 'object' && type) {
      result = undefined;
      if (
        hasEntity &&
        type.type === 'entity' &&
        systemPackage.entities.has(type.name)
      ) {
        result = specificMapper['entity()'].replace(/\$type/gi, type.name);
      } else if (
        type.type === 'enum' &&
        hasEnums &&
        systemPackage.enums.has(type.name)
      ) {
        result = specificMapper['enum()'].replace(/\$type/gi, type.name);
      }
      if (!result) {
        result = specificMapper['*'];
      } else if (type.multiplicity === 'many' && hasMany) {
        result = specificMapper['many()'].replace(/\$type/gi, result);
      }
    } else if (typeof type === 'string') {
      result = specificMapper[type.toLowerCase()] || specificMapper['*'];
    } else {
      result = specificMapper['*'];
    }
    return result;
  };
}

export function printArguments(
  field: { args: any },
  typeMapper: (i: string) => string,
) {
  let result = '';
  if (field.args) {
    for (let arg of field.args) {
      let type = typeMapper(arg.type);
      result += `${arg.name}: ${type}${printRequired(arg)}`;
      if (arg.defaultValue) {
        if (type in { Int: 1, Float: 1, Boolean: 1 }) {
          result += ` = ${arg.defaultValue}`;
        } else {
          result += ` = "${arg.defaultValue}"`;
        }
      }
    }
  }
  return result;
}
