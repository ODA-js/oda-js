import 'jest';
import Rule from './refFieldNotIndexed';

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
          entity: true
        }
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              get: jest.fn().mockReturnValueOnce({
                indexed: false,
                updateWith
              })
            }
          })
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
          entity: true
        }
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              get: jest.fn().mockReturnValueOnce({
                indexed: true,
                updateWith
              })
            }
          })
        }
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
