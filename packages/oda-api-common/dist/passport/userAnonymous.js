"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oda_api_graphql_1 = require("oda-api-graphql");
exports.default = () => ({
    id: oda_api_graphql_1.toGlobalId('User', '000000000000000000000000'),
    userName: 'ANONYMOUS',
    isAnonymous: true,
    owner: oda_api_graphql_1.toGlobalId('User', '000000000000000000000000'),
    enabled: true,
    profileName: 'public',
});
//# sourceMappingURL=userAnonymous.js.map