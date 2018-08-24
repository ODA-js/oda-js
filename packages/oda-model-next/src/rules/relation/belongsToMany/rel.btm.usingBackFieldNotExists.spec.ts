import 'jest';
import Rule from './usingBackFieldNotExists';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        using: {
          backField: true,
          updateWith
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => null)
        }
      }
    } as any);
    expect(updateWith).toBeCalledWith({ backField: 'id' });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        using: {
          backField: true,
          updateWith
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => true)
        }
      }
    } as any);
    expect(updateWith).not.toBeCalledWith();
    expect(result).toMatchSnapshot();
  });
});
