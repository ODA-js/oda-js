import { EnumItem } from './EnumItem';

describe('EnumItem', () => {
  let enumItem: EnumItem;

  beforeAll(() => {
    expect(() => new EnumItem()).not.toThrow();
  });

  beforeEach(() => {
    enumItem = new EnumItem();
  });

  it('create empty', () => {
    expect(enumItem.name).toBeNull();
    expect(enumItem.modelType).toBe('enumItem');
    expect(enumItem.description).toBeNull();
    expect(enumItem.title).toBeNull();
    expect(enumItem.value).toBeNull();
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

  it('toJS', () => {
    expect(() => enumItem.updateWith({
      name: 'other',
      type: 'string',
      title: 'Other',
      value: 'OTHER',
      description: 'the other values',
    })).not.toThrow();

    expect(enumItem.value).not.toBeNull();

    expect(enumItem.toJS()).toMatchObject({
      name: 'other',
      type: 'string',
      title: 'Other',
      value: 'OTHER',
      description: 'the other values',
    });
  });
});
