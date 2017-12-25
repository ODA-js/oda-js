import ownerFieldIsIdentity from './belongsTo/ownerFieldIsIdentity';
import ownerFieldNotIndexed from './belongsTo/ownerFieldNotIndexed';
import refBackFieldIsIdentity from './belongsTo/refBackFieldIsIdentity';
import BTRefBackFieldNotExists from './belongsTo/refBackFieldNotExists';
import refBackFieldNotIndexed from './belongsTo/refBackFieldNotIndexed';
import refFieldNotIdentity from './belongsTo/refFieldNotIdentity';
import usingBackFieldNotExists from './belongsToMany/usingBackFieldNotExists';
import usingBackFieldNotIdentity from './belongsToMany/usingBackFieldNotIdentity';
import usingEntityNotFound from './belongsToMany/usingEntityNotFound';
import usingFieldNotExists from './belongsToMany/usingFieldNotExists';
import usingFieldsCheck from './belongsToMany/usingFieldsCheck';
import ownerFieldUnnecesseryIndexed from './common/ownerFieldUnnecesseryIndexed';
import refBackFieldNotExists from './common/refBackFieldNotExists';
import refBackFieldNotIdentity from './common/refBackFieldNotIdentity';
import refEntityNotFound from './common/refEntityNotFound';
import refFieldNotFound from './common/refFieldNotFound';
import refFieldNotIndexed from './common/refFieldNotIndexed';

export const common = [
  new refFieldNotFound(),
];

export const belongsTo = [
  new refBackFieldNotIndexed(),
  new ownerFieldIsIdentity(),
  new ownerFieldNotIndexed(),
  new BTRefBackFieldNotExists(),
  new refBackFieldIsIdentity(),
  new refEntityNotFound(),
  new refFieldNotIdentity(),
];

export const belongsToMany = [
  // new emptyName(),
  new ownerFieldUnnecesseryIndexed(),
  new refFieldNotIdentity(),
  new refBackFieldNotIdentity(),
  new refBackFieldNotExists(),
  new usingBackFieldNotExists(),
  new usingBackFieldNotIdentity(),
  new usingEntityNotFound(),
  new usingFieldNotExists(),

  new usingFieldsCheck(),
];

export const hasOne = [
  new refEntityNotFound(),
  new ownerFieldUnnecesseryIndexed(),
  new refBackFieldNotIdentity(),
  new refBackFieldNotExists(),
  new refFieldNotIndexed(),
];

export const hasMany = [
  new refEntityNotFound(),
  new ownerFieldUnnecesseryIndexed(),
  new refBackFieldNotIdentity(),
  new refBackFieldNotExists(),
  new refFieldNotIndexed(),
];
