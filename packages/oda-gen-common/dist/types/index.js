"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stateOfField_1 = require("./stateOfField");
exports.StateOfFieldType = stateOfField_1.StateOfFieldType;
const stateOfConnection_1 = require("./stateOfConnection");
exports.StateOfConectionType = stateOfConnection_1.StateOfConectionType;
const pageInfo_1 = require("./pageInfo");
exports.PageInfoType = pageInfo_1.PageInfoType;
const date_1 = require("./date");
exports.DateType = date_1.DateType;
const id_1 = require("./id");
exports.IdType = id_1.IdType;
const imageSize_1 = require("./imageSize");
exports.ImageSizeType = imageSize_1.ImageSizeType;
const json_1 = require("./json");
exports.JSONType = json_1.JSONType;
const empty_1 = require("./empty");
exports.GQLModule = empty_1.GQLModule;
const mutationType_1 = require("./mutationType");
const whereBoolean_1 = require("./whereBoolean");
exports.WhereBoolean = whereBoolean_1.WhereBoolean;
const whereDate_1 = require("./whereDate");
exports.WhereDate = whereDate_1.WhereDate;
const whereFloat_1 = require("./whereFloat");
exports.WhereFloat = whereFloat_1.WhereFloat;
const whereID_1 = require("./whereID");
exports.WhereID = whereID_1.WhereID;
const whereInt_1 = require("./whereInt");
exports.WhereInt = whereInt_1.WhereInt;
const whereString_1 = require("./whereString");
exports.WhereString = whereString_1.WhereString;
const whereListOfStrings_1 = require("./whereListOfStrings");
exports.WhereListOfStrings = whereListOfStrings_1.WhereListOfStrings;
const whereMutationKind_1 = require("./whereMutationKind");
exports.WhereMutationKind = whereMutationKind_1.WhereMutationKind;
const whereJSON_1 = require("./whereJSON");
exports.WhereJSON = whereJSON_1.WhereJSON;
class DefaultTypes extends empty_1.GQLModule {
    constructor() {
        super(...arguments);
        this._name = 'DefaultTypes';
        this._composite = [
            new stateOfField_1.StateOfFieldType({}),
            new stateOfConnection_1.StateOfConectionType({}),
            new pageInfo_1.PageInfoType({}),
            new date_1.DateType({}),
            new id_1.IdType({}),
            new imageSize_1.ImageSizeType({}),
            new json_1.JSONType({}),
            new mutationType_1.MutationKindType({}),
            new whereBoolean_1.WhereBoolean({}),
            new whereDate_1.WhereDate({}),
            new whereFloat_1.WhereFloat({}),
            new whereID_1.WhereID({}),
            new whereInt_1.WhereInt({}),
            new whereString_1.WhereString({}),
            new whereListOfStrings_1.WhereListOfStrings({}),
            new whereMutationKind_1.WhereMutationKind({}),
            new whereJSON_1.WhereJSON({}),
        ];
    }
}
exports.DefaultTypes = DefaultTypes;
//# sourceMappingURL=index.js.map