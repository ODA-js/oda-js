import 'jest';
import Rule from './refBackFieldNotIdentity';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        ref: {
          backField: true,
        },
      },
      entity: {
        fields: {
          get: jest.fn().mockReturnValueOnce({
            identity: false,
            updateWith,
          }),
        },
      },
    } as any);
    expect(updateWith).toBeCalledWith({ identity: true });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        ref: {
          backField: true,
        },
      },
      entity: {
        fields: {
          get: jest.fn().mockReturnValueOnce({
            identity: true,
          }),
        },
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
