import { ModelLevel, PackageLevel, EntityLevel, FieldLevel, RelationLevel } from '../errors';
import { RestartType } from '../interfaces/types';

export function restart(type: RestartType) {
  switch (type) {
    case 'model':
      throw new ModelLevel();
    case 'package':
      throw new PackageLevel();
    case 'entity':
      throw new EntityLevel();
    case 'field':
      throw new FieldLevel();
    case 'relation':
      throw new RelationLevel();
    default:
      throw Error('unknown restart level');
  }
}
