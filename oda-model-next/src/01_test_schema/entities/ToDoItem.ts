import { IEntityInit } from '../../interfaces/IEntity';

const entity: IEntityInit = {
  name: 'ToDoItem',
  description: 'ToDo item',
  fields: [
    {
      name: 'done',
      type: 'Boolean',
    },
    {
      name: 'name',
      indexed: 'text',
    },
    {
      name: 'description',
      indexed: 'text',
    },
    {
      name: 'dueTo',
      type: 'Date',
    },
    {
      name: 'isPrivate',
      type: 'Boolean',
    },
    {
      name: 'type',
      type: 'ToDotype',
    },
    {
      name: 'assignedTo',
      indexed: true,
      relation: {
        belongsTo: 'User#',
      },
    },
    {
      name: 'creator',
      indexed: true,
      relation: {
        belongsTo: 'User#',
      },
    },
    {
      name: 'sharedTo',
      relation: {
        belongsToMany: 'Group#',
        using: 'ToDoItemsSharedToGroupsMap#item',
      },
    },
  ],
};

export default entity;
