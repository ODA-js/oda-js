import 'jest';
import { Enum, Query, GQLType, Schema, Type } from './object';
import gql from 'graphql-tag';
import { debug } from 'util';

describe('Enum', () => {
  it('parse name from schema as ast', () => {
    const item = new Enum({
      schema: gql`
        enum colors {
          Red
          black
          green
        }
      `,
    });
    expect(item.name).toBe('colors');
  });
  it('parse name from schema as string', () => {
    const item = new Enum({
      schema: `
        enum colors {
          Red
          black
          green
        }
      `,
    });
    expect(item.name).toBe('colors');
  });
});

describe('Query', () => {
  it('not throws to create with wrong schema', () => {
    let query = new Query('user(id: String): String');
    expect(query.valid).toBe(false);
    expect(query.name).toBe(undefined);
    expect(query.schema).toBe(undefined);
    expect(query.resolver).toBe(undefined);
  });

  it('not throws to create with right schema', () => {
    let query = new Query(gql`
      extend type RootQuery {
        user(id: String): String
      }
    `);
    expect(query.valid).toBe(true);
    expect(query.name).toBe('user');
    expect(query.resolver).toBe(undefined);
  });
});

describe('GQLType', () => {
  it('creates Query', () => {
    const item = GQLType.create(gql`
      extend type RootQuery {
        user(id: String): String
      }
    `);
    expect(item[0].type).toBe('query');
    expect(item[0].name).toBe('user');
  });
  it('creates Mutation', () => {
    const item = GQLType.create(gql`
      extend type RootMutation {
        updateUser(id: String, payload: UserPayload): String
      }
    `);
    expect(item[0].type).toBe('mutation');
    expect(item[0].name).toBe('updateUser');
  });
  it('creates Type', () => {
    const item = GQLType.create(gql`
      extend type Picture {
        name: string
        size: ImageSize
      }
    `);
    expect(item[0].type).toBe('type');
    expect(item[0].name).toBe('Picture');
  });
});

describe('Schema', () => {
  it('created from string name', () => {
    const res = new Schema('Person');
    expect(res).not.toBeUndefined();
    expect(res.name).toBe('Person');
  });
  it('created from string name', () => {
    const res = new Schema({
      name: 'Person',
    });
    expect(res).not.toBeUndefined();
    expect(res.name).toBe('Person');
  });
  it('created from SchemaInput with items', () => {
    const res = new Schema({
      name: 'Person',
      items: [
        gql`
          extend type RootMutation {
            updateUser(id: String, payload: UserPayload): String
          }
        `,
        `
        extend type RootMutation {
          deleteUser(id: String, payload: UserPayload): String
        }
      `,
        new Type(gql`
          extend type Picture {
            name: string
            size: ImageSize
          }
        `),
      ],
    });
    expect(res).not.toBeUndefined();
    expect(res.name).toBe('Person');
    expect(res.items.length).toBe(3);
  });
  it('created from one graphQl', () => {
    debugger;
    const res = new Schema({
      name: 'Person',
      items: [
        gql`
          extend type RootMutation {
            updateUser(id: String, payload: UserPayload): String
          }
          extend type RootMutation {
            deleteUser(id: String, payload: UserPayload): String
          }
          type Image {
            name: string
            size: ImageSize
          }

          type Viewer {
            username: string
          }

          type RootMutation {
            login(user: String): String
          }
          type RootQuery {
            viewer(user: String): Viewer
          }
        `,
        new Schema({
          name: 'Picture',
          items: [
            new Type({
              schema: gql`
                extend type Picture {
                  name: string
                  size: ImageSize
                }
              `,
              resolver: {},
            }),
          ],
          schema: gql`
            extend type RootMutation {
              createPicture: string
            }
          `,
          resolver: {
            RootMutation: {
              createPicture: () => null,
            },
            Picture: () => null,
          },
        }),
      ],
      resolver: {
        RootMutation: {
          login: () => null,
          deleteUser: () => null,
          updateUser: () => null,
        },
        RootQuery: {
          viewer: () => null,
        },
        Viewer: () => ({
          username: 'system',
        }),
      },
    });
    expect(res).not.toBeUndefined();
    expect(res.name).toBe('Person');
    expect(res.items.length).toBe(7);
    res.build();
    debugger;
    expect(res.isBuilt).toBeTruthy();
    expect(res.resolvers).toMatchSnapshot();
  });
});
