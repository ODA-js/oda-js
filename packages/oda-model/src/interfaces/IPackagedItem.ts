import { IPackage } from './IPackage';

export type PackagedItemInit = IPackagedItemInit | string;

export interface IPackagedItemInit {
  name: string;
  package?: IPackage;
}

export interface IPackagedItemStore {
  name: string;
  package: IPackage;
}

export interface IPackagedItem {
  readonly name: string;
  readonly package?: IPackage;
  toJS(): object;
}
