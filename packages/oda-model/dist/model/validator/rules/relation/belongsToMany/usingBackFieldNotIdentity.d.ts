import { IValidationResult } from '../../../../interfaces';
import { IRelationContext } from '../../../interfaces';
import { Rule } from '../../../rules';
export default class implements Rule<IRelationContext> {
    name: string;
    description: string;
    validate(context: IRelationContext): IValidationResult[];
}
//# sourceMappingURL=usingBackFieldNotIdentity.d.ts.map