import { IEnumInit } from '../../interfaces/IEnum';


const result: IEnumInit = {
  name: 'ToDoType',
  values: ['usual', {
    name: 'super pupper',
    value: 'super',
    type: 'string',
  }],
};

export default result;
