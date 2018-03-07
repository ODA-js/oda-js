import Rule from './refFieldNotIdentity';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      package: {
        items: {
          get: jest.fn(() => ({
            modelType: 'entity',
            fields: {
              get: jest.fn(() => ({
                identity: false,
                updateWith,
              })),
            },
          })),
        },
      },
      relation: {
        ref: {
          backField: true,
        },
      },
    } as any);
    expect(updateWith).toBeCalledWith({ identity: true });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      package: {
        items: {
          get: jest.fn(() => ({
            modelType: 'entity',
            fields: {
              get: jest.fn(() => ({
                identity: true,
                updateWith,
              })),
            },
          })),
        },
      },
      relation: {
        ref: {
          backField: true,
        },
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });

});
