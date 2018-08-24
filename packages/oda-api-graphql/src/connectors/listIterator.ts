require('core-js/modules/es7.symbol.async-iterator');
// get the data
export async function* iterate(
  getData: (page, limit) => Promise<any[]>,
  limit,
) {
  let i = 0;
  while (true) {
    let res = await getData(i, limit);
    if (Array.isArray(res) && res.length > 0) {
      yield res;
      i++;
      if (res.length < limit) {
        return;
      }
    } else {
      break;
    }
  }
}

export async function* forward(
  getData: (step) => Promise<any[]>,
  limit: number,
): AsyncIterableIterator<any> {
  for await (let i of iterate(getData, limit)) {
    yield* i;
  }
}
