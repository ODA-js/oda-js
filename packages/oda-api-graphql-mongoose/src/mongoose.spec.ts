import 'jest';
import { FilterMongoose as Filter } from './mongoose';

describe('filter', () => {
  it('unfold queries', () => {
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

    const result4 = Filter.parse({
      location: {
        query: {
          and: [
            { type: { eq: 'Point' } },
            { coordinates: { at_0: { gte: 4, lte: 50 } } },
          ],
        },
      },
    });
    expect(result4).toMatchSnapshot();

    const result5 = Filter.parse({
      location: {
        query: {
          coordinates: { all: [40, 5] },
        },
      },
    });
    expect(result5).toMatchSnapshot();

    const result6 = Filter.parse({
      location: {
        query: {
          coordinates: { size: 2 },
        },
      },
    });
    expect(result6).toMatchSnapshot();
    const result7 = Filter.parse({
      location: {
        query: {
          near: {
            geometry: {
              type: 'Point',
              coordinates: [70, 5],
            },
            maxDistance: 50,
            minDistance: 0,
          },
        },
      },
    });
    expect(result7).toMatchSnapshot();
  });
});
