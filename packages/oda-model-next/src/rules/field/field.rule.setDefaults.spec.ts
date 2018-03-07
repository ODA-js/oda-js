import { IPackagedItemInit } from '../../interfaces/IPackagedItem';
import { Entity } from '../../model/Entity';
import { Model } from '../../model/Model';
import { Package } from '../../model/Package';
import Rule from './setDefaults';

describe('rule', () => {
  let rule: Rule;

  beforeEach(() => {
    rule = new Rule();
  });

  it('fix simple field', () => {
    let update = {};
    const updateWith = jest.fn((args) => update = {
      ...update,
      ...args,
    });
    const result = rule.validate({
      entity: {
        name: 'cool entity',
      },
      field: {
        name: 'user',
        updateWith,
      },
    } as any);
    expect(result).toMatchSnapshot();
    expect(updateWith).toHaveBeenCalledTimes(4);
    expect(update).toMatchSnapshot();
  });

  it('fix indexed field', () => {
    let update = {};
    const updateWith = jest.fn((args) => update = {
      ...update,
      ...args,
    });
    const result = rule.validate({
      entity: {
        name: 'cool entity',
      },
      field: {
        name: 'user',
        indexed: true,
        updateWith,
      },
    } as any);
    expect(result).toMatchSnapshot();
    expect(updateWith).toHaveBeenCalledTimes(4);
    expect(update).toMatchSnapshot();
  });

  it('fix identity field', () => {
    let update = {};
    const updateWith = jest.fn((args) => update = {
      ...update,
      ...args,
    });
    const result = rule.validate({
      entity: {
        name: 'cool entity',
      },
      field: {
        name: 'user',
        identity: true,
        updateWith,
      },
    } as any);
    expect(result).toMatchSnapshot();
    expect(updateWith).toHaveBeenCalledTimes(5);
    expect(update).toMatchSnapshot();
  });

  it('fix derived field', () => {
    let update = {};
    const updateWith = jest.fn((args) => update = {
      ...update,
      ...args,
    });
    const result = rule.validate({
      entity: {
        name: 'cool entity',
      },
      field: {
        name: 'user',
        derived: true,
        updateWith,
      },
    } as any);
    expect(result).toMatchSnapshot();
    expect(updateWith).toHaveBeenCalledTimes(4);
    expect(update).toMatchSnapshot();
  });

  it('fix persistend-derived field', () => {
    let update = {};
    const updateWith = jest.fn((args) => update = {
      ...update,
      ...args,
    });
    const result = rule.validate({
      entity: {
        name: 'cool entity',
      },
      field: {
        name: 'user',
        derived: true,
        persistent: true,
        updateWith,
      },
    } as any);
    expect(result).toMatchSnapshot();
    expect(updateWith).toHaveBeenCalledTimes(4);
    expect(update).toMatchSnapshot();
  });

});
