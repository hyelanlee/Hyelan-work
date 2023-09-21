import Router from 'koa-router';
import * as orderToDelvCtrl from '@api/purchase/orderToDelv/orderToDelv.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';

const api = new Router();

api.get('/selectByList', checkLoggedIn, orderToDelvCtrl.selectByList);
api.get('/selectByDetailList', checkLoggedIn, orderToDelvCtrl.selectByDetailList);

api.post('/insertByList', checkLoggedIn, orderToDelvCtrl.insertByList);

export default api;
