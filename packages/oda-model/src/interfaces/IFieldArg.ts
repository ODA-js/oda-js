import { INamedItem } from './IModelType';

export interface IFieldArg extends INamedItem {
  type?: string;
  required?: boolean;
  defaultValue?: string;
}


