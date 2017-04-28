import DbPool from './../dbMongooseConnectionPool';
import * as config from 'config';

// tslint:disable-next-line:no-var-keyword
var dbPool;

export function initPool() {
  if (!dbPool) {
    dbPool = new DbPool({ defaultUrl: config.get<string>('db.api.url') });
  }
}

export const createDbPool = (defaultUrl) => (req, res, next) => {
  if (req.dbPool && !(req.dbPool instanceof DbPool)) {
    next();
  } else if (req.dbPool && req.dbPool instanceof DbPool) {
    next();
  } else {
    let pool = req.dbPool = new DbPool({ defaultUrl });
    res.on('finish', () => {
      pool.release();
    });
    next();
  }
};

export const staticDbPool = (req, res, next) => {
  if (req.dbPool && !(req.dbPool instanceof DbPool)) {
    next();
  } else if (req.dbPool && req.dbPool instanceof DbPool) {
    next();
  } else {
    req.dbPool = dbPool;
    next();
  }
};
