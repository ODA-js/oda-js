import 'jest';
import Rule from './oppositeNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: true,
        ref: {
          entity: true
        },
        updateWith
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              has: jest.fn().mockReturnValueOnce(false)
            }
          })
        }
      }
    } as any);
    expect(updateWith).toBeCalledWith({ opposite: null });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: true,
        ref: {
          entity: true
        },
        updateWith
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              has: jest.fn().mockReturnValueOnce(true)
            }
          })
        }
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
