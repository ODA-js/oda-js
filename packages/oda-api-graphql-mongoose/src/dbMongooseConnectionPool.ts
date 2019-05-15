import getLogger from 'oda-logger';
import mongoose from 'mongoose';
// hack to remove error from typescript
let p = 'Promise';
mongoose[p] = global.Promise;

import muri from 'muri';
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

let logger = getLogger('oda-api-graphql:db-connection-pool');
// session specific connection pool
export default class DbMongooseConnectionPool {
  public defaultConnection: string;
  public dbPool = new Map<string, any>();
  public dbConnectionList = [];
  public maxRetry = 10;
  public maxRetryTime = 100;

  constructor(args: {
    defaultUrl: string;
    maxRetry?: number;
    maxRetryTime?: number;
  }) {
    logger.trace('constructor');
    if (this.checkConnectionStringIsValid(args.defaultUrl)) {
      this.defaultConnection = args.defaultUrl;
    }

    if (args.maxRetry && args.maxRetry > 3) {
      this.maxRetry = args.maxRetry;
    }

    if (args.maxRetryTime && args.maxRetryTime > 100) {
      this.maxRetryTime = args.maxRetryTime;
    }
  }

  public checkConnectionStringIsValid(conn) {
    logger.trace('checkConnectionStringIsValid');
    try {
      muri(conn);
    } catch (e) {
      logger.error('checkConnectionStringIsValid:invalid');
      return false;
    }
    return true;
  }

  public async release() {
    logger.trace('release');
    let list = this.dbConnectionList.slice(0);
    let db;
    for (let i = 0, len = list.length; i < len; i++) {
      db = list[i];
      if (db) {
        if (!(4 === db.readyState)) {
          await db.close();
          logger.trace(`close ${i}`);
        } else {
          logger.trace(`already closed ${i}`);
        }
      }
    }
    this.dbPool.clear();
    this.dbConnectionList.length = 0;
  }

  public async remove(name: string) {
    let db;
    if (this.dbPool.has(name)) {
      logger.trace(`remove ${name}`);
      db = this.dbPool.get(name);
      if (!(99 === db.readyState || 0 === db.readyState)) {
        await new Promise((res, rej) =>
          db.close(err => (err ? rej(err) : res())),
        );
        logger.trace(`close ${name}`);
      }
      this.dbPool.delete(name);
      logger.trace(`delete ${name}`);
    }
  }

  public set(name: string, connection: any) {
    logger.trace(`set ${name}`);
    this.dbPool.set(name, connection);
    this.dbConnectionList.push(connection);
  }

  public async createConnection(connection) {
    logger.trace(`createConnection ${connection}`);
    return new Promise((res, rej) => {
      try {
        let result = mongoose.createConnection(connection, err => {
          if (err) {
            rej(err);
          } else {
            res(result);
          }
        });
      } catch (err) {
        rej(err);
      }
    });
  }

  /*
  STATES[disconnected] = 0;
  STATES[connected] = 1;
  STATES[connecting] = 2;
  STATES[disconnecting] = 3;
  STATES[unauthorized] = 4;
  STATES[uninitialized] = 99;
   */

  public async get(name: string, connection?: string) {
    logger.trace(`get ${name} ${connection}`);
    if (this.dbPool.has(name)) {
      let db = this.dbPool.get(name);
      if (!(4 === db.readyState)) {
        logger.trace(`existing one for ${name} ${connection}`);
        return Promise.resolve(db);
      } else {
        logger.trace(`close inconsistent ${name} ${connection}`);
        await this.remove(name);
      }
    }

    let connectString = connection || this.defaultConnection;
    if (this.checkConnectionStringIsValid(connectString)) {
      let tryCount = 0;
      let hasError = false;
      let db;
      while (tryCount < this.maxRetry) {
        logger.trace(`try ${tryCount}`);
        db = undefined;
        tryCount++;
        hasError = false;
        try {
          db = await this.createConnection(connectString);
        } catch (e) {
          logger.error(e);
          hasError = true;
          await waitFor(this.maxRetryTime);
        }
        if (!hasError) {
          logger.trace(`done ${tryCount}`);
          break;
        }
      }
      if (hasError) {
        logger.error(`max retry count exceed ${this.maxRetry}`);
        return Promise.reject(new Error('max retry count exceed'));
      }
      if (db) {
        this.set(name, db);
        return Promise.resolve(db);
      } else {
        logger.error('unkonwn connection error');
        return Promise.reject(new Error('unkonwn connection error'));
      }
    } else {
      logger.error('invalid connection string');
      return Promise.reject(new Error('invalid connection string'));
    }
  }
}

function waitFor(ms) {
  return new Promise((res, rej) => {
    logger.error(`waitFor ${ms}`);
    setTimeout(res, ms);
  });
}

// в общем не все так просто, опыты показали, что соединения могут быть удалены мной из пула,
// но до сих пор поддерживать соединение с сервером.
// получается их надо как-то по другому закрывать.
// и начисто удалять, чтобы они не мешали серверу... посмотреть этот код
// там есть свои настройки сервера, с количеством повторов и прочее.
// но механизм поднятия нового соединения работает отлично.

// надо сделать promise на соединение поскольку оно все таки асинхронно выполняется...
