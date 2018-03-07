export type ValidationResultType = 'error' | 'warning' | 'critics' | 'fixable';

export interface IValidationResult {
  model?: string;
  package?: string;
  entity?: string;
  field?: string;
  result: ValidationResultType;
  message?: string;
}
