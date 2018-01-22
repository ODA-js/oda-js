import { IPackage } from './IPackage';
import { IModelType, IModelTypeProps } from './IModelType';

export type IModelProps = IModelTypeProps & {
  packages: Map<string, IPackage>;
};

export interface IModel extends IModelType<IModelProps> {
  readonly defaultPackage: IPackage;
}
