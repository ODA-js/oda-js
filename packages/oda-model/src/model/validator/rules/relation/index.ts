import refFieldNotFound from './refFieldNotFound';
import refEntityNotFound from './refEntityNotFound';

export const common = [
  new refFieldNotFound(),
];

export const belongsTo = [
  new refEntityNotFound(),
];

export const belongsToMany = [
  // new emptyName(),
];

export const hasOne = [
  new refEntityNotFound(),
];

export const hasMany = [
  new refEntityNotFound(),
];
