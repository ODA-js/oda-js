import { StateOfFieldType } from './stateOfField';
import { StateOfConectionType } from './stateOfConnection';
import { PageInfoType } from './pageInfo';
import { DateType } from './date';
import { IdType } from './id';
import { ImageSizeType } from './imageSize';
import { JSONType } from './json';
import { FileType } from './file';
import { GQLModule } from './empty';
import { MutationKindType } from './mutationType';

export {
  GQLModule,
  StateOfFieldType,
  StateOfConectionType,
  PageInfoType,
  DateType,
  IdType,
  ImageSizeType,
  JSONType,
  FileType,
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
    new FileType({}),
    new MutationKindType({}),
  ];
}
