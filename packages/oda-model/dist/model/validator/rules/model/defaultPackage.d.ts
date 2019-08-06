import { IValidationResult } from '../../../interfaces';
import { IModelContext } from '../../interfaces';
import { Rule } from '../../rules';
export default class implements Rule<IModelContext> {
    name: string;
    description: string;
    validate(context: IModelContext): IValidationResult[];
}
//# sourceMappingURL=defaultPackage.d.ts.map