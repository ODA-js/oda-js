import 'jest';
import { Model } from './Model';
import { Mutation } from './Mutation';
import { Package } from './Package';
import { IModel } from '../interfaces/IModel';

describe('Mutaion', () => {
  let pkg: Package;

  beforeAll(() => {
    expect(() => new Package()).not.toThrow();
  });

  beforeEach(() => {
    pkg = new Package();
  });

  it('throws items without model', () => {
    expect(
      () =>
        new Package({
          items: []
        })
    ).toThrow();

    expect(
      () =>
        new Package({
          name: 'cool package'
        })
    ).not.toThrow();

    expect(() => new Package()).not.toThrow();
  });

  it('create empty', () => {
    expect(pkg).toMatchSnapshot();
    expect(pkg.toJS()).toMatchSnapshot();
  });

  it('update strings', () => {
    expect(() =>
      pkg.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title',
        acl: 100,
        abstract: true
      })
    ).not.toThrow();
    expect(pkg.toJS()).toMatchSnapshot();
    expect(() =>
      pkg.updateWith({
        abstract: false
      })
    ).not.toThrow();
    expect(pkg.toJS()).toMatchSnapshot();
  });

  it('updates with null or undefined', () => {
    expect(() =>
      pkg.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title'
      })
    ).not.toThrow();
    expect(pkg.toJS()).toMatchSnapshot();
    expect(() =>
      pkg.updateWith({
        description: null,
        title: undefined
      })
    ).not.toThrow();
    expect(pkg.toJS()).toMatchSnapshot();
  });

  it('update items', () => {
    expect(() =>
      pkg.updateWith({
        items: []
      })
    ).not.toThrow();
    expect(pkg.toJS()).toMatchSnapshot();
    expect(() =>
      pkg.updateWith({
        items: [
          new Mutation({
            name: '1'
          })
        ]
      })
    ).not.toThrow();

    expect(pkg.toJS()).toMatchSnapshot();
  });

  it('toJS with dupes', () => {
    expect(() =>
      pkg.updateWith({
        name: 'cool',
        description: 'very cool',
        title: 'very cool title',
        acl: 100,
        abstract: false,
        items: [new Mutation({ name: 'one' }), new Mutation({ name: 'one' })]
      })
    ).not.toThrow();

    expect(pkg.toJS()).toMatchSnapshot();
  });
});
