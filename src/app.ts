process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import express from 'express';
import Route from './interfaces/route';
import { logger } from './utils/logger';

class App {
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor() {
        console.log(process.env.port)
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV || 'development';
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`########################################################`);
            logger.info(`App RUNNING - Listening on port: ${this.port} - ENV: ${this.env}`);
            logger.info(`########################################################`);
        });
      }
}

export default App;