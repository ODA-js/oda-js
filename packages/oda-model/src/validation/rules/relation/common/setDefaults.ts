import {Persistent, IUpdatable} from '../../../model/Persistent';
import { IEntity } from '../../../interfaces/IEntity';
import { IRelationContext } from '../../../interfaces/IRelationContext';
import { IValidationResult } from '../../../interfaces/IValidationResult';
import { Rule } from '../../../rule';
import { isEntity } from '../../../helpers';
import { IRelationInit, IRelationStore } from '../../../interfaces/IRelation';
import { IBelongsToMany } from '../../../interfaces/IBelongsToMany';
import { IBelongsTo } from '../../../interfaces/IBelongsTo';

export default class implements Rule<IRelationContext> {
  public name = 'relation-common-ref-field-not-indexed-fix';
  public description = 'referenced field not indexed';
  public validate(context: IRelationContext): IValidationResult[] {
    const result: IValidationResult[] = [];
    (context.relation as IUpdatable).updateWith({});
    return result;
  }
}
