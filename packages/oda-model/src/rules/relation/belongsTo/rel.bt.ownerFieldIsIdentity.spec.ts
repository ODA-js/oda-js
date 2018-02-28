import Rule from './ownerFieldIsIdentity';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: false,
        },
      },
      field: {
        identity: true,
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: false,
        },
      },
      field: {
        identity: 'some composite key',
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 2', () => {
    const result = rule.validate({
      relation: {
        ref: {
          backField: false,
        },
      },
      field: {
        identity: 'some composite key',
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
