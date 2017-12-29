import { ModelPackage } from '../../../../modelpackage';
import { IValidationResult, ValidationResultType } from '../../../../interfaces';
import { IFieldContext, IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
import { Entity } from '../../../../entity';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-using-entity-not-found';
  public description = 'using entity not found';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.relation.using) {
      const entity = context.package.entities.get(context.relation.using.entity);
      if (!entity) {
        const sysEntity = context.model.packages.get('system')
          .entities.get(context.relation.using.entity);
        if (sysEntity) {
          (<ModelPackage>context.package).addEntity((<Entity>sysEntity));
          result.push({
            message: 'using entity resolved from system package',
            result: ValidationResultType.fixable,
          });
        } else {
          result.push({
            message: this.description,
            result: ValidationResultType.error,
          });
        }
      }
    }
    return result;
  }
}
