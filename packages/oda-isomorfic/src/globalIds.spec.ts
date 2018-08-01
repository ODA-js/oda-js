import 'jest';
import { fromGlobalId, toGlobalId } from './globalIds';
import base64 from './base64';
import unbase64 from './unbase64';

describe('globalId', () => {
  it('convert id from global id', () => {
    const id = toGlobalId('user', '1');
    const id2 = toGlobalId('user', id);
    expect(id).toEqual(id2);
  });
});
