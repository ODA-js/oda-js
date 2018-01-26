import { IFieldContext } from '../../interfaces/IFieldContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { EntityRef } from './../../model/EntityRef';
import { Rule } from '../../rule';
import { HasMany } from '../../model/HasMany';
import { IBelongsToRelationProps} from '../../interfaces/IBelongsToRelation';
import { IBelongsToManyRelationProps } from '../../interfaces/IBelongsToManyRelation';
import { IHasOneRelationProps } from '../../interfaces/IHasOneRelation';
import { IHasManyRelationProps } from '../../interfaces/IHasManyRelation';

export default class implements Rule<IFieldContext> {
  public name = 'setDefaults';
  public description = 'setDefaults';
  public validate(context: IFieldContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const field = context.field;
    field.updateWith({
      derived: field.derived || (field.args && field.args.size > 0),
    });

    field.updateWith({
      persistent: field.persistent || !(field.derived || field.args && field.args.size > 0),
    });

    field.updateWith({
      required: field.required || !!field.identity,
    });

    field.updateWith({
      indexed: field.indexed || field.identity,
    });

    if (field.identity) {
      field.updateWith({
        idKey: new EntityRef({
          entity: field.entity,
          field: field.name,
          backField: '',
        }),
      });
    }
    return result;
  }
}

