import { GQLModule } from './empty';

export class WhereListOfStrings extends GQLModule {
  protected _typeDef = {
    entry: [`
      input WhereListOfStrings {
        contains: String
        some: [String!]
        every: [String!]
        except: String
        none: [String!]
      }
  `],
  };
}

