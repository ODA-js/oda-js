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
const oda_logger_1 = __importDefault(require("oda-logger"));
let transactionLogger = oda_logger_1.default('connectors:transaction');
class RegisterConnectorsBase {
    ensureTransaction(options) {
        return __awaiter(this, void 0, void 0, function* () {
            transactionLogger.trace('ensure transaction');
            if (!this.transaction) {
                transactionLogger.trace('create transaction');
                const session = yield this.mongoose.startSession();
                yield session.startTransaction(options);
                this.transaction = {
                    commit: () => __awaiter(this, void 0, void 0, function* () {
                        if (this.transaction) {
                            transactionLogger.trace('commit transaction');
                            if (session.transaction.state === 'TRANSACTION_IN_PROGRESS') {
                                yield session.commitTransaction();
                                yield new Promise(res => session.endSession(() => res()));
                            }
                            delete this.transaction;
                        }
                        else {
                            transactionLogger.trace('commit transaction');
                        }
                    }),
                    abort: () => __awaiter(this, void 0, void 0, function* () {
                        if (this.transaction) {
                            transactionLogger.trace('abort transaction');
                            if (session.transaction.state === 'TRANSACTION_IN_PROGRESS') {
                                yield session.abortTransaction();
                                yield new Promise(res => session.endSession(() => res()));
                            }
                            delete this.transaction;
                        }
                        else {
                            transactionLogger.trace('abort transaction');
                        }
                    }),
                    session: {
                        mongoose: session,
                        sequelize: undefined,
                    },
                };
                return true;
            }
            else {
                transactionLogger.trace('use existing transaction');
                return false;
            }
        });
    }
}
exports.RegisterConnectorsBase = RegisterConnectorsBase;
//# sourceMappingURL=connector.js.map