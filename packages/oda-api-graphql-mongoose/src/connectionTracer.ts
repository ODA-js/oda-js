import { Logger } from 'oda-logger';
let logger = new Logger('db:connections');
import mongoose from 'mongoose';

let connections = 0;
let openConnections = 0;
let errorCount = 0;

export default () => {
  if (!mongoose.___createConnection) {
    mongoose.___createConnection = mongoose.createConnection;
    mongoose.createConnection = function() {
      let sl = new Error().stack.split('\n')[2];
      let conId = ++connections;
      let connection;
      connection = this.___createConnection.apply(this, arguments);

      logger.info(`created: state: ${connection.readyState}\nsource\n${sl}`);

      connection.on('connected', function() {
        logger.info(`connected: ${conId} opened: ${++openConnections}`);
      });

      connection.on('connecting', function() {
        logger.info(`connecting: ${conId}`);
      });

      connection.on('reconnected', function() {
        logger.info(`reconnected: ${conId}`);
      });

      connection.on('close', function() {
        logger.info(`closed: ${conId} opened ${--openConnections}`);
      });

      connection.on('error', function(err) {
        logger.error(
          `error: ${conId}, opened: ${openConnections}, 'errors: ${++errorCount}\n ${err}`,
        );
      });
      return connection;
    };
  }
};
