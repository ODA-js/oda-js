import 'jest';
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
    expect(() => (serialized = ModelFactory.createModel(schema))).not.toThrow();
    expect(serialized.toJS()).toMatchSnapshot();
  });

  it('create empty', () => {
    expect(model).toMatchSnapshot();
    expect(model.toJS()).toMatchSnapshot();
  });

  it('update strings', () => {
    expect(() =>
      model.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();

    expect(model.toJS()).toMatchSnapshot();
  });

  it('updates with null or undefined', () => {
    expect(() =>
      model.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(model.toJS()).toMatchSnapshot();
    expect(() =>
      model.updateWith({
        description: null,
        title: undefined
      })
    ).not.toThrow();
    expect(model.toJS()).toMatchSnapshot();
  });

  it('update packages', () => {
    expect(() =>
      model.updateWith({
        packages: []
      })
    ).not.toThrow();
    expect(model.toJS()).toMatchSnapshot();
  });

  it('toJS with dupes', () => {
    expect(() =>
      model.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title',
        packages: [
          { name: 'one', acl: 100, items: [] },
          { name: 'one', acl: 100, items: [] }
        ]
      })
    ).not.toThrow();

    expect(model.toJS()).toMatchSnapshot();
  });
});
