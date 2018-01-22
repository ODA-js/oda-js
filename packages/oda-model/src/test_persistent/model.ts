import clean from '../lib/json/clean';
import { Map, Record} from 'immutable';

export class Persist<Out, StorageModel> {
  public $obj: Map<any, StorageModel>;
  public toObject() {
    return clean({

    });
  }
  public toJSON() {
    return clean({

    });
  }
}

interface IEntity {
  name: string;
  title?: string;
  description?: string;
}

const entity =  Record<IEntity>({name: ''});
const person = new entity();
const v = person.description;
const p = person.set('name', 'new Name');
console.log(person, p);

