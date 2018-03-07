import { IValidationResult } from '../interfaces';
import {
  IEntityContext,
  IFieldContext,
  IModelContext,
  IPackageContext,
  IRelationContext,
  ValidationContext,
} from './interfaces';

export interface Rule<T extends ValidationContext> {
  name: string;
  description: string;
  validate(context: T): IValidationResult[];
}
