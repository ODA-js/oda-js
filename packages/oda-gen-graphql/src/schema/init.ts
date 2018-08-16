import { ModelHook, ValidationResultType } from 'oda-model';
export type GeneratorInit = {
  hooks?: ModelHook[];
  schema: any;
  rootDir?: string;
  templateRoot?: string;
  acl?: {
    [key: string]: number;
  };
  context?: {
    typeMapper?: any;
    defaultAdapter?: 'mongoose' | 'sequelize';
  };
  logs?: ValidationResultType;
};
