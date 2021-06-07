process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import validEnv from './utils/validEnv';
import IndexRoute from './routes/index.route';
import App from './app';

validEnv();

const app = new App([new IndexRoute()]);

app.listen();