import {
  GraphQLOptions,
  HttpQueryError,
  runHttpQuery,
  convertNodeHttpToRequest,
} from 'apollo-server-core';
import { ExpressGraphQLOptionsFunction } from 'apollo-server-express/dist/expressApollo';
import express from 'express';

import { graphqlLodash } from './gql';

export function graphqlLodashExpress(
  options: GraphQLOptions | ExpressGraphQLOptionsFunction,
): express.Handler {
  if (!options) {
    throw new Error('Apollo Server requires options.');
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`,
    );
  }

  return (req: express.Request, res: express.Response, next): void => {
    const originalQuery = req.method === 'POST' ? req.body : req.query;

    let transform,
      apply,
      isBatch = false;
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
      request: convertNodeHttpToRequest(req),
    })
      .then(({ graphqlResponse, responseInit }) => {
        if (isBatch) {
          const result = JSON.parse(graphqlResponse) as object[];
          return {
            graphqlResponse: JSON.stringify(
              result.map((r, i) => {
                if (apply[i]) {
                  return transform[i](r);
                } else {
                  return r;
                }
              }),
            ),
            responseInit,
          };
        } else {
          if (apply) {
            return {
              graphqlResponse: JSON.stringify({
                data: transform(JSON.parse(graphqlResponse).data),
              }),
              responseInit,
            };
          } else {
            return { graphqlResponse, responseInit };
          }
        }
      })
      .then(
        ({ graphqlResponse, responseInit }) => {
          if (responseInit.headers) {
            for (const [name, value] of Object.entries(responseInit.headers)) {
              res.setHeader(name, value);
            }
          }
          res.write(graphqlResponse);
          res.end();
        },
        (error: HttpQueryError) => {
          if ('HttpQueryError' !== error.name) {
            return next(error);
          }
          if (error.headers) {
            for (const [name, value] of Object.entries(error.headers)) {
              res.setHeader(name, value);
            }
          }

          res.statusCode = error.statusCode;
          res.write(error.message);
          res.end();
        },
      );
  };
}
