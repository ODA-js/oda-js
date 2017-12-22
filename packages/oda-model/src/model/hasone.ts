import clean from '../lib/json/clean';
import { EntityReference } from './entityreference';
import { HasOneInput, HasOneStorage } from './interfaces';
import { RelationBase } from './relationbase';

export class HasOne extends RelationBase {
  protected $obj: HasOneStorage;

  get hasOne(): EntityReference {
    return this.$obj.hasOne;
  }

  get ref(): EntityReference {
    return this.$obj.hasOne;
  }

  // public validate(pkg?: ModelPackage): IValidationResult[] {
  //   const result: IValidationResult[] = super.validate(pkg);
  //   // if (pkg) {

  //   //   if (field.indexed || field.identity) {
  //   //     const update = field.toJSON();
  //   //     delete update.identity;
  //   //     delete update.indexed;
  //   //     field.updateWith(update);
  //   //     result.push({
  //   //       field: this.name,
  //   //       message: `unnecessery ${field.indexed ? 'indexed' : 'identity'} field`,
  //   //       result: ValidationResultType.fixable,
  //   //     });
  //   //   }

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
  //   //       message: 'referenced field for HasOne relation must be indexed',
  //   //       result: ValidationResultType.error,
  //   //     });
  //   //   }

  //   // }
  //   return result;
  // }

  constructor(obj: HasOneInput) {
    super(obj);
  }

  public updateWith(obj: HasOneInput) {
    if (obj) {
      super.updateWith(obj);
      const result = { ...this.$obj };

      this.setMetadata('storage.single', true);
      this.setMetadata('storage.stored', false);
      this.setMetadata('storage.embedded', false);
      this.setMetadata('verb', 'HasOne');

      let $hasOne = obj.hasOne;

      let hasOne;
      if ($hasOne) {
        hasOne = new EntityReference($hasOne);
        if (!hasOne.backField) {
          hasOne.backField = 'id';
        }
      }

      result.hasOne_ = $hasOne;
      result.hasOne = hasOne;

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
      hasOne: props.hasOne ? props.hasOne.toString() : undefined,
    });
  }

  // it get clean object with no default values
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      hasOne: props.hasOne_,
    });
  }
}
