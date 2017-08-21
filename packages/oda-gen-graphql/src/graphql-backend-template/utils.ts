import { Entity, RelationBase } from 'oda-model';

export function decapitalize(name: string): string {
  return name[0].toLowerCase() + name.slice(1);
}

export function capitalize(name: string): string {
  return name[0].toUpperCase() + name.slice(1);
}

export function printRequired(field: { required: boolean }): string {
  return field.required ? '!' : '';
}

// * means default type
export const defaultTypeMapper = {
  graphql: {
    Int: ['int', 'integer'],
    Float: ['number', 'float', 'double'],
    String: ['string', 'text'],
    JSON: ['object', 'json'],
    Date: ['date', 'time', 'datetime'],
    Boolean: ['bool', 'boolean'],
    ID: ['id', 'identity'],
  },
  mongoose: {
    Number: ['int', 'integer', 'number', 'float', 'double'],
    String: ['string', 'text', '*'],
    'mongoose.Schema.Types.Mixed': ['object', 'json'],
    Boolean: ['bool', 'boolean'],
    Date: ['date'],
    'mongoose.Schema.Types.ObjectId': ['id', 'identity'],
  },
  sequelize: {
    'DataTypes.INTEGER': ['int', 'integer'],
    'DataTypes.FLOAT': ['number', 'float', 'double'],
    'DataTypes.STRING(1000)': ['string', 'text', '*'],
    'DataTypes.BOOLEAN': ['bool', 'boolean'],
    'DataTypes.DATE': ['date'],
    'mongoose.Schema.Types.ObjectId': ['id', 'identity'],
  },
  typescript: {
    number: ['int', 'integer', 'number', 'float', 'double'],
    string: ['string', 'text', 'id', 'identity', '*'],
    'mongoose.Schema.Types.Mixed': ['object', 'json'],
    boolean: ['bool', 'boolean'],
    Date: ['date'],
    object: ['json', 'object'],
  }
}

export function prepareMapper(mapper: { [key: string]: string[] }) {
  const specificMapper = Object.keys(mapper).reduce((hash, current) => {
    mapper[current].forEach(t => {
      hash[t.toUpperCase()] = current;
    });
    return hash;
  }, {});
  return (type: string | void) => {
    let result = specificMapper['*']
    if (type) {
      result = specificMapper[type.toUpperCase()];
      return result || type;
    }
    return result;
  }
}

export function printArguments(field: { args: any }, typeMapper: (string) => string) {
  let result = '';
  if (field.args) {
    for (let arg of field.args) {
      let type = typeMapper(arg.type);
      result += `${arg.name}: ${type}${arg.required ? '1' : ''}`;
      if (arg.defaultValue) {
        if (type in { 'Int': 1, 'Float': 1, 'Boolean': 1 }) {
          result += ` = ${arg.defaultValue}`;
        } else {
          result += ` = "${arg.defaultValue}"`;
        }
      }
    }
  }
  return result;
}

export function connectionName(entity: Entity, fieldName: string, rel: RelationBase) {
  return `${rel.ref.entity}To${entity.name}As_${fieldName}`;
}
