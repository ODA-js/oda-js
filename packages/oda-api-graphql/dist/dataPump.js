"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_anywhere_1 = require("graphql-anywhere");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
require('isomorphic-fetch');
function decapitalize(name) {
    return name[0].toLowerCase() + name.slice(1);
}
exports.decapitalize = decapitalize;
function processItems({ data, findQuery, createQuery, updateQuery, dataPropName, findVars, queries, }, client) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0, len = data.length; i < len; i++) {
            const keys = Object.keys(findVars);
            let variables;
            let key;
            let res;
            for (let k = 0, kLen = keys.length; k < kLen; k++) {
                key = keys[k];
                variables = findVars[key](data[i]);
                if (variables) {
                    res = yield client.query({
                        query: queries[findQuery[key]],
                        variables,
                    });
                    if (res.data[dataPropName]) {
                        break;
                    }
                }
            }
            if (!(res && res.data[dataPropName])) {
                yield client.mutate({
                    mutation: queries[createQuery],
                    variables: {
                        [dataPropName]: data[i],
                    },
                });
            }
            else {
                yield client.mutate({
                    mutation: queries[updateQuery],
                    variables: {
                        [dataPropName]: data[i],
                    },
                });
            }
        }
    });
}
function processItemsDirect({ data, findQuery, createQuery, updateQuery, dataPropName, findVars, queries, }, schema, context, runQuery) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0, len = data.length; i < len; i++) {
            const keys = Object.keys(findVars);
            let variables;
            let key;
            let res;
            for (let k = 0, kLen = keys.length; k < kLen; k++) {
                key = keys[k];
                variables = findVars[key](data[i]);
                if (variables) {
                    res = yield runQuery({
                        document: queries[findQuery[key]],
                        variableValues: variables,
                        schema,
                        contextValue: context,
                    });
                    if (res.data[dataPropName]) {
                        break;
                    }
                }
            }
            if (!(res && res.data[dataPropName])) {
                yield runQuery({
                    document: queries[createQuery],
                    variableValues: {
                        [dataPropName]: data[i],
                    },
                    schema,
                    contextValue: context,
                });
            }
            else {
                yield runQuery({
                    document: queries[updateQuery],
                    variableValues: {
                        [dataPropName]: data[i],
                    },
                    schema,
                    contextValue: context,
                });
            }
        }
    });
}
exports.restoreDataDirect = (importQueries, queries, data, schema, context, runQuery) => __awaiter(this, void 0, void 0, function* () {
    let entitiesNames = Object.keys(importQueries);
    for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
        let entityName = entitiesNames[iEnt];
        let fields = importQueries[entityName].filter
            ? graphql_anywhere_1.filter(graphql_tag_1.default `{ ${entityName} ${importQueries[entityName].filter} }`, data)
            : data;
        let uploader = Object.assign({ findQuery: `${entityName}/findById.graphql`, createQuery: `${entityName}/create.graphql`, updateQuery: `${entityName}/update.graphql`, dataPropName: `${decapitalize(entityName)}`, findVars: f => ({ id: f.id }) }, importQueries[entityName].uploader);
        if (fields.hasOwnProperty(entityName) &&
            Array.isArray(fields[entityName]) &&
            fields[entityName].length > 0) {
            yield processItemsDirect(Object.assign({ data: fields[entityName] }, uploader, { queries: queries }), schema, context, runQuery);
        }
    }
});
exports.restoreData = (importQueries, queries, client, data) => __awaiter(this, void 0, void 0, function* () {
    let entitiesNames = Object.keys(importQueries);
    for (let iEnt = 0, iEntLen = entitiesNames.length; iEnt < iEntLen; iEnt++) {
        let entityName = entitiesNames[iEnt];
        let fields = importQueries[entityName].filter
            ? graphql_anywhere_1.filter(graphql_tag_1.default `{ ${entityName} ${importQueries[entityName].filter} }`, data)
            : data;
        let uploader = Object.assign({ findQuery: `${entityName}/findById.graphql`, createQuery: `${entityName}/create.graphql`, updateQuery: `${entityName}/update.graphql`, dataPropName: `${decapitalize(entityName)}`, findVars: f => ({ id: f.id }) }, importQueries[entityName].uploader);
        if (fields.hasOwnProperty(entityName) &&
            Array.isArray(fields[entityName]) &&
            fields[entityName].length > 0) {
            yield processItems(Object.assign({ data: fields[entityName] }, uploader, { queries: queries }), client);
        }
    }
});
exports.dumpDataDirect = (config, queries, schema, context, runQuery) => __awaiter(this, void 0, void 0, function* () {
    let result = {};
    let exportQueries = config.export.queries;
    let entitiesNames = Object.keys(exportQueries);
    for (let i = 0, len = entitiesNames.length; i < len; i++) {
        let entityName = entitiesNames[i];
        result = Object.assign({}, result, (yield runQuery({
            document: queries[exportQueries[entityName].query],
            schema,
            contextValue: context,
        }).then(res => {
            if (exportQueries[entityName].process) {
                return exportQueries[entityName].process(res.data)[entityName];
            }
            else {
                return res.data;
            }
        })));
    }
    return result;
});
exports.dumpData = (config, queries, client) => __awaiter(this, void 0, void 0, function* () {
    let result = {};
    let exportQueries = config.export.queries;
    let entitiesNames = Object.keys(exportQueries);
    for (let i = 0, len = entitiesNames.length; i < len; i++) {
        let entityName = entitiesNames[i];
        result = Object.assign({}, result, (yield client
            .query({
            query: queries[exportQueries[entityName].query],
        })
            .then(res => {
            if (exportQueries[entityName].process) {
                return exportQueries[entityName].process(res.data)[entityName];
            }
            else {
                return res.data;
            }
        })));
    }
    return result;
});
//# sourceMappingURL=dataPump.js.map