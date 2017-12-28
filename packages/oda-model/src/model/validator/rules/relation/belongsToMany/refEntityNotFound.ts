import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
import { BelongsToMany } from '../../../../index';
import { HasMany } from '../../../../hasmany';
import { PassThrough } from 'stream';

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
            result: ValidationResultType.fixable,
          });
        } else {

        }
      }
    }

    return result;
  }
}
