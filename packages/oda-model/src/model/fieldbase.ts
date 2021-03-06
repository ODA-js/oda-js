import clean from '../lib/json/clean';
import {
  FieldArgs,
  FieldBaseInput,
  FieldBaseStorage,
  MetaModelType,
} from './interfaces';
import { ModelBase } from './modelbase';

export class FieldBase extends ModelBase {
  public modelType: MetaModelType = 'field';
  protected $obj: FieldBaseStorage;

  get entity(): string {
    return this.$obj.entity;
  }

  get args(): FieldArgs[] {
    return this.$obj.args;
  }

  // is used with custom resolver
  get derived() {
    return this.getMetadata('storage.derived');
  }

  // is retrieved from storage layer
  get persistent() {
    return this.getMetadata('storage.persistent');
  }

  get defaultValue() {
    return this.getMetadata('defaultValue');
  }

  public updateWith(obj: FieldBaseInput) {
    if (obj) {
      super.updateWith(obj);

      const result = { ...this.$obj };

      let $entity = obj.entity;
      let entity = $entity;

      let args = obj.args;
      let $args = obj.args;

      // wheather it is explicitly defined or has arguments

      this.setMetadata(
        'storage.derived',
        obj.derived ||
          (Array.isArray(obj.args) && obj.args.length > 0) ||
          this.getMetadata('storage.derived'),
      );
      this.setMetadata(
        'storage.persistent',
        obj.persistent ||
          !(
            obj.derived ||
            this.getMetadata('storage.derived') ||
            (Array.isArray(obj.args) && obj.args.length > 0)
          ),
      );

      if (obj.defaultValue && !this.derived) {
        this.setMetadata('defaultValue', obj.defaultValue);
      }

      result.entity = entity;
      result.entity_ = $entity;

      result.args = args;
      result.args_ = $args;

      this.$obj = result;
    }
  }

  // it get fixed object
  public toObject() {
    let props = this.$obj;
    let res = super.toObject();
    return clean({
      ...res,
      derived: this.derived,
      defaultValue: this.defaultValue,
      persistent: this.persistent,
      entity: props.entity || props.entity_,
      args: props.args || props.args_,
    });
  }

  // it get clean object with no default values
  public toJSON() {
    let props = this.$obj;
    let res = super.toJSON();
    return clean({
      ...res,
      derived: this.derived,
      defaultValue: this.defaultValue,
      persistent: this.persistent,
      args: props.args_,
    });
  }
}
