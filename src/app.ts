import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { createConnection } from 'typeorm';

import config from './config/config';
import appRoutes from './routes';

const bootstrap = async (): Promise<void> => {
  const app = new Koa();
  const router = new Router();

  appRoutes.forEach(route => router[route.method](route.path, route.action));
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(bodyParser());

  app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));
};

createConnection()
  .then(bootstrap)
  .catch(console.error);
