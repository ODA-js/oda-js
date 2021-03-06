import { IRelationContext } from '../../contexts/IRelationContext';
import { IValidationResult } from '../../interfaces/IValidationResult';
import { Rule } from '../../rule';

export class RelationRule implements Rule<IRelationContext> {
  public name: string;
  public description: string;
  public validate(context: IRelationContext): IValidationResult[] {
    throw new Error('Method not implemented.');
  }
  constructor(name: string) {
    this.name = name;
  }
}
