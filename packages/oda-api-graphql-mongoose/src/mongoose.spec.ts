import 'jest';
import { FilterMongoose as Filter } from './mongoose';

describe('filter', () => {
  it('unfold queries', () => {
    debugger;
    const result = Filter.parse({ location: { query: { type: 'Point' } } });
    expect(result).toMatchSnapshot();
    const result2 = Filter.parse({
      location: { query: { or: [{ type: 'Point' }, { type: 'Line' }] } },
    });
    expect(result2).toMatchSnapshot();
    const result3 = Filter.parse({
      location: {
        query: {
          or: [
            { type: 'Point' },
            { type: 'Line' },
            {
              and: [
                { coordinates: { in: [40, 50] } },
                { coordinates: { in: [20, 30] } },
              ],
            },
          ],
        },
      },
    });
    expect(result3).toMatchSnapshot();
  });
});
