import { cleanEnv, port, str } from 'envalid';

const validEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
  });
};

export default validEnv;
