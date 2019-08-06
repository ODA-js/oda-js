import { IValidationResult } from '../../../interfaces';
import { IPackageContext } from '../../interfaces';
import { Rule } from '../../rules';
export default class implements Rule<IPackageContext> {
    name: string;
    description: string;
    validate(context: IPackageContext): IValidationResult[];
}
//# sourceMappingURL=emptyName.d.ts.map