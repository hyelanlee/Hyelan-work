import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import mount from 'koa-mount';
import api from './api';
import jwtMiddleware from '@lib/jwtMiddleware';
import env from '@root/config.json';
import winston from '@root/winston';

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/@api', api.routes());

// 라우터 적용 전에 bodyParser 적용
app.use(
  bodyParser({
    jsonLimit: '3mb',
    formLimit: '3mb',
    textLimit: '3mb',
  }),
);
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.use(mount('/@files', serve(env.FILE_UPLOAD_PATH)));

const port = env.PORT || 5005;
if (env.PROFILE === 'PROD') {
  app.listen(port, () => {
    winston.info(`Server Starting...  Listening to port ${port}`);
  });
} else {
  winston.info(`Server Starting...  Listening to port ${port}`);
}

export const viteNodeApp = app;
