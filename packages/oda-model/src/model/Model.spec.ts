import { Model } from './Model';
import { ModelFactory } from './../model/Factory';
import schema from '../01_test_schema/';

describe('Model', () => {
  let model: Model;

  beforeAll(() => {
    expect(() => new Model()).not.toThrow();
  });

  beforeEach(() => {
    model = new Model();
  });

  it('Model.load', () => {
    expect(() => ModelFactory.createModel(schema)).not.toThrow();
  });

  it('load serialized model', () => {
    let serialized;
    expect(() => serialized = ModelFactory.createModel(schema)).not.toThrow();
    expect(serialized).not.toBeUndefined();
    expect(serialized).toMatchSnapshot();
    expect(serialized.packages.size).toBe(3);
    expect(serialized.packages.has('system')).toBeTruthy();
    expect(serialized.toJS()).toMatchSnapshot();
  });

  it('create empty', () => {
    expect(model.name).toBeNull();
    expect(model.modelType).toBe('model');
    expect(model.description).toBeNull();
    expect(model.packages.size).toBe(1);
    expect(model.defaultPackage).not.toBeUndefined();
    expect(model.defaultPackage.toJS()).toMatchObject({
      name: 'system',
    });
  });

  it('update strings', () => {
    expect(() => model.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();

    expect(model.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });

  it('update packages', () => {
    expect(() => model.updateWith({
      packages: [],
    })).not.toThrow();
    expect(model.defaultPackage).not.toBeNull();
  });

  it('toJS with dupes', () => {
    expect(() => model.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      packages: [
        { name: 'one', acl: 100, items: [] },
        { name: 'one', acl: 100 , items: []},
      ],
    })).not.toThrow();

    expect(model.packages.size).toBe(2);

    expect(model.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      packages: [
        { name: 'system' },
        { name: 'one' },
      ],
    });
  });
});
