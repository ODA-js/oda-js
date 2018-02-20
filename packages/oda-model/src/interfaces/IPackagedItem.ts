import { IPackage } from './IPackage';
import { IContext } from '../contexts/IContext';
import { IPackageContext } from '../contexts/IPackageContext';

export type PackagedItemInit = IPackagedItemInit | string;

export interface IPackagedItemInit {
  name: string;
  context: IPackageContext;
}

export interface IPackagedItemStore {
  name: string;
  context: IPackageContext;
}

export interface IPackagedItem {
  readonly name: string;
  readonly context: IPackageContext;
  toJS(): object;
}
