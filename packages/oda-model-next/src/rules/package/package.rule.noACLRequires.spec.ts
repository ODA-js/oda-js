import 'jest';
import Rule from './noACLRequired';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      package: {
        abstract: true,
        acl: 100,
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      package: {
        abstract: true,
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
