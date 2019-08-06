import { IModelType, IValidationResult, IValidator, MetaModelType } from '../interfaces';
import { IEntityContext, IFieldContext, IModelContext, IPackageContext, ValidationContext } from './interfaces';
import { Rule } from './rules';
export declare class Validator implements IValidator {
    errors: IValidationResult[];
    rules: {
        [modelType: string]: object[];
    };
    constructor();
    registerRule<T extends ValidationContext>(modelType: MetaModelType, rule: Rule<T>[]): void;
    getRules<T extends ValidationContext>(modelType: MetaModelType): Rule<T>[];
    check(item: any, options?: {
        model?: IModelContext;
        package?: IPackageContext;
        entity?: IEntityContext;
        field?: IFieldContext;
    }): IValidationResult[];
}
export interface IVisitor<T extends IModelType, C extends ValidationContext> {
    context: C;
    visit(item: T): any;
}
//# sourceMappingURL=validator.d.ts.map