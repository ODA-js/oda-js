import { FieldArg } from './FieldArg';

describe('FieldArg', () => {
  let enumItem: FieldArg;

  beforeAll(() => {
    expect(() => new FieldArg()).not.toThrow();
  });

  beforeEach(() => {
    enumItem = new FieldArg();
  });

  it('create empty', () => {
    expect(enumItem.name).toBeNull();
    expect(enumItem.modelType).toBe('fieldArg');
    expect(enumItem.description).toBeNull();
    expect(enumItem.title).toBeNull();
    expect(enumItem.defaultValue).toBeNull();
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
      defaultValue: 'OTHER',
      description: 'the other values',
    })).not.toThrow();

    expect(enumItem.defaultValue).not.toBeNull();

    expect(enumItem.toJS()).toMatchObject({
      name: 'other',
      type: 'string',
      title: 'Other',
      defaultValue: 'OTHER',
      description: 'the other values',
    });
  });
});
