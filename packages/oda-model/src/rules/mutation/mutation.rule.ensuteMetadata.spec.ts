import { IPackagedItemInit } from '../../interfaces/IPackagedItem';
import { Entity } from '../../model/Entity';
import { Model } from '../../model/Model';
import { Package } from '../../model/Package';
import Rule from './ensureMetadata';
import { IMutationInit } from '../../interfaces/IMutation';

describe('rule', () => {
  let rule: Rule;

  const models: {
    model: Model,
    package: Package,
  } = {} as any;

  beforeEach(() => {
    rule = new Rule();
    expect(() => models.model = new Model({
      name: 'TodoItems',
    })).not.toThrow();
    models.package = models.model.packages.get('system') as Package;
  });

  it('fix acl', () => {
    models.package.updateWith({
      items: [{
        name: 'mutation',
        args: {
          input: {},
        },
        payload: {
          result: {},
        },
      } as IMutationInit],
    });
    debugger;
    const mutation = models.package.items.get('mutation');
    expect(mutation).toMatchSnapshot();
    const result = rule.validate({
      model: {},
      package: {},
      mutation,
    } as any);
    expect(mutation).toMatchSnapshot();
  });

});
