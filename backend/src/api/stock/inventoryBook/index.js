import Router from 'koa-router';
import * as inventoryBookCtrl from '@api/stock/inventoryBook/inventoryBook.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';

const api = new Router();

api.get('/selectByList10',       checkLoggedIn, inventoryBookCtrl.selectByList10);
api.get('/selectByList1_1',       checkLoggedIn, inventoryBookCtrl.selectByList1_1);
api.get('/selectByList11',       checkLoggedIn, inventoryBookCtrl.selectByList11);
api.get('/selectByList12',       checkLoggedIn, inventoryBookCtrl.selectByList12);
api.get('/selectByList13',       checkLoggedIn, inventoryBookCtrl.selectByList13);
api.get('/selectByList15',       checkLoggedIn, inventoryBookCtrl.selectByList15);
api.get('/selectByList17',       checkLoggedIn, inventoryBookCtrl.selectByList17);
api.get('/selectByDetailList10',       checkLoggedIn, inventoryBookCtrl.selectByDetailList10);
api.get('/selectByDetailList14',       checkLoggedIn, inventoryBookCtrl.selectByDetailList14);
api.get('/selectByDetailList15',       checkLoggedIn, inventoryBookCtrl.selectByDetailList15);
api.get('/selectByDetailList16',       checkLoggedIn, inventoryBookCtrl.selectByDetailList16);
api.get('/selectByDetailList17',       checkLoggedIn, inventoryBookCtrl.selectByDetailList17);
api.get('/selectByDetailList11',       checkLoggedIn, inventoryBookCtrl.selectByDetailList11);
// api.post('/copyGetQty',      checkLoggedIn, stockModifyCtrl.copyGetQty);


export default api;
