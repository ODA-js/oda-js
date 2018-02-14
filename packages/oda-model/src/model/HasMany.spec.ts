import { HasMany } from './HasMany';

describe('HasMany', () => {
  let relation: HasMany;

  beforeAll(() => {
    expect(() => new HasMany()).not.toThrow();
  });

  beforeEach(() => {
    relation = new HasMany();
  });

  it('create empty', () => {
    expect(relation.modelType).toBe('relation');
    expect(relation.verb).toBe('HasMany');
    expect(relation.title).toBeNull();
    expect(relation.name).toBeNull();
    expect(relation.description).toBeNull();
    expect(relation.fields).toBeNull();
    expect(relation.fullName).toBeNull();
    expect(relation.shortName).toBeNull();
    expect(relation.normalName).toBeNull();
    expect(relation.opposite).toBeNull();
    expect(relation.embedded).toBeFalsy();
    expect(relation.single).toBeFalsy();
    expect(relation.stored).toBeFalsy();
    expect(relation.ref).toBeNull();
    expect(relation.hasMany).toBeNull();
  });

  it('updates strings', () => {
    expect(() => relation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(relation.name).toBe('cool');
    expect(relation.description).toBe('very cool');
    expect(relation.title).toBe('very cool title');
    expect(() => relation.updateWith({
      name: 'cool!',
    })).not.toThrow();
    expect(relation.name).toBe('cool!');
  });
  it('toJS with dupes', () => {
    expect(() => relation.updateWith({
      fields: [
        { name: 'one' },
        { name: 'one' },
      ],
    },
    )).not.toThrow();

    expect(relation.ref).toBeNull();
    expect(relation.fields.size).toBe(1);
    expect(relation.toJS()).toMatchObject({
      fields: [
        { name: 'one' },
      ],
    });
  });

  it('toJS with HashMap', () => {
    expect(() => relation.updateWith({
      fields: {
        one: {},
      },
    },
    )).not.toThrow();

    expect(relation.ref).toBeNull();
    expect(relation.fields.size).toBe(1);
    expect(relation.toJS()).toMatchObject({
      fields: [
        { name: 'one' },
      ],
    });
  });
  it('toJS ', () => {
    expect(() => relation.updateWith({
      hasMany: 'id@Some#id',
    },
    )).not.toThrow();

    expect(relation.ref).not.toBeNull();
    expect(relation.ref.backField).toBe('id');
    expect(relation.ref.entity).toBe('Some');
    expect(relation.ref.field).toBe('id');

    expect(relation.ref.toJS()).toMatchObject({
      entity: 'Some',
      backField: 'id',
      field: 'id',
    });

    expect(relation.toJS()).toMatchObject({
      hasMany: 'id@Some#id',
    });
  });
});