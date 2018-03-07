import User from './User';
import Group from './Group';
import UsersToGoups from './UsersToGroupsMap';
import ToDoItem from './ToDoItem';
import ToDoItemsSharedToGroups from './ToDoItemsSharedToGroupsMap';
import { IEntityInit } from '../../interfaces/IEntity';
import { IMutationInit } from '../../interfaces/IMutation';

export default [
  User,
  Group,
  UsersToGoups,
  ToDoItem,
  ToDoItemsSharedToGroups,
];
