"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_api_graphql_1 = require("oda-api-graphql");
exports.default = () => ({
    id: oda_api_graphql_1.toGlobalId('User', 'ffffffffffffffffffffffff'),
    userName: 'SYSTEM',
    isSystem: true,
    owner: oda_api_graphql_1.toGlobalId('Organization', 'ffffffffffffffffffffffff'),
    enabled: true,
    profileName: 'system',
});
//# sourceMappingURL=userSystem.js.map