import { IEntityContext } from './IEntityContext';
import { IField } from '../interfaces/IField';
import { RestartType } from '../interfaces/types';

export interface IFieldContext extends IEntityContext {
  readonly field: IField;
  restart(level: RestartType);
}
