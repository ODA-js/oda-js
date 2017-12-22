import refBackFieldNotIndexed from './belongsTo/refBackFieldNotIndexed';
import refFieldNotIdentity from './belongsTo/refFieldNotIdentity';
import ownerFieldIsIdentity from './belongsTo/ownerFieldIsIdentity';
import ownerFieldNotIndexed from './belongsTo/ownerFieldNotIndexed';
import refBackFieldNotExists from './belongsTo/refBackFieldNotExists';
import refBackFieldIsIdentity from './belongsTo/refBackFieldIsIdentity';

import refEntityNotFound from './common/refEntityNotFound';
import refFieldNotFound from './common/refFieldNotFound';

import ownerFieldUnnecesseryIndexed from './common/ownerFieldUnnecesseryIndexed';

export const common = [
  new refFieldNotFound(),
];

export const belongsTo = [
  new refBackFieldNotIndexed(),
  new ownerFieldIsIdentity(),
  new ownerFieldNotIndexed(),
  new refBackFieldNotExists(),
  new refBackFieldIsIdentity(),
  new refEntityNotFound(),
  new refFieldNotIdentity(),
];

export const belongsToMany = [
  // new emptyName(),
  new ownerFieldUnnecesseryIndexed(),
];

export const hasOne = [
  new refEntityNotFound(),
  new ownerFieldUnnecesseryIndexed(),
];

export const hasMany = [
  new refEntityNotFound(),
  new ownerFieldUnnecesseryIndexed(),
];
