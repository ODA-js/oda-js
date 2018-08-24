import 'jest';
import Rule from './refAndUsingEntitiesNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        updateWith,
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        ref: {
          entity: true,
        },
        using: {
          entity: true,
        },
      },
      package: {
        items: {
          get: jest
            .fn()
            .mockReturnValueOnce({
              modelType: 'not entity',
            })
            .mockReturnValueOnce({
              modelType: 'not entity',
            }),
        },
      },
    } as any);
    expect(updateWith).toBeCalledWith({ relation: null });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        updateWith,
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        ref: {
          entity: true,
        },
        using: {
          entity: true,
        },
      },
      package: {
        items: {
          get: jest
            .fn()
            .mockReturnValueOnce({
              modelType: 'entity',
            })
            .mockReturnValueOnce({
              modelType: 'entity',
            }),
        },
      },
    } as any);
    expect(updateWith).not.toBeCalledWith();
    expect(result).toMatchSnapshot();
  });
});
