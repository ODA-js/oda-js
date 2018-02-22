import { Mutation } from './Mutation';
import { Package } from './Package';

describe('Mutaion', () => {
  let mutation: Mutation;

  beforeAll(() => {
    expect(() => new Mutation()).not.toThrow();
  });

  beforeEach(() => {
    mutation = new Mutation();
  });

  it('create empty', () => {
    expect(mutation.modelType).toBe('mutation');
    expect(mutation.context).toBeUndefined();
    expect(mutation.name).toBeNull();
    expect(mutation.acl).not.toBeNull();
    expect(mutation.description).toBeNull();
    expect(mutation.title).toBeNull();
    expect(mutation.args).not.toBeNull();
    expect(mutation.payload).not.toBeNull();
  });

  it('updates strings', () => {
    expect(() => mutation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(mutation.name).toBe('cool');
    expect(mutation.description).toBe('very cool');
    expect(mutation.title).toBe('very cool title');
    expect(() => mutation.updateWith({
      name: 'cool!',
    })).not.toThrow();
    expect(mutation.name).toBe('cool!');
  });

  it('updates acl', () => {
    expect(() => mutation.updateWith({
      acl: {
        execute: ['admin', 'public', 'public'],
      },
    })).not.toThrow();
    expect(mutation.acl).not.toBeNull();
    expect(mutation.acl.execute).not.toBeNull();
    expect(mutation.acl.execute.size).toBe(2);
    expect(mutation.acl.execute.has('admin'));
    expect(mutation.acl.execute.has('public'));
    expect(() => mutation.updateWith({
      acl: {
        execute: ['system'],
      },
    })).not.toThrow();
    expect(mutation.acl).not.toBeNull();
    expect(mutation.acl.execute).not.toBeNull();
    expect(mutation.acl.execute.size).toBe(3);
    expect(mutation.acl.execute.has('system'));
  });

  it('updates input args', () => {
    expect(() => mutation.updateWith({
      args: [],
    })).not.toThrow();
    expect(mutation.args).not.toBeNull();
    expect(mutation.args.size).toBe(0);

    expect(() => mutation.updateWith({
      args: [
        { name: '1', type: 'string', defaultValue: 'not empty', required: true }],
    })).not.toThrow();
    let arg;
    expect(mutation.args.has('1'));
    expect(() => arg = mutation.args.get('1')).not.toThrow();
    expect(mutation.args).not.toBeNull();
    expect(mutation.args.size).toBe(1);

    expect(arg.toJS()).toMatchObject({
      name: '1',
      type: 'string',
      defaultValue: 'not empty',
      required: true,
    });

    expect(() => mutation.updateWith({
      args: [
        { name: '1', type: 'number' }]
      ,
    })).not.toThrow();
    expect(() => arg = mutation.args.get('1')).not.toThrow();
    expect(mutation.args).not.toBeNull();
    expect(mutation.args.size).toBe(1);
    expect(arg.toJS()).toMatchObject({
      name: '1',
      type: 'number',
    });
  });

  it('updates payload', () => {
    expect(() => mutation.updateWith({
      payload: [],
    })).not.toThrow();
    expect(mutation.payload).not.toBeNull();
    expect(mutation.payload.size).toBe(0);

    expect(() => mutation.updateWith({
      payload: [
        { name: '1', type: 'string', defaultValue: 'not empty', required: true }],
    })).not.toThrow();
    let arg;
    expect(mutation.payload.has('1'));
    expect(() => arg = mutation.payload.get('1')).not.toThrow();
    expect(mutation.payload).not.toBeNull();
    expect(mutation.payload.size).toBe(1);

    expect(arg.toJS()).toMatchObject({
      name: '1',
      type: 'string',
      defaultValue: 'not empty',
      required: true,
    });

    expect(() => mutation.updateWith({
      payload: [
        { name: '1', type: 'number' }]
      ,
    })).not.toThrow();
    expect(() => arg = mutation.payload.get('1')).not.toThrow();
    expect(mutation.payload).not.toBeNull();
    expect(mutation.payload.size).toBe(1);
    expect(arg.toJS()).toMatchObject({
      name: '1',
      type: 'number',
    });
  });

  it('toJS with dupes', () => {
    expect(() => mutation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      acl: {
        execute: ['admin', 'public', 'public'],
      },
      args: [
        { name: 'i1', type: 'number', defaultValue: '100', required: true },
        { name: 'i1', type: 'string', defaultValue: 'not empty', required: true },
        { name: 'i2', type: 'number', defaultValue: '1', required: false },
      ],
      payload: [
        { name: 'p1', type: 'string', defaultValue: 'not empty', required: true },
        { name: 'p1', type: 'number', defaultValue: '10', required: true },
        { name: 'p2', type: 'number', defaultValue: '1', required: false },
      ],
    })).not.toThrow();

    expect(mutation.toJS()).toMatchObject({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
      acl: {
        execute: ['admin', 'public'],
      },
      args: [
        { name: 'i1', type: 'string', defaultValue: 'not empty', required: true },
        { name: 'i2', type: 'number', defaultValue: '1', required: false },
      ],
      payload: [
        { name: 'p1', type: 'number', defaultValue: '10', required: true },
        { name: 'p2', type: 'number', defaultValue: '1', required: false },
      ],
    });
  });

});
