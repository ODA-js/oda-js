"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const empty_1 = require("./empty");
describe('override by name', () => {
    class UserHooks extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'UserHooks';
            this._hooks = [
                {
                    'RootMutation.createUser': 1,
                    'RootMutation.updateUser': 1,
                },
            ];
        }
    }
    class UserOriginal extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'User';
            this._queryEntry = {
                queryEntry: [`original`],
            };
            this._viewerEntry = {
                viewerEntry: [`original`],
            };
            this._resolver = {
                User: {
                    id: 'UserOriginal',
                    isAdmin: true,
                    toBeRemoved: true,
                },
            };
            this._hooks = [
                {
                    'RootMutation.createUser': false,
                    'RootMutation.updateUser': true,
                },
            ];
        }
    }
    class User extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'User';
            this._queryEntry = {
                queryEntry: [`override`],
            };
            this._viewerEntry = null;
            this._resolver = {
                User: {
                    id: 'User',
                    isSystem: true,
                    toBeRemoved: null,
                },
            };
            this._hooks = [
                {
                    'RootMutation.createUser': true,
                    'RootMutation.updateUser': true,
                },
            ];
        }
    }
    class FirstPackage extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'First';
            this._composite = [new UserHooks({}), new UserOriginal({})];
        }
    }
    class SecondPackage extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'Second';
            this._composite = [new User({})];
        }
    }
    class MainSchema extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'Main';
            this._composite = [new FirstPackage({}), new SecondPackage({})];
        }
    }
    it('override objects', () => {
        const schema = new MainSchema({});
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
        expect(schema).toMatchSnapshot();
        expect(schema.hooks.length).toBe(2);
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
    });
    it('remove any entiy if needed', () => {
        const schema = new MainSchema({});
        schema.build();
        expect(schema.viewerEntry.length).toBe(0);
    });
});
describe('override in module', () => {
    class UserHooks extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'UserHooks';
            this._hooks = [
                {
                    'RootMutation.createUser': 1,
                    'RootMutation.updateUser': 1,
                },
            ];
        }
    }
    class UserOriginal extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._name = 'User';
            this._queryEntry = {
                queryEntry: [`original`],
            };
            this._resolver = {
                User: {
                    id: 'UserOriginal',
                    isAdmin: true,
                    toBeRemoved: true,
                },
            };
            this._hooks = [
                {
                    'RootMutation.createUser': true,
                    'RootMutation.updateUser': true,
                },
            ];
        }
    }
    class User extends empty_1.GQLModule {
        constructor() {
            super(...arguments);
            this._extend = [new UserOriginal({})];
            this._composite = [new UserHooks({})];
            this._name = 'User';
            this._queryEntry = {
                queryEntry: [`override`],
            };
            this._resolver = {
                User: {
                    id: 'User',
                    isSystem: true,
                    toBeRemoved: null,
                },
            };
            this._hooks = [
                {
                    'RootMutation.createUser': false,
                    'RootMutation.updateUser': true,
                },
            ];
        }
    }
    it('override objects', () => {
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
        expect(schema.hooks.length).toBe(2);
        expect(schema).toMatchSnapshot();
    });
    it('override strings', () => {
        const schema = new User({});
        schema.build();
        expect(schema.queryEntry).not.toBeNull();
        expect(schema.queryEntry).not.toBeUndefined();
        expect(schema.queryEntry).toMatchObject(['override']);
    });
    it('remove items if needed', () => {
        const schema = new User({});
        schema.build();
        expect(schema.resolver.User.toBeRemoved).toBeNull();
    });
});
//# sourceMappingURL=empty.test.js.map