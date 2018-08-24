import 'jest';
import Rule from './pluralName';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      entity: {
        plural: 'species',
        name: 'species'
      }
    } as any);

    expect(result).toMatchSnapshot();
  });

  it('not throw', () => {
    const result = rule.validate({
      entity: {
        plural: 'AllSpecies',
        name: 'species'
      }
    } as any);

    expect(result).toMatchSnapshot();
  });
});
