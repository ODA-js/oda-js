import 'jest';
import Rule from './usingFieldsCheck';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const updateWithEntity = jest.fn();
    const updateField = jest.fn();
    const result = rule.validate({
      package: {
        items: {
          get: jest.fn(() => ({
            modelType: 'entity',
            fields: {
              get: jest
                .fn()
                .mockReturnValueOnce({
                  type: 'string'
                })
                .mockReturnValueOnce({
                  type: 'string',
                  updateWith: updateField
                })
                .mockReturnValueOnce(false)
            },
            updateWith: updateWithEntity
          }))
        }
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        fields: [
          {
            name: 'one',
            type: 'string'
          },
          {
            name: 'two',
            type: 'number'
          },
          {
            name: 'three',
            type: 'number'
          }
        ],
        using: {
          entity: true
        }
      }
    } as any);
    expect(updateField).toBeCalledWith({ type: 'number' });
    expect(updateWithEntity).toBeCalledWith({
      fields: [{ name: 'three', type: 'number' }]
    });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      package: {
        items: {
          get: jest.fn(() => ({
            modelType: 'entity',
            fields: {
              get: jest
                .fn()
                .mockReturnValueOnce({
                  type: 'string'
                })
                .mockReturnValueOnce({
                  type: 'number'
                })
            },
            updateWith
          }))
        }
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        fields: [
          {
            name: 'one',
            type: 'string'
          },
          {
            name: 'two',
            type: 'number'
          }
        ]
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });

  it('not throw 2', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      package: {
        items: {
          get: jest.fn(() => ({
            modelType: 'entity',
            updateWith
          }))
        }
      },
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        fields: false
      }
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });
});
