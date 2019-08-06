import { IValidationResult, ValidationResultType } from 'oda-model';
import { Generator } from './interfaces';
import { MetaModel } from 'oda-model';
export declare function hasResult(log: IValidationResult[], type: ValidationResultType): boolean;
export declare function showLog(log: any, visibility?: ValidationResultType | ValidationResultType[]): void;
export declare function collectErrors(model: MetaModel): any[];
declare const _default: (args: Generator) => void;
export default _default;
//# sourceMappingURL=validate.d.ts.map