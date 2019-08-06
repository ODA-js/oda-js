"use strict";
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const oda_logger_1 = __importDefault(require("oda-logger"));
let logger = oda_logger_1.default('oda-api-graphql:api:iterator');
require('core-js/modules/es7.symbol.async-iterator');
function iterate(getData, limit) {
    return __asyncGenerator(this, arguments, function* iterate_1() {
        logger.trace('iterate:limit %d', limit);
        let i = 0;
        while (true) {
            logger.trace('iterate:iterate %d', i);
            let res = yield __await(getData(i, limit));
            if (Array.isArray(res) && res.length > 0) {
                logger.trace('iterate:step %o', i);
                logger.trace('iterate:data %o', res);
                yield yield __await(res);
                i++;
                if (res.length < limit) {
                    return yield __await(void 0);
                }
            }
            else {
                logger.trace('stop');
                break;
            }
        }
    });
}
exports.iterate = iterate;
function forward(getData, limit) {
    return __asyncGenerator(this, arguments, function* forward_1() {
        var e_1, _a;
        logger.trace('forward %d', limit);
        try {
            for (var _b = __asyncValues(iterate(getData, limit)), _c; _c = yield __await(_b.next()), !_c.done;) {
                let i = _c.value;
                logger.trace('forward:iterate %o', i);
                yield __await(yield* __asyncDelegator(__asyncValues(i)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.forward = forward;
//# sourceMappingURL=listIterator.js.map