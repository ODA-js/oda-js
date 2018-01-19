import { IValidationResult } from '../../../interfaces/IValidationResult';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { Rule } from '../../../rule';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-ref-entity-not-found-relink';
  public description = 'referenced entity not found relink';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.entities.get(context.relation.ref.entity);
    if (!entity) {
      if (context.relation.using.entity) {
        const refEntity = context.package.entities.get(context.relation.using.entity);
        if (refEntity) {
          let replaceRef = (<BelongsToMany>context.relation).toJSON();
          replaceRef.hasMany = replaceRef.using;
          delete replaceRef.belongsToMany;
          delete replaceRef.using;
          context.field.relation = new HasMany(replaceRef);
          result.push({
            message: this.description,
            result: 'fixable',
          });
        }
      }
    }

    return result;
  }
}
