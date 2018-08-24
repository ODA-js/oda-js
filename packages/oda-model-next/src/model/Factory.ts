import { IModel, IModelLoad } from '../interfaces/IModel';
import { Entity } from './Entity';
import { Enum } from './Enum';
import { Model } from './Model';
import { Mutation } from './Mutation';
import {
  RuntimeContext,
  RuntimeEntityContext,
  RuntimeModelContext,
  RuntimeMutationContext,
  RuntimeEnumContext,
  RuntimePackageContext
} from './RuntimeContexts';
import { IEnumInit, IEnum } from '../interfaces/IEnum';
import { IEntity } from '../interfaces/IEntity';
import { IContext } from '../contexts/IContext';
import { IPackageContext } from '../contexts/IPackageContext';
import { IMutationInit, IMutation } from '../interfaces/IMutation';
import { IFieldContext } from '../contexts/IFieldContext';
import { IModelContext } from '../contexts/IModelContext';
import { IPackageInit, IPackage } from '../interfaces/IPackage';
import { Package } from './Package';
import { Map } from 'immutable';
import { Persistent } from './Persistent';
import { IModelType } from '../interfaces/IModelType';
import { IModelHook } from '../interfaces/IModelHook';
import { isModel, isEntity, isPackage, isMutation, isEnum } from '../helpers';
import fold from '../lib/json/fold';

export class ModelFactory {
  private static context = Map<IModelType, IContext>();
  public static registerContext(item?: IModelType): IContext {
    if (item) {
      if (ModelFactory.context.has(item)) {
        return ModelFactory.context.get(item);
      } else {
        if (isModel(item)) {
          const ctx = new RuntimeModelContext({
            ...item.context,
            model: item
          });
          ModelFactory.context = ModelFactory.context.set(item, ctx);
          return ctx;
        } else if (isPackage(item)) {
          const ctx = new RuntimePackageContext({
            ...item.context,
            package: item
          });
          ModelFactory.context = ModelFactory.context.set(item, ctx);
          return ctx;
        } else if (isEntity(item)) {
          const ctx = new RuntimeEntityContext({
            ...item.context,
            entity: item
          });
          ModelFactory.context = ModelFactory.context.set(item, ctx);
          return ctx;
        } else if (isMutation(item)) {
          const ctx = new RuntimeMutationContext({
            ...item.context,
            mutation: item
          });
          ModelFactory.context = ModelFactory.context.set(item, ctx);
          return ctx;
        } else if (isEnum(item)) {
          const ctx = new RuntimeEnumContext({
            ...item.context,
            enum: item
          });
          ModelFactory.context = ModelFactory.context.set(item, ctx);
          return ctx;
        }
      }
    }
  }

  public static getContext(item: IModelType): IContext {
    if (ModelFactory.context.has(item)) {
      return ModelFactory.context.get(item);
    } else {
      return ModelFactory.registerContext(item);
    }
  }

  public static createModel(input: IModelLoad, hooks?: IModelHook): IModel {
    const result: Model = new Model({
      name: input.name,
      title: input.title,
      description: input.description
    });

    const context = ModelFactory.registerContext(
      result.defaultPackage
    ) as IPackageContext;

    result.defaultPackage.updateWith({
      items: [
        ...input.entities.map(e => new Entity(e, context)),
        ...input.mutations.map(m => new Mutation(m, context)),
        ...input.enums.map(m => new Enum(m, context))
      ]
    });

    result.updateWith({
      packages: [...input.packages]
    });

    return result;
    // возвращать пару, значение и соотвествующий контекст.
  }

  public static createPackage(input: IPackageInit, model: IModel): IPackage {
    let result: IPackage;
    model.updateWith({ packages: [input] });
    result = model.packages.get(input.name);
    ModelFactory.registerContext(result);
    result.attach(ModelFactory.getContext(model) as IModelContext);
    return result;
  }

  public static createEntity(input: IEnumInit, ctx: IPackageContext): IEntity {
    const result = new Entity(input, ctx);
    result.attach(ctx);
    return result;
  }

  public static createMutation(
    input: IMutationInit,
    ctx: IPackageContext
  ): IMutation {
    const result = new Mutation(input, ctx);
    result.attach(ctx);
    return result;
  }

  public static createEnum(input: IEnumInit, ctx: IPackageContext): IEnum {
    const result = new Enum(input, ctx);
    result.attach(ctx);
    return result;
  }
}
