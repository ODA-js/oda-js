import 'jest';
import { IPackagedItemInit } from '../../interfaces/IPackagedItem';
import { Entity } from '../../model/Entity';
import { Model } from '../../model/Model';
import { Package } from '../../model/Package';
import Rule from './ensureMetadata';
import { IMutationInit } from '../../interfaces/IMutation';

describe('rule', () => {
  let rule: Rule;

  beforeEach(() => {
    rule = new Rule();
  });

  it('fix acl', () => {
    let update = {};
    const updateWith = jest.fn(args => {
      update = {
        ...update,
        ...args,
      };
    });

    const result = rule.validate({
      model: {},
      package: {},
      mutation: {
        name: 'mutation',
        args: {
          input: {},
        },
        payload: {
          result: {},
        },
        updateWith,
      },
    } as any);
    expect(update).toMatchSnapshot();
  });
});
