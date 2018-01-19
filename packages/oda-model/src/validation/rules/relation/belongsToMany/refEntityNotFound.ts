import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';
import { IEntity } from '../../../interfaces/IEntity';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-ref-entity-not-found-relink';
  public description = 'referenced entity not found relink';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
    if (!isEntity(entity)) {
      if (context.relation.using.entity) {
        const refEntity = context.package.items.get(context.relation.using.entity) as IEntity;
        if (isEntity(refEntity)) {
          let replaceRef = context.relation.toJSON();
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
