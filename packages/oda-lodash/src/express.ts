
import * as express from 'express';
import * as url from 'url';
import { GraphQLOptions, HttpQueryError, runHttpQuery, resolveGraphqlOptions } from 'apollo-server-core';
import { ExpressGraphQLOptionsFunction, ExpressHandler } from 'apollo-server-express';
import { graphqlLodash } from './gql';

export function graphqlLodashExpress(options: GraphQLOptions | ExpressGraphQLOptionsFunction): ExpressHandler {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(`Apollo Server expects exactly one argument, got ${arguments.length}`);
  }

  return (req: express.Request, res: express.Response, next): void => {
    const originalQuery = req.method === 'POST' ? req.body : req.query;

    let transform, apply, isBatch = false;
    if (Array.isArray(originalQuery)) {
      isBatch = true;
      let res = originalQuery.map(q => graphqlLodash(q.query, q.operationName));
      transform = res.map(t => t.transform);
      apply = res.map(t => t.apply);
    } else {
      let res = graphqlLodash(originalQuery.query, originalQuery.operationName);
      transform = res.transform;
      apply = res.apply;
    }

    runHttpQuery([req, res], {
      method: req.method,
      options: options,
      query: originalQuery,
    })
      .then((gqlResponse) => {
        if (isBatch) {
          const result = JSON.parse(gqlResponse) as object[];
          return JSON.stringify(result.map((r, i) => {
            if (apply[i]) {
              return transform[i](r);
            } else {
              return r;
            }
          }));
        } else {
          if (apply) {
            return JSON.stringify({
              data: transform(JSON.parse(gqlResponse).data)
            });
          } else {
            return gqlResponse;
          }
        }
      })
      .then((gqlResponse) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(gqlResponse);
        res.end();
      }, (error: HttpQueryError) => {
        if ('HttpQueryError' !== error.name) {
          return next(error);
        }
        if (error.headers) {
          Object.keys(error.headers).forEach((header) => {
            res.setHeader(header, error.headers[header]);
          });
        }

        res.statusCode = error.statusCode;
        res.write(error.message);
        res.end();
      });
  };
}