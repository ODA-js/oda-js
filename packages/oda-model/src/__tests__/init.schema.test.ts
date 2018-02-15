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

  const result: IModel = new Model({
    name: input.name,
    title: input.title,
    description: input.description,
  });

  result.defaultPackage.updateWith({
    items,
  });

  return result;

}

describe('Schemaloading', () => {
  let model: IModel;
  beforeAll(() => {
    expect(() => model = LoadSchema(schema)).not.toThrow();

  });

  it('has at least one package', () => {
    expect(model).toMatchSnapshot();
    expect(model.packages.size).toBe(1);
    debugger;
    expect(model.packages.has('system')).toBeTruthy();
    expect(model.toJS()).toMatchSnapshot();
  });

});





