import { Field } from './Field';

describe('Field', () => {
  let field: Field;

  beforeAll(() => {
    expect(() => new Field()).not.toThrow();
  });

  beforeEach(() => {
    field = new Field();
  });

  it('create empty', () => {
    expect(field.name).toBeNull();
    expect(field.modelType).toBe('field');
    expect(field.description).toBeNull();
    expect(field.title).toBeNull();
    expect(field.args).toBeNull();
    expect(field.derived).toBeNull();
    expect(field.persistent).toBeNull();
    expect(field.order).toBeNull();
    expect(field.required).toBeNull();
    expect(field.indexed).toBeNull();
    expect(field.identity).toBeNull();
    expect(field.idKey).toBeNull();
    expect(field.entity).toBeNull();
    expect(field.relation).toBeNull();
  });

  it('update strings', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });

  it('toJS with dupes', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      args: [
        { name: 'one' },
        { name: 'one' },
      ],
    })).not.toThrow();

    expect(field.args.size).toBe(1);

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      args: [
        { name: 'one' },
      ],
    });
  });

  it('toJS with relations hasMany', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      relation: {
        hasMany: 'id@some#id',
      },
    },
    )).not.toThrow();

    expect(field.relation).not.toBeNull();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });

  it('toJS with relations hasOne', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      relation: {
        hasOne: 'id@some#id',
      },
    },
    )).not.toThrow();

    expect(field.relation).not.toBeNull();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });
  it('toJS with relations belongsTo', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      relation: {
        belongsTo: 'id@some#id',
      },
    },
    )).not.toThrow();

    expect(field.relation).not.toBeNull();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });
  it('toJS with relations belongsToMany', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      relation: {
        belongsToMany: 'id@some#id',
       using: 'Some@at#this',
      },
    },
    )).not.toThrow();

    expect(field.relation).not.toBeNull();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });
});
