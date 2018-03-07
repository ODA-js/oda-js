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
          updateWith,
        },
      },
      entity: {
        fields: {
          get: jest.fn(() => false),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        ref: {
          backField: true,
          updateWith,
        },
      },
      entity: {
        fields: {
          get: jest.fn(() => true),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

});
