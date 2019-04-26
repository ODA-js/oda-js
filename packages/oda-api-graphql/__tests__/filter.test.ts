import 'jest';
import { Filter, Process } from '../src/filter';

describe('Filter Process', () => {
  it('not uses item that must be skipped', () => {
    let query = {
      location: {
        query: {
          near: {
            geometry: { type: 'Point', coordinates: [-122.284313, 37.548054] },
            maxDistance: null,
          },
        },
      },
    };
    let result = Process.go(query, { id: '_id' });
    expect(result).toEqual(['((value)=>true)(value.location)']);
  });
});
