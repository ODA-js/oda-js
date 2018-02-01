import { IEntityInput } from '../../../interfaces/IEntity';

const entity: IEntityInput = {
  name: 'ToDoItemsSharedToGroupsMap',
  description: 'Sharing ToDo items between groups',
  fields: {
    item: {
      indexed: true,
      identity: 'shared',
    },
    group: {
      indexed: true,
      identity: 'shared',
    },
    itemLink: {
      relation: {
        belongsTo: 'item@ToDoItem#',
      },
    },
    groupLink: {
      relation: {
        belongsTo: 'group@Group#',
      },
    },
  },
};

export default entity;
