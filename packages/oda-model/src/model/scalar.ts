import {
  MetaModelType, ScalarInput,
} from './interfaces';
import { ModelBase } from './modelbase';

export class Scalar extends ModelBase {
  public modelType: MetaModelType = 'scalar';
  constructor(obj: ScalarInput) {
    super(obj);
  }
}
