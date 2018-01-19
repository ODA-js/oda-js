import { IPackage } from './IPackage';
import { IModelType } from './IModelType';

export interface IModel extends IModelType {
  packages: Map<string, IPackage>;
  defaultPackage: IPackage;
}
