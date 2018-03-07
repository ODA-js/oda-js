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

  it('toJS', () => {
    expect(() => enumItem.updateWith({
      name: 'other',
      type: 'string',
      title: 'Other',
      value: 'OTHER',
      description: 'the other values',
    })).not.toThrow();

    expect(enumItem.value).not.toBeNull();
    expect(enumItem.toJS()).toMatchSnapshot();
  });
});
