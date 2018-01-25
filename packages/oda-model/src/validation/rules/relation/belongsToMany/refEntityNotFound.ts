import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity, IsBelongsToMany } from '../../../helpers';
import { IEntity } from '../../../interfaces/IEntity';
import { HasMany } from '../../../model/HasMany';
import { RelationTransform } from '../../../model/BelongsToMany';

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
          context.field.updateWith({
            relation: new HasMany({
              name: context.relation.name,
              title: context.relation.title,
              description: context.relation.description,
              fullName: context.relation.fullName,
              normalName: context.relation.normalName,
              shortName: context.relation.shortName,
              modelType: 'HasMany',
              ref: replaceRef.using,
              hasMany: replaceRef.using,
              opposite: context.relation.opposite,
              verb: 'HasMany',
              fields: RelationTransform.fields.transform(context.relation.fields),
            }),
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
