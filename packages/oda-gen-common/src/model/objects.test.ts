import 'jest';
import { Enum, Query, GQLType, Schema, Type } from '.';
import gql from 'graphql-tag';

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
    expect(item[0].isExtend).toBeTruthy();
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
          schema {
            query: RootQuery
            mutation: RootMutation
          }
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

          extend type RootMutation {
            login(user: String): String
          }
          extend type RootQuery {
            viewer(user: String): Viewer
          }
        `,
        new Schema({
          name: 'Picture',
          items: [
            new Type({
              schema: gql`
                type Picture {
                  name: string
                  size: ImageSize
                }
              `,
              resolver: {
                size: () => null,
              },
            }),
          ],
          schema: gql`
            extend type RootMutation {
              createPicture: string
            }
            extend type Picture {
              isJPG: ImageSize
            }
          `,
          resolver: {
            RootMutation: {
              createPicture: () => null,
            },
            Picture: {
              isJPG: () => true,
            },
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
    expect(res.isBuilt).toBeTruthy();
    expect(res.resolvers).toMatchSnapshot();
    expect(res.schema).toMatchSnapshot();
    expect(res.schemaAST).toMatchSnapshot();
  });
});

describe('Merge', () => {
  it('throws when too many types', () => {
    expect(
      () =>
        new Type({
          schema: gql`
            directive @example on FIELD_DEFINITION | ARGUMENT_DEFINITION
            type Picture implements Node {
              name: string @example
              size(name: String @example): ImageSize
            }
          `,
          resolver: {
            size: () => null,
          },
        }),
    ).toThrow();
  });

  it('merge-schema', () => {
    debugger;
    const res = new Schema({
      name: 'Person',
      items: [
        gql`
          schema {
            query: RootQuery
            mutation: RootMutation
          }
          directive @example on FIELD
          interface Node {
            id: ID!
          }
          extend type RootMutation {
            updateUser(id: String, payload: UserPayload): String
          }
          extend type RootMutation {
            deleteUser(id: String, payload: UserPayload): String
          }
          union Images = Image
          type Image implements Node {
            name: string
            size: ImageSize
          }

          type Viewer {
            username: string
          }

          extend type RootMutation {
            login(user: String): String
          }
          extend type RootQuery {
            viewer(user: String): Viewer
          }
        `,
        new Schema({
          name: 'Picture',
          items: [
            new Type({
              schema: gql`
                type Picture implements Node {
                  name: string @example
                  size(name: String @example): ImageSize
                }
              `,
              resolver: {
                size: () => null,
              },
            }),
          ],
          schema: gql`
            directive @example on FIELD_DEFINITION | ARGUMENT_DEFINITION
            union Images = Picture
            schema {
              mutation: RootMutation
            }
            type Viewer {
              username(short: Boolean): string
            }
            extend type RootMutation {
              createPicture: string
            }
            interface INode {
              id: ID!
            }
            extend type Picture implements INode {
              isJPG: ImageSize
            }
          `,
          resolver: {
            RootMutation: {
              createPicture: () => null,
            },
            Picture: {
              isJPG: () => true,
            },
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
    res.build();
    debugger;
    expect(res.schema).toMatchSnapshot();
  });
});
