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
    expect(enumItem).toMatchSnapshot();
    expect(enumItem.toJS()).toMatchSnapshot();
  });

  it('update strings', () => {
    expect(() => enumItem.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();

    expect(enumItem.toJS()).toMatchSnapshot();
  });

  it('updates with null or undefined', () => {
    expect(() => enumItem.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(enumItem.toJS()).toMatchSnapshot();
    expect(() => enumItem.updateWith({
      description: null,
      title: undefined,
    })).not.toThrow();
    expect(enumItem.toJS()).toMatchSnapshot();
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

    expect(enumItem.toJS()).toMatchSnapshot();
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
    expect(enumItem.toJS()).toMatchSnapshot();
  });
});
