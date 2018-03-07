import { IRelationContext } from '../../../contexts/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity, IsBelongsToMany } from '../../../helpers';
import { IEntity } from '../../../interfaces/IEntity';
import { HasMany } from '../../../model/HasMany';
import { BelongsToManyTransform } from '../../../model/BelongsToMany';
import { ModelFactory } from '../../../model/Factory';
import { IFieldContext } from '../../../contexts/IFieldContext';
import { IBelongsToManyInit } from '../../../interfaces/IBelongsToMany';

export default class implements Rule<IRelationContext> {
  public name = 'relation-btm-ref-entity-not-found-relink';
  public description = 'referenced entity not found relink';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    const entity = context.package.items.get(context.relation.ref.entity) as IEntity;
    if (!isEntity(entity)) {
      if (IsBelongsToMany(context.relation) && context.relation.using.entity) {
        const refEntity = context.package.items.get(context.relation.using.entity) as IEntity;
        if (isEntity(refEntity)) {
          const relation = context.relation.toJS() as IBelongsToManyInit;
          context.field.updateWith({
            relation: {
              name: relation.name,
              title: relation.title,
              description: relation.description,
              fullName: relation.fullName,
              normalName: relation.normalName,
              shortName: relation.shortName,
              hasMany: relation.using,
              opposite: relation.opposite,
              fields: relation.fields,
            },
          });
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
