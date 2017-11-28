import { GQLModule } from './empty';

export class FileType extends GQLModule {
  protected _name = 'FileType'

  protected _typeDef = {
    entry: [`
      input File {
        name: String!
        type: String!
        size: Int!
        path: String!
      }
  `],
  }
}

