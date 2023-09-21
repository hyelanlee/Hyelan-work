import Router from 'koa-router';
import * as qcDelvCtrl from '@api/quality/qcDelv/qcDelv.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';

const api = new Router();

api.get('/selectByList', checkLoggedIn, qcDelvCtrl.selectByList);
api.post('/updateByList', checkLoggedIn, qcDelvCtrl.updateByList);
api.post('/updateByDelete', checkLoggedIn, qcDelvCtrl.updateByDelete);

export default api;
