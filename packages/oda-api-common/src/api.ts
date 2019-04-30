// tslint:disable:no-unused-variable
import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import cors from 'cors';
import PrettyError from 'pretty-error';

const pretty = new PrettyError();

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

function logErrors(err, req, res, next) {
  pretty.render(err);
  next(err);
}

export class Server {
  public app: express.Application;
  public logger?: {
    name: string;
    path: string;
    level: any;
  };
  public service: {
    name?: string;
    description?: string;
    version?: string;
    binding: {
      host: string;
      port: number | string;
    };
    urls?: {
      src: string;
      dst: string;
    }[];
    statics?: {
      path: string;
      route: string;
    }[];
  };

  constructor(service, logger) {
    this.service = service;
    this.logger = logger;
    this.app = express();
    this.config();
    this.svc();
  }
  public svc() {
    this.app.use('/svc', (req, res) => {
      res.json(this.service);
    });
  }
  public config() {
    this.app.use(cors());
  }
  public async RegisterSvc() {
    return;
  }
  public initLogger() {
    if (this.logger) {
      let name = this.logger.name || this.service.name;
      let logFileName = path.join(
        this.logger.path || process.cwd(),
        `${name}.log`,
      );
      fs.ensureFileSync(logFileName);
    }
  }
  public initStatics() {
    if (!this.service.statics) {
      const root = path.relative(
        process.cwd(),
        path.resolve(__dirname, '../../../'),
      );
      this.app.use(express.static(path.join(root, 'static'))); //?????
    } else {
      for (let i = 0, len = this.service.statics.length; i < len; i++) {
        this.app.use(
          this.service.statics[i].route,
          express.static(this.service.statics[i].path),
        );
      }
    }
  }
  public errorHandling() {
    this.app.use(logErrors);
    this.app.use(clientErrorHandler);
    this.app.use(errorHandler);
  }
}
