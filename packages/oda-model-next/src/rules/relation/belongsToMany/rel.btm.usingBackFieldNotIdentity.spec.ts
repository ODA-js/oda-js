import 'jest';
import Rule from './usingBackFieldNotIdentity';

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
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => ({
            identity: false,
            updateWith
          }))
        }
      }
    } as any);
    expect(updateWith).toBeCalledWith({ identity: true });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        using: {
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => ({
            updateWith,
            identity: true
          }))
        }
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
