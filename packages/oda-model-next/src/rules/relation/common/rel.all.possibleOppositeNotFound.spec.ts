import Rule from './possibleOppositeNotFound';

describe('rule', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('fixable', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: false,
        ref: {
          entity: true,
        },
        updateWith,
      },
      entity: {
        name: true,
      },
      field: {
        name: true,
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              values: jest.fn().mockReturnValueOnce([
                {
                  name: true,
                  relation: {
                    ref: {
                      entity: true,
                      field: true,
                    },
                  },
                },
              ]),
            },
          }),
        },
      },
    } as any);
    expect(updateWith).toBeCalledWith({ opposite: true });
    expect(result).toMatchSnapshot();
  });

  it('throw regular more than one opposite', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: false,
        ref: {
          entity: true,
        },
      },
      entity: {
        name: true,
      },
      field: {
        name: true,
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              values: jest.fn().mockReturnValueOnce([
                {
                  relation: {
                    ref: {
                      entity: true,
                      field: true,
                    },
                  },
                },
                {
                  relation: {
                    ref: {
                      entity: true,
                      field: true,
                    },
                  },
                },
              ]),
            },
          }),
        },
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });

  it('critics no possible opposite', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: false,
        ref: {
          entity: true,
        },
      },
      entity: {
        name: true,
      },
      field: {
        name: true,
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              values: jest.fn().mockReturnValueOnce([]),
            },
          }),
        },
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });

  it('throw belongsToMany one fixable opposite', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        modelType: 'relation',
        verb: 'BelongsToMany',
        opposite: false,
        ref: {
          entity: true,
        },
        updateWith,
      },
      entity: {
        name: true,
      },
      field: {
        name: true,
      },
      package: {
        items: {
          get: jest.fn().mockReturnValueOnce({
            modelType: 'entity',
            fields: {
              values: jest.fn().mockReturnValueOnce([
                {
                  name: true,
                  relation: {
                    modelType: 'relation',
                    verb: 'BelongsToMany',
                    ref: {
                      entity: true,
                      field: true,
                    },
                  },
                },
              ]),
            },
          }),
        },
      },
    } as any);
    expect(updateWith).toBeCalledWith({ opposite: true });
    expect(result).toMatchSnapshot();
  });

  it('not throw 1', () => {
    const updateWith = jest.fn();
    const result = rule.validate({
      relation: {
        opposite: true,
        ref: {
          entity: true,
        },
        updateWith,
      },
    } as any);
    expect(updateWith).not.toBeCalled();
    expect(result).toMatchSnapshot();
  });

});
