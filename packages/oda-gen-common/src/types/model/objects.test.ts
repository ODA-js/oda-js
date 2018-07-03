import 'jest';
import { Enum, Query, GQLType } from './object';
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
    expect(item.type).toBe('query');
    expect(item.name).toBe('user');
  });
  it('creates Mutation', () => {
    const item = GQLType.create(gql`
      extend type RootMutation {
        updateUser(id: String, payload: UserPayload): String
      }
    `);
    expect(item.type).toBe('mutation');
    expect(item.name).toBe('updateUser');
  });
  it('creates Type', () => {
    const item = GQLType.create(gql`
      extend type Picture {
        name: string
        size: ImageSize
      }
    `);
    expect(item.type).toBe('type');
    expect(item.name).toBe('Picture');
  });
});
