import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import config from './config/index';
import appRoutes from './routes';

const app = new Koa();
const router = new Router();

appRoutes.forEach(route => router[route.method](route.path, route.action));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));
