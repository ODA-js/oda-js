
import { Validator } from '../validators/Validator';
import { IModel } from '../interfaces/IModel';
import { IValidationResult } from '../interfaces/IValidationResult';
import { ModelContext } from '../contexts/ModelContext';
import { RestartLevelError } from '../errors';

export class ModelVisitor {
  public validator: Validator;
  public visit(model: IModel): IValidationResult[] {
    const context = new ModelContext(model);
    const result: IValidationResult[] = [];
    if (context.isValid) {
      let done = false;
      while (!done) {
        try {
          const rules = this.validator.getRules('model');
          rules.forEach(rule => result.push(...rule.validate(context)));
          Array.from(model.packages.values()).filter(p => p.name === model.name).forEach(p => {
            result.push(...this.validator.check(p, { model: context }));
          });
          done = true;
        } catch (err) {
          if (!(err instanceof RestartLevelError)) {
            throw err;
          }
        }
      }
    } else {
      result.push({
        model: context.model.name,
        message: 'Validation context invalid',
        result: 'error',
      });
    }
    return result.map(r => ({
      ...r,
      model: context.model.name,
    }));
  }
  constructor(validator: Validator) {
    this.validator = validator;
  }
}
