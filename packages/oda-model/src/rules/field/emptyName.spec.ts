import Rule from './emptyName';

describe('emptyName', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {

    const result = rule.validate({
      field: {
      },
    } as any);

    expect(result).toMatchSnapshot();

  });

  it('not throw', () => {
    const result = rule.validate({
      field: {
        name: 'species',
      },
    } as any);

    expect(result).toMatchSnapshot();

  });
});
