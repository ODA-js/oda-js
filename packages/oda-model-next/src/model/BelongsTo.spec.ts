import 'jest';
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
    expect(() =>
      relation.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(relation.toJS()).toMatchSnapshot();
  });

  it('updates with null or undefined', () => {
    expect(() =>
      relation.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(relation.toJS()).toMatchSnapshot();
    expect(() =>
      relation.updateWith({
        description: null,
        title: undefined
      })
    ).not.toThrow();
    expect(relation.toJS()).toMatchSnapshot();
  });

  it('toJS with dupes', () => {
    expect(() =>
      relation.updateWith({
        fields: [{ name: 'one' }, { name: 'one' }]
      })
    ).not.toThrow();
    expect(relation.toJS()).toMatchSnapshot();
  });

  it('toJS with HashMap', () => {
    expect(() =>
      relation.updateWith({
        fields: {
          one: {}
        }
      })
    ).not.toThrow();

    expect(relation.toJS()).toMatchSnapshot();
  });

  it('toJS ', () => {
    expect(() =>
      relation.updateWith({
        belongsTo: 'id@Some#id'
      })
    ).not.toThrow();
    expect(relation.ref.toJS()).toMatchSnapshot();
    expect(relation.toJS()).toMatchSnapshot();
  });
});
