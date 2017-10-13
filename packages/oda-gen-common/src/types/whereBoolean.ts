import { GQLModule } from './empty';

export class WhereBoolean extends GQLModule {
  protected _typeDef = {
    entry: [`
      input WhereBoolean {
        eq: Boolean
        ne: Boolean
        exists: Boolean
      }
  `],
  };
}

