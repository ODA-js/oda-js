import { Package } from './Package';
import { Mutation } from './Mutation';
import { Entity } from './Entity';
import { Model } from './Model';
import { Map, Set } from 'immutable';
import { IPackagedItem } from '../interfaces/IPackagedItem';
import { deepEqual } from 'assert';
import { IPackageInit } from '../interfaces/IPackage';
import { Field } from './Field';

describe('Entity', () => {
  let entity: Entity;

  beforeAll(() => {
    expect(() => new Entity()).not.toThrow();
  });

  beforeEach(() => {
    entity = new Entity();
  });

  it('create empty', () => {
    expect(entity.name).toBeNull();
    expect(entity.modelType).toBe('entity');
    expect(entity.description).toBeNull();
    expect(entity.fields).toBeNull();
    expect(entity.acl).toBeNull();
    expect(entity.indexed).toBeNull();
    expect(entity.package).toBeNull();
    expect(entity.plural).toBeNull();
    expect(entity.relations).toBeNull();
    expect(entity.required).toBeNull();
    expect(entity.singular).toBeNull();
  });

  it('update strings', () => {
    expect(() => entity.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();

    expect(entity.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    });
  });

  it('toJS with dupes 1', () => {
    expect(() => entity.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      fields: [
        { name: 'one' },
        { name: 'one' },
      ],
    })).not.toThrow();

    expect(entity.fields.size).toBe(1);

    expect(entity.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      fields: [
        { name: 'one' },
      ],
    });
  });

  it('toJS with dupes 2', () => {
    expect(() => entity.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      fields: {
        one: { type: 'string' },
        two: {},
      },
    },
    )).not.toThrow();

    expect(entity.fields.size).toBe(2);

    expect(entity.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      fields: [
        { name: 'one' , type: 'string'},
        { name: 'two'},
      ],
    });
  });
});
