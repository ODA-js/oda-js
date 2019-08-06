"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isModel(item) {
    return item.modelType === 'model';
}
exports.isModel = isModel;
function isPackage(item) {
    return item.modelType === 'package';
}
exports.isPackage = isPackage;
function isEntity(item) {
    return item.modelType === 'entity';
}
exports.isEntity = isEntity;
function isField(item) {
    return item.modelType === 'field';
}
exports.isField = isField;
function isRelation(item) {
    return (item.modelType === 'BelongsTo' ||
        item.modelType === 'BelongsToMany' ||
        item.modelType === 'HasOne' ||
        item.modelType === 'HasMany');
}
exports.isRelation = isRelation;
function IsBelongsTo(item) {
    return isRelation(item) && item.modelType === 'BelongsTo';
}
exports.IsBelongsTo = IsBelongsTo;
function IsBelongsToMany(item) {
    return isRelation(item) && item.modelType === 'BelongsToMany';
}
exports.IsBelongsToMany = IsBelongsToMany;
function IsHasOne(item) {
    return isRelation(item) && item.modelType === 'HasOne';
}
exports.IsHasOne = IsHasOne;
function IsHasMany(item) {
    return isRelation(item) && item.modelType === 'HasMany';
}
exports.IsHasMany = IsHasMany;
//# sourceMappingURL=interfaces.js.map