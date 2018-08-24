import * as url from 'url';
import * as Sequelize from 'sequelize';
// session specific connection pool
export default class DbSequelizeConnectionPool {
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
    try {
      url.parse(conn);
    } catch (e) {
      return false;
    }
    return true;
  }

  public async release() {
    let list = this.dbConnectionList.slice(0);
    let db;
    for (let i = 0, len = list.length; i < len; i++) {
      db = list[i];
      if (db) {
        if (!(4 === db.readyState)) {
          await new Promise((res, rej) =>
            db.close(err => (err ? rej(err) : res())),
          );
        }
      }
    }
    this.dbPool.clear();
    this.dbConnectionList.length = 0;
  }

  private async isValid(db) {
    if (db.validate instanceof Function) {
      let valid = true;
      try {
        await db.validate(db);
      } catch (e) {
        valid = false;
      }
      return valid;
    } else {
      return db;
    }
  }

  public async remove(name: string) {
    let db;
    if (this.dbPool.has(name)) {
      db = this.dbPool.get(name);
      const valid = this.isValid(db);
      if (typeof valid === 'boolean') {
        if (valid) {
          await new Promise((res, rej) =>
            db.close(err => (err ? rej(err) : res())),
          );
        }
      } else {
        await new Promise((res, rej) =>
          db.close(err => (err ? rej(err) : res())),
        );
      }
      this.dbPool.delete(name);
    }
  }

  public set(name: string, connection: any) {
    this.dbPool.set(name, connection);
    this.dbConnectionList.push(connection);
  }

  public async createConnection(connection) {
    return new Promise((res, rej) => {
      try {
        let result = new Sequelize(connection);
        result
          .authenticate()
          .then(() => {
            res(result);
          })
          .catch(e => {
            rej(e);
          });
      } catch (err) {
        rej(err);
      }
    });
  }

  public async get(name: string, connection?: string) {
    if (this.dbPool.has(name)) {
      let db = this.dbPool.get(name);
      const valid = this.isValid(db);
      if (typeof valid === 'boolean') {
        if (valid) {
          return Promise.resolve(db);
        } else {
          await new Promise((res, rej) =>
            db.close(err => (err ? rej(err) : res())),
          );
          await this.remove(name);
        }
      } else {
        return Promise.resolve(db);
      }
    }

    let connectString = connection || this.defaultConnection;
    if (this.checkConnectionStringIsValid(connectString)) {
      let tryCount = 0;
      let hasError = false;
      let db;
      while (tryCount < this.maxRetry) {
        db = undefined;
        tryCount++;
        hasError = false;
        try {
          db = await this.createConnection(connectString);
        } catch (e) {
          console.log(e);
          hasError = true;
          await waitFor(this.maxRetryTime);
        }
        if (!hasError) {
          break;
        }
      }
      if (hasError) {
        return Promise.reject(new Error('max retry count exceed'));
      }
      if (db) {
        this.set(name, db);
        return Promise.resolve(db);
      } else {
        return Promise.reject(new Error(' unkonwn connection error'));
      }
    } else {
      return Promise.reject(new Error('invalid connection string'));
    }
  }
}

function waitFor(ms) {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  });
}

// в общем не все так просто, опыты показали, что соединения могут быть удалены мной из пула,
// но до сих пор поддерживать соединение с сервером.
// получается их надо как-то по другому закрывать.
// и начисто удалять, чтобы они не мешали серверу... посмотреть этот код
// там есть свои настройки сервера, с количеством повторов и прочее.
// но механизм поднятия нового соединения работает отлично.

// надо сделать промис на соединение поскольку оно все таки асинхронно выполняется...
