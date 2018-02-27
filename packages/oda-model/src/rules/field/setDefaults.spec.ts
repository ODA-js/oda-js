import Rule from './setDefaults';
import { Field } from '../../model/Field';
import { Entity } from '../../model/Entity';
import { IRelation } from '../../interfaces/IRelation';
import { IField } from '../../interfaces/IField';
import { IModel } from '../../interfaces/IModel';
import { IEntity } from '../../interfaces/IEntity';
import { IPackage } from '../../interfaces/IPackage';
import { Model } from '../../model/Model';
import { IPackagedItemInit } from '../../interfaces/IPackagedItem';
import { Package } from '../../model/Package';

describe('setDefaults', () => {
  let rule: Rule;

  const models: {
    model: Model,
    package: Package,
  } = {} as any;

  beforeEach(() => {
    rule = new Rule();
    expect(() => models.model = new Model({
      name: 'TodoItems',
    })).not.toThrow();
    models.package = models.model.packages.get('system') as Package;
  });

  it('fix simple field', () => {
    models.package.updateWith({
      items: [{
          name: 'cool entity',
          fields: [{
            name: 'user',
          }],
        } as IPackagedItemInit],
    });
    const entity = models.package.items.get('cool entity') as Entity;
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
    models.package.updateWith({
      items: [{
          name: 'cool entity',
          fields: [{
            name: 'user',
            indexed: true,
          }],
        } as IPackagedItemInit],
    });
    const entity = models.package.items.get('cool entity') as Entity;
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
    models.package.updateWith({
      items: [{
          name: 'cool entity',
          fields: [{
            name: 'user',
            identity: true,
          }],
        } as IPackagedItemInit],
    });
    const entity = models.package.items.get('cool entity') as Entity;
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
    models.package.updateWith({
      items: [{
          name: 'cool entity',
          fields: [{
            name: 'user',
            derived: true,
          }],
        } as IPackagedItemInit],
    });
    const entity = models.package.items.get('cool entity') as Entity;
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
    models.package.updateWith({
      items: [{
          name: 'cool entity',
          fields: [{
            name: 'user',
            derived: true,
            persistent: true,
          }],
        } as IPackagedItemInit],
    });
    const entity = models.package.items.get('cool entity') as Entity;
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
