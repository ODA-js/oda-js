import 'jest';
import Rule from './defaultPackage';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      model: {},
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      model: {
        defaultPackage: 'species',
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
