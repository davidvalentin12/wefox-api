process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import validEnv from '@/shared/utils/validEnv';
import IndexRoute from '@/modules/index/index.route';
import AuthRoute from '@/modules/auth/auth.route';
import AddressesRoute from '@/modules/addresses/addresses.route';
import App from './app';

validEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new AddressesRoute()]);

app.listen();
