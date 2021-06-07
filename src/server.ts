process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import validEnv from './utils/validEnv';
import App from './app';

validEnv();

const app = new App();

app.listen();