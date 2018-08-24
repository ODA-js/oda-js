import 'jest';
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
    expect(enumItem).toMatchSnapshot();
    expect(enumItem.toJS()).toMatchSnapshot();
  });

  it('update strings', () => {
    expect(() =>
      enumItem.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();

    expect(enumItem.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title'
    });
  });

  it('updates with null or undefined', () => {
    expect(() =>
      enumItem.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(enumItem.toJS()).toMatchSnapshot();
    expect(() =>
      enumItem.updateWith({
        description: null,
        title: undefined
      })
    ).not.toThrow();
    expect(enumItem.toJS()).toMatchSnapshot();
  });

  it('toJS', () => {
    expect(() =>
      enumItem.updateWith({
        name: 'other',
        type: 'string',
        title: 'Other',
        defaultValue: 'OTHER',
        description: 'the other values'
      })
    ).not.toThrow();

    expect(enumItem.defaultValue).not.toBeNull();

    expect(enumItem.toJS()).toMatchSnapshot();
  });
});
