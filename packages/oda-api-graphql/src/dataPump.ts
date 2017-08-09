import { runQuery } from 'graphql-server-core';
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
  }, schema, context) {
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

export let restoreDataDirect = async (config, queries, data, schema, context) => {
  let importQueries = config.import.queries;
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
      }, schema, context);
    }
  }
};

export let restoreData = async (config, queries, client, data) => {
  let importQueries = config.import.queries;
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

export let relateDataDirect = async (config, queries, data, schema, context) => {
  let rel = config.import.relations;
  if (rel && typeof rel === 'object') {

    let importQueries = config.import.queries;

    let entitiesNames = Object.keys(data);

    for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
      let entityName = entitiesNames[iEnt];
      // relations
      let entRels = `rel`[entityName];
      let relKeys = entRels ? Object.keys(entRels) : [];
      for (let iEntRel = 0, iEntRelLen = relKeys.length; iEntRel < iEntRelLen; iEntRel++) {
        let relname = relKeys[iEntRel];
        let relType = entRels[relname].type;
        let result = filter(gql`{ ${entityName} ${entRels[relname].filter} }`, data);

        for (let i = 0, len = result[entityName].length; i < len; i++) {
          let item = result[entityName][i];
          let itemId = await runQuery({
            query: queries[importQueries[entityName].uploader.findQuery],
            variables: importQueries[entityName].uploader.findVars(item),
            schema,
            context,
          }).then(res => {
            if (importQueries[entityName].uploader.process) {
              return importQueries[entityName].uploader.process(res.data);
            } else {
              return res.data[importQueries[entityName].uploader.dataPropName].id;
            }
          });

          let propName = entRels[relname].singular || relname;
          let relatee = item[relname];
          if (relatee) {
            if (relatee && !Array.isArray(relatee)) {
              relatee = [relatee];
            }

            for (let j = 0, jLen = relatee.length; j < jLen; j++) {
              let relId;
              let curRel = relatee[j];
              if (curRel && curRel.id) {
                relId = curRel.id;
              } else {
                relId = await runQuery({
                  query: queries[importQueries[relType].uploader.findQuery],
                  variables: importQueries[relType].uploader.findVars(curRel),
                  schema,
                  context,
                }).then(res => {
                  if (importQueries[relType].uploader.process) {
                    return importQueries[relType].uploader.process(res.data);
                  } else {
                    return res.data[propName].id;
                  }
                });
              }

              await runQuery({
                query: queries[entRels[relname].relate],
                variables: {
                  connection: {
                    [importQueries[entityName].uploader.dataPropName]: itemId,
                    [propName]: relId,
                  },
                },
                schema,
                context,
              });
            }
          }
        }
      }
    }
  }
};

export let relateData = async (config, queries, client, data) => {
  let rel = config.import.relations;
  if (rel && typeof rel === 'object') {

    let importQueries = config.import.queries;

    let entitiesNames = Object.keys(data);

    for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
      let entityName = entitiesNames[iEnt];
      // relations
      let entRels = rel[entityName];
      let relKeys = entRels ? Object.keys(entRels) : [];
      for (let iEntRel = 0, iEntRelLen = relKeys.length; iEntRel < iEntRelLen; iEntRel++) {
        let relname = relKeys[iEntRel];
        let relType = entRels[relname].type;
        let result = filter(gql`{ ${entityName} ${entRels[relname].filter} }`, data);

        for (let i = 0, len = result[entityName].length; i < len; i++) {
          let item = result[entityName][i];
          let itemId = await client.query({
            query: queries[importQueries[entityName].uploader.findQuery],
            variables: importQueries[entityName].uploader.findVars(item),
          }).then(res => {
            if (importQueries[entityName].uploader.process) {
              return importQueries[entityName].uploader.process(res.data);
            } else {
              return res.data[importQueries[entityName].uploader.dataPropName].id;
            }
          });

          let propName = entRels[relname].singular || relname;
          let relatee = item[relname];
          if (relatee) {
            if (relatee && !Array.isArray(relatee)) {
              relatee = [relatee];
            }

            for (let j = 0, jLen = relatee.length; j < jLen; j++) {
              let relId;
              let curRel = relatee[j];
              if (curRel && curRel.id) {
                relId = curRel.id;
              } else {
                relId = await client.query({
                  query: queries[importQueries[relType].uploader.findQuery],
                  variables: importQueries[relType].uploader.findVars(curRel),
                }).then(res => {
                  if (importQueries[relType].uploader.process) {
                    return importQueries[relType].uploader.process(res.data);
                  } else {
                    return res.data[propName].id;
                  }
                });
              }

              await client.mutate({
                mutation: queries[entRels[relname].relate],
                variables: {
                  connection: {
                    [importQueries[entityName].uploader.dataPropName]: itemId,
                    [propName]: relId,
                  },
                },
              });
            }
          }
        }
      }
    }
  }
};

export let dumpDataDirect = async (config, queries, schema, context) => {
  let result = {};
  let exportQueries = config.export.queries;
  let entitiesNames = Object.keys(exportQueries);
  for (let i = 0, len = entitiesNames.length; i < len; i++) {
    let entityName = entitiesNames[i];
    result[entityName] = await runQuery({
      query: queries[exportQueries[entityName].query],
      schema,
      context,
    })
      .then(res => exportQueries[entityName].process(res.data)[entityName]);
  }
  return result;
};

export let dumpData = async (config, queries, client) => {
  let result = {};
  let exportQueries = config.export.queries;
  let entitiesNames = Object.keys(exportQueries);
  for (let i = 0, len = entitiesNames.length; i < len; i++) {
    let entityName = entitiesNames[i];
    result[entityName] = await client.query({
      query: queries[exportQueries[entityName].query],
    })
      .then(res => exportQueries[entityName].process(res.data)[entityName]);
  }
  return result;
};
