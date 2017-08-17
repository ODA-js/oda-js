
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
    const { transform, apply } = graphqlLodash(originalQuery.query);

    runHttpQuery([req, res], {
      method: req.method,
      options: options,
      query: originalQuery,
    })
      .then((gqlResponse) => {
        if (apply) {
          return JSON.stringify({
            data: transform(JSON.parse(gqlResponse).data)
          });
        } else {
          return gqlResponse;
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