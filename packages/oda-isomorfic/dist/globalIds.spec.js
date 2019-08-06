"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const globalIds_1 = require("./globalIds");
describe('globalId', () => {
    it('convert global id from global id', () => {
        const id = globalIds_1.toGlobalId('user', '1');
        const id2 = globalIds_1.toGlobalId('user', id);
        expect(id).toEqual(id2);
    });
    it('convert global id from id', () => {
        const id = globalIds_1.fromGlobalId('1').id;
        const id1 = globalIds_1.toGlobalId('user', '1');
        const id2 = globalIds_1.fromGlobalId(id1).id;
        expect(id).toEqual(id2);
    });
});
//# sourceMappingURL=globalIds.spec.js.map