
import { IEnumInit } from './../../../interfaces/IEnum';

const result: IEnumInit = {
  name: 'ToDoType',
  values: {
    'public user': 'public',
    'registered user': 'registered',
    admin: {
      name: 'super pupper',
      value: 'admin',
      type: 'string',
      title: 'The super power User',
    },
  },
};

export default result;
