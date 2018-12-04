import { IEntityInit } from '../../interfaces/IEntity';

const entity: IEntityInit = {
  name: 'User',
  description: 'User',
  fields: {
    userName: {
      identity: true,
    },
    password: {
      required: true,
    },
    isSystem: {
      type: 'boolean',
    },
    enabled: {
      type: 'boolean',
    },
    groups: {
      relation: {
        belongsToMany: 'Group#',
        using: 'UsersToGroupsMap#user',
      },
    },
  },
};

export default entity;
