import 'jest';
import Rule from './notCompatibleRelationEnds';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      relation: {
        opposite: true,
        ref: {
          entity: true,
        },
        verb: 'BelongsTo',
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              has: jest.fn().mockReturnValueOnce(true),
              get: jest.fn().mockReturnValueOnce({
                relation: {
                  verb: 'BelongsTo',
                },
              }),
            },
          }),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const result = rule.validate({
      relation: {
        opposite: true,
        ref: {
          entity: true,
        },
        verb: 'BelongsTo',
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              has: jest.fn().mockReturnValueOnce(true),
              get: jest.fn().mockReturnValueOnce({
                relation: {
                  verb: 'HasMany',
                },
              }),
            },
          }),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
