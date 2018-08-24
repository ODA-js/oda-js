import 'jest';
import Rule from './refEntityNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('throw', () => {
    const result = rule.validate({
      relation: {
        ref: {
          entity: true,
        },
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'notEntity',
          }),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const result = rule.validate({
      relation: {
        ref: {
          entity: true,
        },
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
          }),
        },
      },
    } as any);
    expect(result).toMatchSnapshot();
  });
});
