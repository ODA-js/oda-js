import { Validator } from './validator';
import model from './rules/model';
import packages from './rules/package';
import entity from './rules/entity';
import field from './rules/field';
import { common, belongsTo, belongsToMany, hasMany, hasOne} from './rules/relation';

import { ValidationContext } from './interfaces';
import { Rule } from './rules';

const validator = new Validator();
validator.registerRule('model', [
  ...model,
]);

validator.registerRule('package', [
  ...packages,
]);

validator.registerRule('entity', [
  ...entity,
]);

validator.registerRule('field', [
  ...field,
]);

validator.registerRule('relation', [
  ...common,
]);

validator.registerRule('BelongsTo', [
  ...belongsTo,
]);

validator.registerRule('BelongsToMany', [
  ...belongsToMany,
]);

validator.registerRule('HasOne', [
  ...hasOne,
]);

validator.registerRule('HasMany', [
  ...hasMany,
]);

export default () => {
  return validator;
};
