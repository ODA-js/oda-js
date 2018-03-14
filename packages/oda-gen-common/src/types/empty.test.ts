import { GQLModule } from './empty';

describe("module override", () => {

  class UserOriginal extends GQLModule {
    protected _name = 'User';
    protected _queryEntry = {
      'queryEntry': [`original`],
    };
    protected _resolver = {
      User: {
        id: 'UserOriginal',
        isAdmin: true,
        toBeRemoved: true,
      },
    }
  }

  class User extends GQLModule {
    protected _name = 'User';
    protected _queryEntry = {
      'queryEntry': [`override`],
    };
    protected _resolver = {
      User: {
        id: 'User',
        isSystem: true,
        toBeRemoved: null,
      },
    }
  }

  class FirstPackage extends GQLModule {
    protected _name = 'First';
    protected _extend = [
      new UserOriginal({}),
    ];
  }

  class SecondPackage extends GQLModule {
    protected _name = 'Second';
    protected _extend = [
      new User({}),
    ];
  }

  class MainSchema extends GQLModule {
    protected _name = 'Main';
    protected _extend = [
      new FirstPackage({}),
      new SecondPackage({}),
    ];
  }

  it('override objects', () => {
    const schema = new MainSchema({});
    debugger;
    schema.build();
    expect(schema.resolver.User).not.toBeNull();
    expect(schema.resolver.User).not.toBeUndefined();
    expect(schema.resolver.User).toMatchObject({
      id: 'User',
      isSystem: true,
      isAdmin: true,
    });
    expect(schema.queryEntry).not.toBeNull();
    expect(schema.queryEntry).not.toBeUndefined();

  });

  it('override strings', () => {
    const schema = new MainSchema({});
    schema.build();
    expect(schema.queryEntry).not.toBeNull();
    expect(schema.queryEntry).not.toBeUndefined();
    expect(schema.queryEntry).toMatchObject(['override']);
  });

  it('remove items if needed', () => {
    const schema = new MainSchema({});
    schema.build();
    expect(schema.resolver.User.toBeRemoved).toBeNull();
  })
});

describe('module prohibit', () => {
  class UserOriginal extends GQLModule {
    protected _name = 'User';
    protected _queryEntry = {
      'queryEntry': [`original`],
    };
    protected _resolver = {
      User: {
        id: 'UserOriginal',
        isAdmin: true,
        toBeRemoved: true,
      },
    }
  }

  class User extends GQLModule {
    protected _extend = [
      new UserOriginal({})
    ];
    protected _name = 'User';
    protected _queryEntry = {
      'queryEntry': [`override`],
    };
    protected _resolver = {
      User: {
        id: 'User',
        isSystem: true,
        toBeRemoved: null,
      },
    }
  }

  it('using null', () => {
    const schema = new User({});
    schema.build();
    expect(schema.resolver.User).not.toBeNull();
    expect(schema.resolver.User).not.toBeUndefined();
    expect(schema.resolver.User).toMatchObject({
      id: 'User',
      isSystem: true,
      isAdmin: true,
      toBeRemoved: null,
    });
    expect(schema.queryEntry).not.toBeNull();
  })

  it('override strings', () => {
    const schema = new User({});
    // debugger;
    schema.build();
    expect(schema.queryEntry).not.toBeNull();
    expect(schema.queryEntry).not.toBeUndefined();
    expect(schema.queryEntry).toMatchObject(['override']);
  });

  it('remove items if needed', () => {
    const schema = new User({});
    schema.build();
    // expect(schema.resolver.User).toBeNull();
    expect(schema.resolver.User.toBeRemoved).toBeNull();
  })
});
