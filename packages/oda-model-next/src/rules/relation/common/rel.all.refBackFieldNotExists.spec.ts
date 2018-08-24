import 'jest';
import Rule from './refBackFieldNotExists';

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
          updateWith
        }
      },
      entity: {
        fields: {
          get: jest.fn().mockReturnValueOnce(false)
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
        ref: {
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn().mockReturnValueOnce(true)
        }
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
