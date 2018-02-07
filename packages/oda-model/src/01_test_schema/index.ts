import packages from './packages';
import mutations from './mutations';
import entities from './entities';
import enums from './enums';
import { IEntityInit } from '../interfaces/IEntity';
import { IEnumInit } from '../interfaces/IEnum';
import { IMutationInit } from '../interfaces/IMutation';

export default {
  name: 'ToDoListApplication',
  packages,
  mutations,
  entities,
  enums,
};
