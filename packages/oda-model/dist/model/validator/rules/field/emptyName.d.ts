import { IValidationResult } from '../../../interfaces';
import { IFieldContext } from '../../interfaces';
import { Rule } from '../../rules';
export default class implements Rule<IFieldContext> {
    name: string;
    description: string;
    validate(context: IFieldContext): IValidationResult[];
}
//# sourceMappingURL=emptyName.d.ts.map