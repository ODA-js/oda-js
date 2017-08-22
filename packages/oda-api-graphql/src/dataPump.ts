import { filter } from 'graphql-anywhere';
import gql from 'graphql-tag';

// tslint:disable-next-line:no-var-requires
require('isomorphic-fetch');

export function decapitalize(name: string): string {
  return name[0].toLowerCase() + name.slice(1);
}

async function processItems<I>({ data, findQuery, createQuery, updateQuery, dataPropName, findVars, queries }:
  {
    data: I[],
    findQuery: { [key: string]: string },
    createQuery,
    updateQuery,
    dataPropName,
    queries,
    findVars: { [key: string]: (f: I) => any },
  }, client) {
  for (let i = 0, len = data.length; i < len; i++) {
    const keys = Object.keys(findVars);
    let variables;
    let key;
    let res;
    for (let k = 0, kLen = keys.length; k < kLen; k++) {
      key = keys[k];
      variables = findVars[key](data[i]);
      if (variables) {
        //1. проверить что объект есть
        res = await client.query({
          query: queries[findQuery[key]],
          variables,
        });
        if (res.data[dataPropName]) {
          break;
        }
      }
    }
    if (!res.data[dataPropName]) {
      //2. если нет создать
      await client.mutate({
        mutation: queries[createQuery],
        variables: {
          [dataPropName]: data[i],
        },
      });
    } else {
      //3. если есть обновить текущими данными из набора.
      await client.mutate({
        mutation: queries[updateQuery],
        variables: {
          [dataPropName]: data[i],
        },
      });
    }
  }
}

async function processItemsDirect<I>({ data, findQuery, createQuery, updateQuery, dataPropName, findVars, queries }:
  {
    data: I[],
    findQuery: { [key: string]: string },
    createQuery,
    updateQuery,
    dataPropName,
    queries,
    findVars: { [key: string]: (f: I) => any },
  }, schema, context, runQuery) {
  for (let i = 0, len = data.length; i < len; i++) {
    const keys = Object.keys(findVars);
    let variables;
    let key;
    let res;
    for (let k = 0, kLen = keys.length; k < kLen; k++) {
      key = keys[k];
      variables = findVars[key](data[i]);
      if (variables) {
        res = await runQuery({
          query: queries[findQuery[key]],
          variables,
          schema,
          context,
        });
        if (res.data[dataPropName]) {
          break;
        }
      }
    }
    //1. проверить что объект есть
    if (!res.data[dataPropName]) {
      //2. если нет создать
      await runQuery({
        query: queries[createQuery],
        variables: {
          [dataPropName]: data[i],
        },
        schema,
        context,
      });
    } else {
      //3. если есть обновить текущими данными из набора.
      await runQuery({
        query: queries[updateQuery],
        variables: {
          [dataPropName]: data[i],
        },
        schema,
        context,
      });
    }
  }
}

export let restoreDataDirect = async (importQueries, queries, data, schema, context, runQuery) => {
  let entitiesNames = Object.keys(importQueries);
  for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
    let entityName = entitiesNames[iEnt];
    let fields = importQueries[entityName].filter ? filter(gql`{ ${entityName} ${importQueries[entityName].filter} }`, data) : data;
    let uploader = {
      findQuery: `${entityName}/findById.graphql`,
      createQuery: `${entityName}/create.graphql`,
      updateQuery: `${entityName}/update.graphql`,
      dataPropName: `${decapitalize(entityName)}`,
      findVars: f => ({ id: f.id }),
      ...importQueries[entityName].uploader,
    };

    if (fields.hasOwnProperty(entityName) && Array.isArray(fields[entityName]) && fields[entityName].length > 0) {
      await processItemsDirect({
        data: fields[entityName],
        ...uploader,
        queries: queries,
      }, schema, context, runQuery);
    }
  }
};

export let restoreData = async (importQueries, queries, client, data) => {
  let entitiesNames = Object.keys(importQueries);

  for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
    let entityName = entitiesNames[iEnt];
    let fields = importQueries[entityName].filter ? filter(gql`{ ${entityName} ${importQueries[entityName].filter} }`, data) : data;
    let uploader = {
      findQuery: `${entityName}/findById.graphql`,
      createQuery: `${entityName}/create.graphql`,
      updateQuery: `${entityName}/update.graphql`,
      dataPropName: `${decapitalize(entityName)}`,
      findVars: f => ({ id: f.id }),
      ...importQueries[entityName].uploader,
    };

    if (fields.hasOwnProperty(entityName) && Array.isArray(fields[entityName]) && fields[entityName].length > 0) {
      await processItems({
        data: fields[entityName],
        ...uploader,
        queries: queries,
      }, client);
    }
  }
};

export let dumpDataDirect = async (config, queries, schema, context, runQuery) => {
  let result = {};
  let exportQueries = config.export.queries;
  let entitiesNames = Object.keys(exportQueries);
  for (let i = 0, len = entitiesNames.length; i < len; i++) {
    let entityName = entitiesNames[i];
    result = {
      ...result,
      ...await runQuery({
        query: queries[exportQueries[entityName].query],
        schema,
        context,
      })
        .then(res => {
          if (exportQueries[entityName].process) {
            return exportQueries[entityName].process(res.data)[entityName]
          } else {
            return res.data;
          }
        }),
    }
  }
  return result;
};

export let dumpData = async (config, queries, client) => {
  let result = {};
  let exportQueries = config.export.queries;
  let entitiesNames = Object.keys(exportQueries);
  for (let i = 0, len = entitiesNames.length; i < len; i++) {
    let entityName = entitiesNames[i];
    result = {
      ...result,
      ...await client.query({
        query: queries[exportQueries[entityName].query],
      })
        .then(res => {
          if (exportQueries[entityName].process) {
            return exportQueries[entityName].process(res.data)[entityName]
          } else {
            return res.data;
          }
        })
    }
  }
  return result;
};
