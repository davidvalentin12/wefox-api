process.env["NODE_CONFIG_DIR"] = __dirname + "/configs";

import "dotenv/config";
import validEnv from "@/shared/utils/validEnv";
import IndexRoute from "@/modules/index/index.route";
import AuthRoute from "@/modules/auth/auth.route";
import UsersRoute from "@/modules/auth/users/users.route";
import App from "./app";

validEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute()]);

app.listen();
