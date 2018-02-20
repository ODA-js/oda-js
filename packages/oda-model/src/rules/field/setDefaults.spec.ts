import Rule from './setDefaults';
import { Field } from '../../model/Field';
import { Entity } from '../../model/Entity';

describe('setDefaults', () => {
  let rule: Rule;
  beforeAll(() => {
    rule = new Rule();
  });

  it('fix simple field', () => {
    const entity = new Entity({
      name: 'cool entity',
      fields: [{
        name: 'user',
      }],
    });
    const field = entity.fields.get('user');
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      entity: entity,
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix indexed field', () => {
    const entity = new Entity({
      name: 'cool entity',
      fields: [{
        name: 'user',
        indexed: true,
      }],
    });
    const field = entity.fields.get('user');
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      entity: entity,
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix identity field', () => {
    const entity = new Entity({
      name: 'cool entity',
      fields: [{
        name: 'user',
        identity: true,
      }],
    });
    const field = entity.fields.get('user');
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      entity: entity,
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix derived field', () => {
    const entity = new Entity({
      name: 'cool entity',
      fields: [{
        name: 'user',
        derived: true,
      }],
    });
    const field = entity.fields.get('user');
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      entity: entity,
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

  it('fix persistend-derived field', () => {
    const entity = new Entity({
      name: 'cool entity',
      fields: [{
        name: 'user',
        derived: true,
        persistent: true,
      }],
    });
    const field = entity.fields.get('user');
    expect(field).toMatchSnapshot();
    const result = rule.validate({
      entity: entity,
      field: field,
    } as any);
    expect(result).toMatchSnapshot();
    expect(field).toMatchSnapshot();
  });

});
