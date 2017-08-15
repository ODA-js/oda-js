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

export function mapToGraphqlTypes(type: string | void) {
  if (type) {
    // разобрать тип как надо массив и прочее...
    let intype = type.toUpperCase();
    switch (intype) {
      case 'INT':
      case 'INTEGER':
        return 'Int';

      case 'NUMBER':
      case 'FLOAT':
      case 'DOUBLE':
        return 'Float';

      case 'STRING':
        return 'String';

      case 'BOOL':
      case 'BOOLEAN':
        return 'Boolean';

      case 'ID':
        return 'ID';

      // case 'DATE':
      //   return 'Date';

      // case 'OBJECT':
      //   return 'JSON';

      default:
        return type;
    }
  } else {
    return 'String';
  }
}

export function mapToMongooseTypes(type: string | void) {
  if (type) {
    // разобрать тип как надо массив и прочее...
    let intype = type.toUpperCase();
    switch (intype) {
      case 'INT':
      case 'INTEGER':
        return 'Number';

      case 'NUMBER':
      case 'FLOAT':
      case 'DOUBLE':
        return 'Number';

      case 'STRING':
        return 'String';

      case 'BOOL':
      case 'BOOLEAN':
        return 'Boolean';

      case 'ID':
        return 'mongoose.Schema.Types.ObjectId';

      // case 'DATE':
      //   return 'Date';

      // case 'JSON':
      //   return 'mongoose.Schema.Types.Mixed';

      default:
        return type;
    }
  } else {
    return 'String';
  }
}

export function mapToSequelizeTypes(type: string | void) {
  if (type) {
    // разобрать тип как надо массив и прочее...
    let intype = type.toUpperCase();
    switch (intype) {
      case 'INT':
      case 'INTEGER':
        return 'DataTypes.INTEGER';

      case 'NUMBER':
      case 'FLOAT':
      case 'DOUBLE':
        return 'DataTypes.FLOAT';

      case 'STRING':
        return 'DataTypes.STRING(1000)';

      case 'BOOL':
      case 'BOOLEAN':
        return 'DataTypes.BOOLEAN';

      case 'ID':
        return 'DataTypes.UUID';

      case 'DATE':
        return 'DataTypes.DATE';

      // case 'JSON':
      //   return 'mongoose.Schema.Types.Mixed';

      default:
        return type;
    }
  } else {
    return 'String';
  }
}

export function mapToTSTypes(type: string | void) {
  if (type) {
    // разобрать тип как надо массив и прочее...
    let intype = type.toUpperCase();
    switch (intype) {
      case 'INT':
      case 'INTEGER':
        return 'number';

      case 'NUMBER':
      case 'FLOAT':
      case 'DOUBLE':
        return 'number';

      case 'STRING':
        return 'string';

      case 'BOOL':
      case 'BOOLEAN':
        return 'boolean';

      case 'ID':
        return 'string';

      // case 'DATE':
      //   return 'Date';

      // case 'JSON':
      //   return 'object';

      default:
        return type;
    }
  } else {
    return 'string';
  }
}


export function printArguments(field: { args: any }) {
  let result = '';
  if (field.args) {
    for (let arg of field.args) {
      let type = mapToGraphqlTypes(arg.type);
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
