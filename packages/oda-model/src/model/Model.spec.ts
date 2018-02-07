import { Package } from './Package';
import { Mutation } from './Mutation';
import { Model } from './Model';
import { Map, Set } from 'immutable';
import { IPackagedItem } from '../interfaces/IPackagedItem';
import { deepEqual } from 'assert';
import { IPackageInit } from '../interfaces/IPackage';

describe('Model', () => {
  let model: Model;

  beforeAll(() => {
    expect(() => new Model()).not.toThrow();
  });

  beforeEach(() => {
    model = new Model();
  });

  it('create empty', () => {
    expect(model.name).toBeNull();
    expect(model.modelType).toBe('model');
    expect(model.description).toBeNull();
    expect(model.packages).toBeNull();
    expect(model.defaultPackage).not.toBeNull();
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
        new Package({ name: 'one' }),
        new Package({ name: 'one' }),
      ],
    })).not.toThrow();

    expect(model.packages.size).toBe(1);

    expect(model.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      packages: [
        { name: 'one' },
      ],
    });
  });
});