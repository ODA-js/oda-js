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
    expect(mutation).toMatchSnapshot();
    expect(mutation.toJS()).toMatchSnapshot();
  });

  it('updates strings', () => {
    expect(() => mutation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();
    expect(() => mutation.updateWith({
      name: 'cool!',
    })).not.toThrow();
    expect(mutation.name).toBe('cool!');
    expect(mutation.toJS()).toMatchSnapshot();
  });

  it('updates with null or undefined', () => {
    expect(() => mutation.updateWith({
      name: 'cool',
      description: 'very cool',
      title: 'very cool title',
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();
    expect(() => mutation.updateWith({
      description: null,
      title: undefined,
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();
  });

  it('updates acl', () => {
    expect(() => mutation.updateWith({
      acl: {
        execute: ['admin', 'public', 'public'],
      },
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();

    expect(() => mutation.updateWith({
      acl: {
        execute: ['system'],
      },
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();
  });

  it('updates input args', () => {
    expect(() => mutation.updateWith({
      args: [],
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();

    expect(() => mutation.updateWith({
      args: [
        { name: '1', type: 'string', defaultValue: 'not empty', required: true }],
    })).not.toThrow();
    let arg;
    expect(() => arg = mutation.args.get('1')).not.toThrow();
    expect(arg.toJS()).toMatchSnapshot();

    expect(() => mutation.updateWith({
      args: [
        { name: '1', type: 'number' }]
      ,
    })).not.toThrow();
    expect(() => arg = mutation.args.get('1')).not.toThrow();
    expect(arg.toJS()).toMatchSnapshot();
  });

  it('updates payload', () => {
    expect(() => mutation.updateWith({
      payload: [],
    })).not.toThrow();
    expect(mutation.toJS()).toMatchSnapshot();

    expect(() => mutation.updateWith({
      payload: [
        { name: '1', type: 'string', defaultValue: 'not empty', required: true }],
    })).not.toThrow();
    let arg;
    expect(mutation.payload.has('1'));
    expect(() => arg = mutation.payload.get('1')).not.toThrow();

    expect(arg.toJS()).toMatchSnapshot();
    expect(() => mutation.updateWith({
      payload: [
        { name: '1', type: 'number' }]
      ,
    })).not.toThrow();
    expect(() => arg = mutation.payload.get('1')).not.toThrow();
    expect(arg.toJS()).toMatchSnapshot();
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
    expect(mutation.toJS()).toMatchSnapshot();
  });

});
