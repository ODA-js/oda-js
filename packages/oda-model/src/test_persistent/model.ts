import { Record, Set} from 'immutable';
import { IMutation } from '../validation/interfaces/IMutation';
import { Mutation } from '../validation/model/Mutation';

const mutation: IMutation = new Mutation({
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
  payload: [
    {
      name: 'token',
    },
  ],
});
debugger;
mutation.updateWith({ acl: { execute: ['admin'] } });
mutation.updateWith({ acl: { execute: ['public'] } });
mutation.updateWith({ acl: { execute: ['public', 'admin', 12, 1, 2, 2] } });
mutation.updateWith({ acl: { execute: [ 'admin'] } });
mutation.updateWith({ acl: { execute: ['public', 'admin', 1, 1, 2] } });

// tslint:disable-next-line:no-console
console.log(mutation.acl);
