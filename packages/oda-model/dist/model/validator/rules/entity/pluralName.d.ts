import { IValidationResult } from '../../../interfaces';
import { IEntityContext } from '../../interfaces';
import { Rule } from '../../rules';
export default class implements Rule<IEntityContext> {
    name: string;
    description: string;
    validate(context: IEntityContext): IValidationResult[];
}
//# sourceMappingURL=pluralName.d.ts.map