import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IEntity } from '../../../interfaces/IEntity';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-ref-and-using-entities-not-found-remove';
  public description = 'referenced and using entities not found. remove relation';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
    if (!isEntity(entity)) {
      if (context.relation.using.entity) {
        const refEntity = context.package.items.get(context.relation.using.entity)as IEntity;
        if (!isEntity(refEntity)) {
          const update = context.field.toJSON();
          delete update.relation;
          context.field.updateWith(update);
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
