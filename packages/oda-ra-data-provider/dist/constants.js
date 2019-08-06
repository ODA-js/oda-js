"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionType = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    CLONE: 'CLONE',
    USE: 'USE',
    UNLINK: 'UNLINK',
};
exports.GET_LIST = 'GET_LIST';
exports.GET_ONE = 'GET_ONE';
exports.GET_MANY = 'GET_MANY';
exports.GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
exports.CREATE = 'CREATE';
exports.UPDATE = 'UPDATE';
exports.DELETE = 'DELETE';
exports.QUERY_TYPES = [
    exports.GET_LIST,
    exports.GET_MANY,
    exports.GET_MANY_REFERENCE,
    exports.GET_ONE,
];
exports.MUTATION_TYPES = [exports.CREATE, exports.UPDATE, exports.DELETE];
exports.ALL_TYPES = exports.QUERY_TYPES.concat(exports.MUTATION_TYPES);
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "Asc";
    SortOrder["DESC"] = "Desc";
})(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
//# sourceMappingURL=constants.js.map