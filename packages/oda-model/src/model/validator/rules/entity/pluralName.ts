import { IValidationResult } from '@model/interfaces';
import { IEntityContext } from '@validator/interfaces';
import { Rule } from '@validator/rules';

export default class implements Rule<IEntityContext> {
  public name = 'entity-plural-name-the-same';
  public description = 'plural form of entity`s name of entity must be different from its singular form';
  public validate(context: IEntityContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    if (context.entity.name === context.entity.plural) {
      result.push({
        entity: context.entity.name,
        message: this.description,
        result: 'error',
      });
    }
    return result;
  }
}
