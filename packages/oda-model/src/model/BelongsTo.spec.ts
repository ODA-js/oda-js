import { BelongsTo } from './BelongsTo';

describe('BelongsTo', () => {
  let relation: BelongsTo;

  beforeAll(() => {
    expect(() => new BelongsTo()).not.toThrow();
  });

  beforeEach(() => {
    relation = new BelongsTo();
  });

  it('create empty', () => {
    expect(relation).toMatchSnapshot();
    expect(relation.toJS()).toMatchSnapshot();
  });

  it('updates strings', () => {
    expect(() => relation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(relation).toMatchSnapshot();
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
    expect(relation.toJS()).toMatchSnapshot();
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
      belongsTo: 'id@Some#id',
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
      belongsTo: 'id@Some#id',
    });
  });
});
