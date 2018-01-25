import { IPackage } from './IPackage';
import { IModelType, IModelTypeProps } from './IModelType';
import { Map } from 'immutable';
import { IUpdatable } from '../model/Persistent';

export type IModelProps = IModelTypeProps & {
  packages: IPackage[];
};

export type IModelPropsStore = IModelTypeProps & {
  packages: Map<string, IPackage>;
};

export type IModelTransform = {
  [k in keyof IModelProps]?: {
    transform: (input: IModelProps[k]) => IModelPropsStore[k];
    reverse: (input: IModelPropsStore[k]) => IModelProps[k];
  }
};

export interface IModel extends IModelType<IModelProps, IModelPropsStore>,
  IUpdatable<IModelProps> {
  readonly defaultPackage: IPackage;
  readonly modelType: 'model';
}
