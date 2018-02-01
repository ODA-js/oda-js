import { IEntityInput } from '../../../interfaces/IEntity';

const entity: IEntityInput = {
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
