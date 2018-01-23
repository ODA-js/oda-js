import { IPackage } from './IPackage';
import { IModelType, IModelTypeProps } from './IModelType';
import { Map } from 'immutable';

export type IModelProps = IModelTypeProps & {
  packages: IPackage[];
};

export type IModelPropsStored = IModelTypeProps & {
  packages: Map<string, IPackage>;
};

export interface IModel extends IModelType<IModelProps, IModelPropsStored> {
  readonly defaultPackage: IPackage;
}
