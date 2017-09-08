import { GQLModule } from './empty';

export class WhereBoolean extends GQLModule {
  protected _typeDef = {
    entry: [`
      input WhereBoolean {
        eq: Boolean
        gt: Boolean
        gte: Boolean
        lt: Boolean
        lte: Boolean
        ne: Boolean
        in: [Boolean!]
        nin: [Boolean!]
        and: [WhereBoolean!]
        or: [WhereBoolean!]
        nor: [WhereBoolean!]
        not: [WhereBoolean!]
        exists: Boolean
        match: String
      }
  `],
  };
}

