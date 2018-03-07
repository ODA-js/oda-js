import { IMutationInit } from '../../interfaces/IMutation';

const mutation: IMutationInit = {
  name: 'loginUser',
  description: 'make user login',
  args: [
    {
      name: 'userName',
      required: true,
    },
    {
      name: 'password',
      required: true,
    },
  ],
  payload: {
    token: {
      type: 'string',
    },
  },
};

export default mutation;
