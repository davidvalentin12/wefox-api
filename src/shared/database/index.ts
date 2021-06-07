import config from "config";
import { dbConfig } from "@/shared/interfaces/db.interface";

const { host, port, database }: dbConfig = config.get("dbConfig");

export const dbConnection = {
  url: `mongodb://${host}:${port}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
