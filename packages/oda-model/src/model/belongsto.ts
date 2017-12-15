import { RelationBase } from './relationbase';
import { EntityReference } from './entityreference';
import { BelongsToStorage, BelongsToInput, IValidationResult, ValidationResultType } from './interfaces';
import clean from '../lib/json/clean';
import { ModelPackage } from './index';

/**
 * BelongsTo Relation
 */
export class BelongsTo extends RelationBase {
  protected $obj: BelongsToStorage;
  get belongsTo(): EntityReference {
    return this.$obj.belongsTo;
  }

  /**
   * common for all type Relations
   */
  get ref(): EntityReference {
    return this.$obj.belongsTo;
  }

  constructor(obj: BelongsToInput) {
    super(obj);
  }

  public validate(pkg?: ModelPackage): IValidationResult[] {
    const result: IValidationResult[] = super.validate(pkg);
    if (pkg) {
      //ref Entity
      const refEntity = pkg.entities.get(this.ref.entity);
      if (refEntity) {
        let refField = refEntity.fields.get(this.ref.field);
        if (refField) {
          if (!refField.identity) {
            result.push({
              message: 'referenced field for BelongsTo relation is not identity',
              result: ValidationResultType.error,
            });
          }
        }
      }
      // entity
      const entity = pkg.entities.get(this.entity);
      if (entity) {
        const field = entity.fields.get(this.field);
        if (field) {
          if (this.ref.backField) {
            const bf = entity.fields.get(this.ref.backField);
            if (bf.identity && typeof bf.identity === 'boolean') {
              debugger;
              result.push({
                message: 'back field for BelongsTo relation is identity',
                result: ValidationResultType.critics,
              });
            }
          } else {
            if (!field.indexed) {
              result.push({
                message: 'field for BelongsTo relation must be indexed',
                result: ValidationResultType.error,
              });
            }

            if (field.identity && typeof field.identity === 'boolean') {
              result.push({
                message: 'field for BelongsTo relation is identity',
                result: ValidationResultType.critics,
              });
            }
          }
          if (this.opposite) {
            const opposite = refEntity.fields.get(this.opposite);
            if (opposite) {
              if (opposite.relation.verb === 'BelongsTo') {
                result.push({
                  message: 'opposite relation BelongsTo -> BelongstTo not supported',
                  result: ValidationResultType.error,
                });
              }
            }
          }
        }
      }
    }
    return result;
  }

  /**
   * single point update
   */
  public updateWith(obj: BelongsToInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      this.setMetadata('storage.single', true);
      this.setMetadata('storage.stored', true);
      this.setMetadata('storage.embedded', true);
      this.setMetadata('verb', 'BelongsTo');

      let $belongsTo = obj.belongsTo;

      let belongsTo;
      if ($belongsTo) {
        belongsTo = new EntityReference($belongsTo);
        // no default backField!!! at all!!!
      }

      result.belongsTo_ = $belongsTo;
      result.belongsTo = belongsTo;

      this.$obj = result;
      this.initNames();
    }
  }

  /**
   * it get fixed object
   */
  public toObject(): any {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      belongsTo: props.belongsTo ? props.belongsTo.toString() : undefined,
    });
  }

  /**
   * it get clean object with no default values
   */
  public toJSON(): any {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      belongsTo: props.belongsTo_,
    });
  }
}
