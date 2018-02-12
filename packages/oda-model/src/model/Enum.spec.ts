import { Enum } from './Enum';

describe('Enum', () => {
  let field: Enum;

  beforeAll(() => {
    expect(() => new Enum()).not.toThrow();
  });

  beforeEach(() => {
    field = new Enum();
  });

  it('create empty', () => {
    expect(field.name).toBeNull();
    expect(field.modelType).toBe('enum');
    expect(field.description).toBeNull();
    expect(field.title).toBeNull();
    expect(field.values).toBeNull();
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
      values: [
        { name: 'one' },
        { name: 'one' },
      ],
    })).not.toThrow();
    expect(field.values.size).toBe(1);

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      values: [
        { name: 'one' },
      ],
    });
  });

  it('toJS', () => {
    expect(() => field.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      values: [
        { name: 'one' },
        {
          name: 'other',
          type: 'string',
          title: 'Other',
          value: 'OTHER',
          description: 'the other values',
        },
       ],
    },
    )).not.toThrow();

    expect(field.values).not.toBeNull();

    expect(field.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      values: [
        { name: 'one' },
        {
          name: 'other',
          type: 'string',
          title: 'Other',
          value: 'OTHER',
          description: 'the other values',
        },
       ],
    });
  });
});
