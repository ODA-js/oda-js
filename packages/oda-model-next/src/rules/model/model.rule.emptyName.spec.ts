import Rule from './emptyName';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      model: {
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      model: {
        name: 'species',
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
