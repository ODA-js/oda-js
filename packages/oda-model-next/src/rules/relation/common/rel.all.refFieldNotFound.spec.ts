import 'jest';
import Rule from './refFieldNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
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
              get: jest.fn().mockReturnValueOnce(false)
            }
          })
        }
      }
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
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
              get: jest.fn().mockReturnValueOnce(true)
            }
          })
        }
      }
    } as any);
    expect(result).toMatchSnapshot();
  });
});
