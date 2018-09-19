import { HasMany } from '../../../../hasmany';
import { BelongsToMany } from '../../../../index';
import { IValidationResult } from '../../../../interfaces';
import { IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-ref-entity-not-found';
  public description = 'referenced entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.entities.get(context.relation.ref.entity);
    if (!entity) {
      if (context.relation.using.entity) {
        const refEntity = context.package.entities.get(
          context.relation.using.entity,
        );
        if (refEntity) {
          let replaceRef = (<BelongsToMany>context.relation).toJSON();
          replaceRef.hasMany = replaceRef.using;
          delete replaceRef.belongsToMany;
          delete replaceRef.using;
          context.field.relation = new HasMany(replaceRef);
          result.push({
            message: this.description,
            result: 'error',
          });
        }
      }
    }

    return result;
  }
}
