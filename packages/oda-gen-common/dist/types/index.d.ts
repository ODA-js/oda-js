import { StateOfFieldType } from './stateOfField';
import { StateOfConectionType } from './stateOfConnection';
import { PageInfoType } from './pageInfo';
import { DateType } from './date';
import { IdType } from './id';
import { ImageSizeType } from './imageSize';
import { JSONType } from './json';
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
import { WhereJSON } from './whereJSON';
export { GQLModule, StateOfFieldType, StateOfConectionType, PageInfoType, DateType, IdType, ImageSizeType, JSONType, WhereBoolean, WhereDate, WhereFloat, WhereID, WhereInt, WhereString, WhereListOfStrings, WhereMutationKind, WhereJSON, };
export declare class DefaultTypes extends GQLModule {
    protected _name: string;
    protected _composite: (StateOfFieldType | StateOfConectionType | PageInfoType | DateType | IdType | ImageSizeType | JSONType | WhereBoolean | WhereDate | WhereFloat | WhereID | WhereInt | WhereString | WhereListOfStrings | WhereMutationKind | WhereJSON | MutationKindType)[];
}
//# sourceMappingURL=index.d.ts.map