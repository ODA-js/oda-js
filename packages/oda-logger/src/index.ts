import debug from 'debug';

enum logType {
  trace = 'trace',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal',
}

function tracer(name: string, type: logType) {
  const logger = debug(`${name}:${type}`);
  return logger;
}

export type Config<T extends void | Promise<any>> = {
  trace?: (name: string, type: logType) => T;
  debug?: (name: string, type: logType) => T;
  info?: (name: string, type: logType) => T;
  warn?: (name: string, type: logType) => T;
  error?: (name: string, type: logType) => T;
  fatal?: (name: string, type: logType) => T;
};

export class Logger<T extends void | Promise<any>> {
  constructor(name: string, config?: Config<T>) {
    if (config) {
      this.trace = config.trace ? config.trace : tracer(name, logType.trace);
      this.debug = config.debug ? config.debug : tracer(name, logType.debug);
      this.info = config.info ? config.info : tracer(name, logType.info);
      this.warn = config.warn ? config.warn : tracer(name, logType.warn);
      this.error = config.error ? config.error : tracer(name, logType.error);
      this.fatal = config.fatal ? config.fatal : tracer(name, logType.fatal);
    } else {
      this.trace = tracer(name, logType.trace);
      this.debug = tracer(name, logType.debug);
      this.info = tracer(name, logType.info);
      this.warn = tracer(name, logType.warn);
      this.error = tracer(name, logType.error);
      this.fatal = tracer(name, logType.fatal);
    }
  }
  public trace: (obj: any) => T;
  public debug: (obj: any) => T;
  public info: (obj: any) => T;
  public warn: (obj: any) => T;
  public error: (obj: any) => T;
  public fatal: (obj: any) => T;
}

export default function<T extends void | Promise<any>>(
  name: string,
  config?: Config<T>,
) {
  return new Logger<T>(name, config);
}
