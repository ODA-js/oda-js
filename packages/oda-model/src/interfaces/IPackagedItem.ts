import { IPackage } from './IPackage';
import { IContext } from '../contexts/IContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { isIPackageContext } from '../helpers';
import { IContextable } from '../contexts/IContextable';

export type PackagedItemInit = IPackagedItemInit | string;

export interface IPackagedItemInit {
  name: string;
}

export interface IPackagedItemStore {
  name: string;
  context: IPackageContext;
}

export interface IPackagedItem extends IContextable<IPackageContext> {
  readonly name: string;
  toJS(): object;
}
