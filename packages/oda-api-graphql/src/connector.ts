export type CRUD = 'create' | 'read' | 'update' | 'remove';

import getLogger from 'oda-logger';

let transactionLogger = getLogger('connectors:transaction');

export interface Connector<T> {
  create: (org: T) => Promise<T>;
  findOneById: (id) => Promise<T>;
  findOneByIdAndUpdate: (id, payload: T) => Promise<T>;
  findOneByIdAndRemove: (id) => Promise<T>;
  secure: (action: CRUD, obj: { payload: T; source: any }) => T;
  getPayload: (obj: any, update?: boolean) => T;
  getCount: (args) => Promise<Number>;
  getList: (args, checkExtraCriteria?) => Promise<T[]>;
  sync: (args: { force?: boolean }) => Promise<void>;
  ensureId(obj: T): T;
}

export class RegisterConnectorsBase {
  public mongoose;
  public sequelize;

  public transaction: {
    commit: () => Promise<void>;
    abort: () => Promise<void>;
    session: {
      mongoose: any;
      sequelize: any;
    };
  };
  async ensureTransaction(options?) {
    transactionLogger.trace('ensure transaction');
    if (!this.transaction) {
      transactionLogger.trace('create transaction');
      const session = await this.mongoose.startSession();
      // const session = await this.sequelize.startSession();
      await session.startTransaction(options);
      this.transaction = {
        commit: async () => {
          if (this.transaction) {
            transactionLogger.trace('commit transaction');
            if (session.transaction.state === 'TRANSACTION_IN_PROGRESS') {
              await session.commitTransaction();
              await new Promise(res => session.endSession(() => res()));
            }
            delete this.transaction;
          } else {
            transactionLogger.trace('commit transaction');
          }
        },
        abort: async () => {
          if (this.transaction) {
            transactionLogger.trace('abort transaction');
            if (session.transaction.state === 'TRANSACTION_IN_PROGRESS') {
              await session.abortTransaction();
              await new Promise(res => session.endSession(() => res()));
            }
            delete this.transaction;
          } else {
            transactionLogger.trace('abort transaction');
          }
        },
        session: {
          mongoose: session,
          sequelize: undefined,
        },
      };
      return true;
    } else {
      transactionLogger.trace('use existing transaction');
      return false;
    }
  }
}
