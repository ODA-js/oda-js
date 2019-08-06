import { IValidationResult } from '../../../interfaces';
import { IFieldContext, IRelationContext } from '../../interfaces';
import { Rule } from '../../rules';
export declare class RelationRule implements Rule<IRelationContext> {
    name: string;
    description: string;
    validate(context: IFieldContext): IValidationResult[];
    constructor(name: string);
}
//# sourceMappingURL=default.d.ts.map