import config from 'config';
import { DBConfig } from '@/shared/interfaces/db.interface';

const { host, port, database }: DBConfig = config.get('DBConfig');

export const dbConnection = {
  url: `mongodb://${host}:${port}/${database}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
