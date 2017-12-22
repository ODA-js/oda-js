import clean from '../lib/json/clean';
import { EntityReference } from './entityreference';
import { HasManyInput, HasManyStorage } from './interfaces';
import { RelationBase } from './relationbase';

export class HasMany extends RelationBase {
  protected $obj: HasManyStorage;

  get hasMany(): EntityReference {
    return this.$obj.hasMany;
  }

  get ref(): EntityReference {
    return this.$obj.hasMany;
  }

  // public validate(pkg?: ModelPackage): IValidationResult[] {
  //   const result: IValidationResult[] = super.validate(pkg);
  //   // if (pkg) {
  //   //   if (this.ref.backField) {
  //   //     let bf = entity.fields.get(this.ref.backField);
  //   //     if (!bf) {
  //   //       result.push({
  //   //         message: 'back field not exists',
  //   //         result: ValidationResultType.fixable,
  //   //       });

  //   //       this.ref.backField = 'id';
  //   //       bf = entity.fields.get(this.ref.backField);
  //   //     }

  //   //     if (!bf.identity) {
  //   //       const update = bf.toJSON();
  //   //       update.identity = true;
  //   //       bf.updateWith(update);
  //   //       result.push({
  //   //         message: 'back field is not identity',
  //   //         result: ValidationResultType.fixable,
  //   //       });
  //   //     }
  //   //   }

  //   //   if (!refField.indexed) {
  //   //     const update = refField.toJSON();
  //   //     update.indexed = true;
  //   //     refField.updateWith(update);
  //   //     result.push({
  //   //       message: 'referenced field for HasMany relation must be indexed. fixed.',
  //   //       result: ValidationResultType.fixable,
  //   //     });
  //   //   }

  //   // }
  //   return result;
  // }

  constructor(obj: HasManyInput) {
    super(obj);
  }

  public updateWith(obj: HasManyInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      this.setMetadata('storage.single', false);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasMany');

      let $hasMany = obj.hasMany;

      let hasMany;
      if ($hasMany) {
        hasMany = new EntityReference($hasMany);
        if (!hasMany.backField) {
          hasMany.backField = 'id';
        }
      }

      result.hasMany_ = $hasMany;
      result.hasMany = hasMany;

      this.$obj = result;
      this.initNames();
    }
  }
  // it get fixed object
  public toObject(): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      hasMany: props.hasMany ? props.hasMany.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasMany: props.hasMany_,
    });
  }
}
