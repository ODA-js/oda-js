import { ModelHook, ValidationResultType } from 'oda-model';
export declare type GeneratorInit = {
    hooks?: ModelHook[];
    schema: any;
    rootDir?: string;
    templateRoot?: string;
    acl?: string[];
    context?: {
        typeMapper?: any;
        defaultAdapter?: 'mongoose' | 'sequelize';
    };
    logs?: ValidationResultType;
};
//# sourceMappingURL=init.d.ts.map