import Rule from './checkMutationName';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      mutation: {
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      mutation: {
        name: 'species',
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
