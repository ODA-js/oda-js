import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { IEntity } from '../../../interfaces/IEntity';
import { isEntity } from '../../../helpers';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-fields-check';
  public description = 'relation using fields check failed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using) {
      const entity = context.package.items.get(context.relation.using.entity) as IEntity;
      if (isEntity(entity)) {
        if (context.relation.fields) {
          context.relation.fields.forEach(field => {
            const found = entity.fields.get(field.name);
            if (found) {
              if (found.type !== field.type) {
                const update = found.toJSON();
                update.type = field.type;
                found.updateWith(update);
                result.push({
                  message: `type of relation field '${field.name}' and in using entity differs`,
                  result: 'fixable',
                });
              }
            } else {
              const update = entity.toJSON();
              update.fields.push(field.toJSON());
              entity.updateWith(update);
              result.push({
                message: `${field.name} is not met in using entity`,
                result: 'fixable',
              });
            }
          });
        }
      }
    }
    return result;
  }
}
