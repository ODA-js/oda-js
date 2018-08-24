import 'jest';
import Rule from './ownerFieldNotIndexed';

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
          entity: 'Cool',
          field: 'refee',
          backField: false,
        },
      },
      field: {
        indexed: false,
        updateWith,
      },
    } as any);
    expect(updateWith).toBeCalled();
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        ref: {
          entity: 'Cool',
          field: 'refee',
          backField: false,
        },
      },
      field: {
        indexed: true,
        updateWith,
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
