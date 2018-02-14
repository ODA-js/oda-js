import { Enum } from './Enum';

describe('Enum', () => {
  let enumItem: Enum;

  beforeAll(() => {
    expect(() => new Enum()).not.toThrow();
  });

  beforeEach(() => {
    enumItem = new Enum();
  });

  it('create empty', () => {
    expect(enumItem.name).toBeNull();
    expect(enumItem.modelType).toBe('enum');
    expect(enumItem.description).toBeNull();
    expect(enumItem.title).toBeNull();
    expect(enumItem.values).toBeNull();
  });

  it('update strings', () => {
    expect(() => enumItem.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();

    expect(enumItem.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });

  it('toJS with dupes', () => {
    expect(() => enumItem.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      values: [
        { name: 'one' },
        { name: 'one' },
      ],
    })).not.toThrow();
    expect(enumItem.values.size).toBe(1);

    expect(enumItem.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      values: [
        { name: 'one' },
      ],
    });
  });

  it('toJS', () => {
    expect(() => enumItem.updateWith({
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

    expect(enumItem.values).not.toBeNull();

    expect(enumItem.toJS()).toMatchObject({
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
