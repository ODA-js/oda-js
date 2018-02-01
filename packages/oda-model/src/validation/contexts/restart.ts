import { RestartType } from '../interfaces/types';

export function restart(type: RestartType) {
  switch (type) {
    case 'model':
      throw new Error(type);
    case 'package':
      throw new Error(type);
    case 'entity':
      throw new Error(type);
    case 'field':
      throw new Error(type);
    case 'relation':
      throw new Error(type);
    case 'mutation':
      throw new Error(type);
    case 'enum':
      throw new Error(type);
    default:
      throw new Error('unknown');
  }
}
