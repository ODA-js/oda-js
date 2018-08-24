import 'jest';
import Rule from './ACLRequired';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      package: {
        abstract: false
      }
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      package: {
        abstract: false,
        acl: 100
      }
    } as any);
    expect(result).toMatchSnapshot();
  });
});
