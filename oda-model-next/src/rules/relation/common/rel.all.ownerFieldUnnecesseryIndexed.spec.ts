import 'jest';
import Rule from './ownerFieldUnnecesseryIndexed';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        identity: true,
        indexed: true,
        updateWith,
      },
    } as any);
    expect(updateWith).toBeCalledWith({
      identity: null,
      indexed: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        identity: false,
        indexed: false,
        updateWith,
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
