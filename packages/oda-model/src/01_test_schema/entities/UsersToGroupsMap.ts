import { IEntityInit } from '../../interfaces/IEntity';

const entity: IEntityInit = {
  name: 'UsersToGroupsMap',
  description: 'Users to Groups mapping',
  fields: {
    user: {
      identity: 'linkTable',
    },
    group: {
      identity: 'linkTable',
    },
    userLink: {
      relation: {
        belongsTo: 'user@User#',
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
