import { IValidationResult, ValidationResultType } from 'oda-model';
import { MetaModel } from 'oda-model';
import { GeneratorInit } from './init';
export declare function hasResult(log: IValidationResult[], type: ValidationResultType): boolean;
export declare function showLog(log: any, visibility?: ValidationResultType | ValidationResultType[]): void;
export declare function collectErrors(model: MetaModel): any[];
export default function validate(args: GeneratorInit): void;
//# sourceMappingURL=validate.d.ts.map