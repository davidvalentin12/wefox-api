process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import express from 'express';
import Route from '@/shared/interfaces/routes.interface';
import { dbConnection } from '@/shared/database';
import { connect, set } from 'mongoose';
import { logger, stream } from '@/shared/utils/logger';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import errorMiddleware from '@/shared/middlewares/error.middleware';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || 'development';

    this.initializeDBConnection();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info('########################################################');
      logger.info(
        `App RUNNING - Listening on port: ${this.port} - ENV: ${this.env}`
      );
      logger.info('########################################################');
    });
  }

  private async initializeDBConnection() {
    if (this.env !== 'production') {
      set('debug', true);
    }
    
    try {
      await connect(dbConnection.url, dbConnection.options);
    } catch (err) {
      logger.error('############################');
      logger.error('Error connecting to DataBase');
      logger.error('############################');
      logger.error(err)
      throw err;
    }
  }

  private initializeMiddlewares() {
    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'valentinmohring.com', credentials: true }));
    } else {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'Wefox API',
          version: '1.0.0',
          description: 'Swagger docs',
        },
      },
      apis: ['./src/**/*.swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);

    this.app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(specs, { explorer: true })
    );
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use('/', route.router);
    });
  }
}

export default App;
