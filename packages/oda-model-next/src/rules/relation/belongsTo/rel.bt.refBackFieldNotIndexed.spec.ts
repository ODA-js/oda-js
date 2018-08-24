import 'jest';
import Rule from './refBackFieldNotIndexed';

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
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => ({
            indexed: false,
            updateWith
          }))
        }
      }
    } as any);
    expect(updateWith).toBeCalledWith({ indexed: true });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
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
          get: jest.fn(() => ({
            indexed: true,
            updateWith
          }))
        }
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
