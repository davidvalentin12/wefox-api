process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

import express from "express";
import Route from "./interfaces/routes.interface";
import { dbConnection } from "./database";
import { connect, set } from "mongoose";
import { logger } from "./utils/logger";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;

  constructor(routes: Route[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || "development";

    this.initializeDBConnection();
    this.initializeRoutes(routes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`########################################################`);
      logger.info(
        `App RUNNING - Listening on port: ${this.port} - ENV: ${this.env}`
      );
      logger.info(`########################################################`);
    });
  }

  private async initializeDBConnection() {
    if (this.env !== "production") {
      set("debug", true);
    }

    try {
      await connect(dbConnection.url, dbConnection.options);
      logger.info(`Succesfully connected to DataBase`);
    } catch (err) {
      logger.error(`############################`);
      logger.error("Error connecting to DataBase");
      logger.error(`############################`);
      throw err;
    }
  }

  private initializeRoutes(routes: Route[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
}

export default App;
