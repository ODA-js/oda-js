import schema from './../01_test_schema';
import { IEntityInit } from './../interfaces/IEntity';
import { IPackageInit, IPackage } from './../interfaces/IPackage';
import { IMutationInit } from './../interfaces/IMutation';
import { INamedItem, IModelType } from '../interfaces/IModelType';
import { IEnumInit } from '../interfaces/IEnum';
import { Model } from '../model/Model';
import { Entity } from '../model/Entity';
import { Mutation } from '../model/Mutation';
import { Package } from '../model/Package';
import { Enum } from '../model/Enum';
import { IPackagedItem } from '../interfaces/IPackagedItem';
import { IModel } from '../interfaces/IModel';

export interface ModelLoad extends INamedItem {
  packages: IPackageInit[];
  entities: IEntityInit[];
  mutations: IMutationInit[];
  enums: IEnumInit[];
}

function LoadSchema(input: ModelLoad) {
  const items = [
    ...input.entities.map(e => new Entity(e)),
    ...input.mutations.map(m => new Mutation(m)),
    ...input.enums.map(m => new Enum(m)),
  ];

  const result: Model = new Model({
    name: input.name,
    title: input.title,
    description: input.description,
  });

  result.defaultPackage.updateWith({
    items,
  });

  result.updateWith({
    packages: [...input.packages.map(p => {
      return {
        ...p,
      };
    })],
  });
  return result;

}

// model; init; у; пакета;


describe('Schemaloading', () => {
  let model: IModel;
  beforeAll(() => {
    model = LoadSchema(schema);
  });

  it('loadSchema', () => {
    expect(() => LoadSchema(schema)).not.toThrow();
  });

  it('has at least one package', () => {
    expect(model).not.toBeUndefined();
    expect(model).toMatchSnapshot();
    expect(model.packages.size).toBe(3);
    expect(model.packages.has('system')).toBeTruthy();
    expect(model.toJS()).toMatchSnapshot();
  });

});





