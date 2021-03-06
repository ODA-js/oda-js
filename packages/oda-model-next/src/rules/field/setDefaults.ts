import { IFieldContext } from '../../contexts/IFieldContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { EntityRef } from './../../model/EntityRef';
import { Rule } from '../../rule';
import { HasMany } from '../../model/HasMany';
import { IBelongsToInit} from '../../interfaces/IBelongsTo';
import { IBelongsToManyInit } from '../../interfaces/IBelongsToMany';
import { IHasOneInit } from '../../interfaces/IHasOne';
import { IHasManyInit } from '../../interfaces/IHasMany';
import { ModelFactory } from '../../model/Factory';

export default class implements Rule<IFieldContext> {
  public name = 'setDefaults';
  public description = 'setDefaults';
  public validate(context: IFieldContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const field = context.field;
    field.updateWith({
      derived: !!field.derived || (!!field.args && field.args.size > 0),
    });

    field.updateWith({
      persistent: !!field.persistent || !(!!field.derived || !!field.args && field.args.size > 0),
    });

    field.updateWith({
      required: !!field.required || !!field.identity,
    });

    field.updateWith({
      indexed: !!field.indexed || !!field.identity,
    });

    if (field.identity) {
      field.updateWith({
        idKey: new EntityRef({
          entity: context.entity.name,
          field: field.name,
          backField: '',
        }, ModelFactory.getContext(context.field) as IFieldContext),
      });
    }
    return result;
  }
}

