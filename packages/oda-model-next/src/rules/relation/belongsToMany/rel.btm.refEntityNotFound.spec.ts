import 'jest';
import Rule from './refEntityNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        updateWith
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        ref: {
          entity: true
        },
        using: {
          entity: true
        },
        toJS: jest.fn(() => ({
          name: 'relation.name',
          title: 'relation.title',
          description: 'relation.description',
          fullName: 'relation.fullName',
          normalName: 'relation.normalName',
          shortName: 'relation.shortName',
          using: 'relation.using',
          opposite: 'relation.opposite',
          fields: 'relation.fields'
        }))
      },
      package: {
        items: {
          get: jest
            .fn()
            .mockReturnValueOnce({
              modelType: 'not entity'
            })
            .mockReturnValueOnce({
              modelType: 'entity'
            })
        }
      }
    } as any);

    expect(updateWith).toBeCalledWith({
      relation: {
        name: 'relation.name',
        title: 'relation.title',
        description: 'relation.description',
        fullName: 'relation.fullName',
        normalName: 'relation.normalName',
        shortName: 'relation.shortName',
        hasMany: 'relation.using',
        opposite: 'relation.opposite',
        fields: 'relation.fields'
      }
    });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      field: {
        updateWith
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        ref: {
          entity: true
        },
        using: {
          entity: true
        }
      },
      package: {
        items: {
          get: jest
            .fn()
            .mockReturnValueOnce({
              modelType: 'not entity'
            })
            .mockReturnValueOnce({
              modelType: 'not entity'
            })
        }
      }
    } as any);

    expect(result).toMatchSnapshot();
    expect(updateWith).not.toBeCalled();
  });
});
