import { IContextable } from '../contexts/IContextable';
import { IPackageContext } from '../contexts/IPackageContext';

export type PackagedItemInit = IPackagedItemInit | string;

export interface IPackagedItemInit {
  name: string;
}

export interface IPackagedItemStore {
  name: string;
}

export interface IPackagedItem extends IContextable<IPackageContext> {
  readonly name: string;
  toJS(): object;
}
