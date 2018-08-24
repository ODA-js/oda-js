import 'jest';
import { Entity } from './Entity';

describe('Entity', () => {
  let entity: Entity;

  beforeAll(() => {
    expect(() => new Entity()).not.toThrow();
  });

  beforeEach(() => {
    entity = new Entity();
  });

  it('create empty', () => {
    expect(entity).toMatchSnapshot();
    expect(entity.toJS()).toMatchSnapshot();
  });

  it('update strings', () => {
    expect(() =>
      entity.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();

    expect(entity.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title'
    });
  });

  it('updates with null or undefined', () => {
    expect(() =>
      entity.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(entity.toJS()).toMatchSnapshot();
    expect(() =>
      entity.updateWith({
        description: null,
        title: undefined
      })
    ).not.toThrow();
    expect(entity.toJS()).toMatchSnapshot();
  });

  it('toJS with dupes 1', () => {
    expect(() =>
      entity.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title',
        fields: [{ name: 'one' }, { name: 'one' }]
      })
    ).not.toThrow();

    expect(entity.toJS()).toMatchSnapshot();
  });

  it('toJS with HashMap', () => {
    expect(() =>
      entity.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title',
        fields: {
          one: { type: 'string' },
          two: {}
        }
      })
    ).not.toThrow();

    expect(entity.toJS()).toMatchSnapshot();
  });
});
