import { ModelVisitor, PackageVisitor, EntityVisitor, RelationVisitor, FieldVisitor } from './visitors';
import {
  IModel,
  IModelType,
  IPackage,
  isEntity,
  isField,
  isModel,
  isPackage,
  isRelation,
  IValidate,
  IValidationResult,
  IValidator,
  MetaModelType,
  IEntity,
  IEntityRef,
  IField,
  IRelation,
} from '../interfaces';
import { ModelContext, PackageContext, EntityContext, FieldContext, RelationContext } from './contexts';
import { IModelContext, ValidationContext, IPackageContext, IEntityContext, IFieldContext } from './interfaces';
import { Rule } from './rules';

export class Validator implements IValidator {
  public errors: IValidationResult[];
  public rules: { [modelType: string]: object[]; };
  public constructor() {
    this.errors = [];
    this.rules = {};
  }

  public registerRule<T extends ValidationContext>(modelType: MetaModelType, rule: Rule<T>[]) {
    if (!this.rules[modelType]) {
      this.rules[modelType] = [];
    }
    this.rules[modelType].push(...rule);
  }

  public getRules<T extends ValidationContext>(modelType: MetaModelType): Rule<T>[] {
    return <Rule<T>[]>this.rules[modelType] || [];
  }

  public check(item, options?: {
    model?: IModelContext,
    package?: IPackageContext,
    entity?: IEntityContext,
    field?: IFieldContext,
  }): IValidationResult[] {
    let walker;
    if (isModel(item)) {
      return (new ModelVisitor(this)).visit(item);
    }
    if (isPackage(item)) {
      return (new PackageVisitor(this)).visit(item);
    }
    if (isEntity(item) && options && options.package) {
      return (new EntityVisitor(this, options.package)).visit(item);
    }
    if (isField(item) && options && options.entity) {
      return (new FieldVisitor(this, options.entity)).visit(item);
    }
    if (isRelation(item) && options && options.field) {
      return (new RelationVisitor(this, options.field)).visit(item);
    }
    return [];
  }
}

export interface IVisitor<T extends IModelType, C extends ValidationContext> {
  context: C;
  visit(item: T);
}

// export class RelationValidation<Relation extends RelationBase> extends Rule {
//   public errors: IValidationResult[];
//   public entity?: Entity;
//   public field?: Field;
//   public refEntity?: Entity;
//   public refField?: Field;
//   public relation: Relation;

//   public get isValid() {
//     return !!(this.entity && this.field && this.refEntity && this.refField && this.relation);
//   }

//   public constructor(pkg: ModelPackage, rel: Relation) {
//     super();
//     this.relation = rel;
//     const entity = pkg.entities.get(rel.entity);

//     if (!entity) {
//       this.errors.push({
//         message: 'owner entity not found',
//         result: ValidationResultType.error,
//       });
//       return;
//     }

//     const field = entity.fields.get(rel.field);
//     if (!field) {
//       this.errors.push({
//         message: 'owner field not found if the entity',
//         result: ValidationResultType.error,
//       });
//       return;
//     }

//     const refEntity = pkg.entities.get(rel.ref.entity);
//     if (!refEntity) {
//       this.errors.push({
//         message: 'no referenced entity found',
//         result: ValidationResultType.error,
//       });
//       return;
//     }

//     let refField = refEntity.fields.get(rel.ref.field);
//     if (!refField) {
//       this.errors.push({
//         message: 'referenced field not found',
//         result: ValidationResultType.error,
//       });
//     }
//   }

//   public validateOpposite() {
//     if (!this.isValid) {
//       return;
//     }

//     if (this.relation.opposite) {
//       const opposite = this.refEntity.fields.get(this.relation.opposite);
//       if (!opposite) {
//         this.errors.push({
//           message: 'opposite field not found',
//           result: ValidationResultType.warning,
//         });
//         const update = this.relation.toObject();
//         delete update.opposite;
//         this.relation.updateWith(update);
//       }
//       if (!opposits[this.relation.verb][opposite.relation.verb]) {
//         this.errors.push({
//           message: 'opposite relation not supported',
//           result: ValidationResultType.error,
//         });
//       }
//     }

//     if (!this.relation.opposite) {
//       let opposites = Array.from(this.refEntity.fields.values())
//         .filter(f => f.relation && (
//           (f.relation.ref.entity === this.entity.name && f.relation.ref.field === this.field.name) ||
//           ((f.relation as BelongsToMany).using && (this as any).using
//             && (f.relation as BelongsToMany).using.entity === (this as any).using.entity)),
//       );

//       if (opposites.length > 2) {
//         this.errors.push({
//           message: 'more than one possible opposite',
//           result: ValidationResultType.error,
//         });
//       }

//       if (opposites.length === 1) {
//         this.errors.push({
//           message: 'found one possible opposite. assigned.',
//           result: ValidationResultType.warning,
//         });
//         this.relation.opposite = opposites[0].name;
//       }

//       if (opposites.length === 0) {
//         this.errors.push({
//           message: 'no possible opposite',
//           result: ValidationResultType.warning,
//         });
//       }
//     }
//   }
// }

// const opposits = {
//   BelongsTo: {
//     HasOne: true,
//     HasMany: true,
//   },
//   BelongsToMany: {
//     BelongsToMany: true,
//   },
//   HasMany: {
//     BelongsTo: true,
//   },
//   HasOne: {
//     BelongsTo: true,
//   },

// };


