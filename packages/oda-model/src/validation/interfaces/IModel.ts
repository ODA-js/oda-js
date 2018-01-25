import { IPackage } from './IPackage';
import { IModelType, IModelTypeProps } from './IModelType';
import { Map } from 'immutable';

export type IModelProps = IModelTypeProps & {
  packages: IPackage[];
};

export type IModelPropsStore = IModelTypeProps & {
  packages: Map<string, IPackage>;
};

export interface IModel extends IModelType<IModelProps, IModelPropsStore> {
  readonly defaultPackage: IPackage;
}
