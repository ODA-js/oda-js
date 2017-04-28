import { StateOfFieldType } from './stateOfField';
import { StateOfConectionType } from './stateOfConnection';
import { PageInfoType } from './pageInfo';
import { DateType } from './date';
import { IdType } from './id';
import { ImageSizeType } from './imageSize';
import { JSONType } from './json';
import { GQLModule } from './empty';

export {
  GQLModule,
  StateOfFieldType,
  StateOfConectionType,
  PageInfoType,
  DateType,
  IdType,
  ImageSizeType,
  JSONType,
}

export class DefaultTypes extends GQLModule {
  protected _extend = [
    new StateOfFieldType({}),
    new StateOfConectionType({}),
    new PageInfoType({}),
    new DateType({}),
    new IdType({}),
    new ImageSizeType({}),
    new JSONType({}),
  ];
}
