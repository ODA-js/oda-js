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
import { WhereBoolean } from './whereBoolean';
import { WhereDate } from './whereDate';
import { WhereFloat } from './whereFloat';
import { WhereID } from './whereID';
import { WhereInt } from './whereInt';
import { WhereString } from './whereString';
import { WhereListOfStrings } from './whereListOfStrings';
import { WhereMutationKind } from './whereMutationKind';

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
  WhereBoolean,
  WhereDate,
  WhereFloat,
  WhereID,
  WhereInt,
  WhereString,
  WhereListOfStrings,
  WhereMutationKind,
}

export class DefaultTypes extends GQLModule {
  protected _name = 'DefaultTypes';
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
    new WhereBoolean({}),
    new WhereDate({}),
    new WhereFloat({}),
    new WhereID({}),
    new WhereInt({}),
    new WhereString({}),
    new WhereListOfStrings({}),
    new WhereMutationKind({}),
  ];
}
