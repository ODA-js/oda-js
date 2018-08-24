import 'jest';
import Rule from './refBackFieldIsIdentity';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => ({
            identity: true
          }))
        }
      }
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => ({
            identity: false
          }))
        }
      }
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 2', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: true
        }
      },
      entity: {
        fields: {
          get: jest.fn(() => null)
        }
      }
    } as any);
    expect(result).toMatchSnapshot();
  });
});
