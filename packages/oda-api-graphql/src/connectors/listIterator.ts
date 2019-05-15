import getLogger from 'oda-logger';
let logger = getLogger('oda-api-graphql:api:iterator');
require('core-js/modules/es7.symbol.async-iterator');
// get the data
export async function* iterate(
  getData: (page, limit) => Promise<any[]>,
  limit,
) {
  logger.trace('iterate:limit %d', limit);
  let i = 0;
  while (true) {
    logger.trace('iterate:iterate %d', i);
    let res = await getData(i, limit);
    if (Array.isArray(res) && res.length > 0) {
      logger.trace('iterate:step %o', i);
      logger.trace('iterate:data %o', res);
      yield res;
      i++;
      if (res.length < limit) {
        return;
      }
    } else {
      logger.trace('stop');
      break;
    }
  }
}

export async function* forward(
  getData: (step) => Promise<any[]>,
  limit: number,
): AsyncIterableIterator<any> {
  logger.trace('forward %d', limit);
  for await (let i of iterate(getData, limit)) {
    logger.trace('forward:iterate %o', i);
    yield* i;
  }
}
