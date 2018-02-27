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
    expect(() =>
      new Package({
        items: [],
      }),
    ).toThrow();

    expect(() =>
      new Package({
        name: 'cool package',
      }),
    ).not.toThrow();

    expect(() =>
      new Package(),
    ).not.toThrow();


  });

  it('create empty', () => {
    expect(pkg.modelType).toBe('package');
    expect(pkg.name).toBeNull();
    expect(pkg.acl).toBeNull();
    expect(pkg.description).toBeNull();
    expect(pkg.title).toBeNull();
    expect(pkg.abstract).toBeNull();
    expect(pkg.items).toBeNull();
    expect(pkg.context).toBeUndefined();
  });

  it('update strings', () => {
    expect(() => pkg.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      acl: 100,
      abstract: true,
    })).not.toThrow();
    expect(pkg.name).toBe('cool');
    expect(pkg.description).toBe('very cool');
    expect(pkg.title).toBe('very cool title');
    expect(pkg.abstract).toBe(true);
    expect(pkg.acl).toBe(100);
    expect(() => pkg.updateWith({
      abstract: false,
    })).not.toThrow();
    expect(pkg.abstract).toBe(false);
  });

  it('update items', () => {
    expect(() => pkg.updateWith({
      items: [],
    })).not.toThrow();
    expect(pkg.items).not.toBeNull();
    expect(pkg.items.size).toBe(0);

    expect(() => pkg.updateWith({
      items: [
        new Mutation({
          name: '1',
        }),
      ],
    })).not.toThrow();

    let mutation;
    expect(pkg.items.has('1'));
    expect(() => mutation = pkg.items.get('1')).not.toThrow();
    expect(pkg.items).not.toBeNull();
    expect(pkg.items.size).toBe(1);

    expect(() => mutation = pkg.items.get('1')).not.toThrow();
  });

  it('toJS with dupes', () => {
    expect(() => pkg.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      acl: 100,
      abstract: false,
      items: [
        new Mutation({ name: 'one' }),
        new Mutation({ name: 'one' }),
      ],
    })).not.toThrow();

    expect(pkg.items.size).toBe(1);
    expect(pkg.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      acl: 100,
      abstract: false,
      items: [
        { name: 'one' },
      ],
    });
  });
});
