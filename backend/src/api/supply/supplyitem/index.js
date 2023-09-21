import Router from 'koa-router';
import * as supplyItemCtrl from '@api/supply/supplyItem/supplyItem.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';

const api = new Router();

api.get('/selectByList', checkLoggedIn, supplyItemCtrl.selectByList);
api.get('/selectBySupNoList', checkLoggedIn, supplyItemCtrl.selectBySupNoList);
api.get('/selectBySupNoList2', checkLoggedIn, supplyItemCtrl.selectBySupNoList2);
api.get('/selectBySupplyList', checkLoggedIn, supplyItemCtrl.selectBySupplyList);
api.get('/calculateMiNap', checkLoggedIn, supplyItemCtrl.calculateMiNap);
api.get('/selectIsDelv', checkLoggedIn, supplyItemCtrl.selectIsDelv);
api.get('/countIncomplateSupplyList', checkLoggedIn, supplyItemCtrl.countIncomplateSupplyList);
api.get('/selectByPrint', checkLoggedIn, supplyItemCtrl.selectByPrint);
api.get('/convertMultiValues', checkLoggedIn, supplyItemCtrl.convertMultiValues);

api.post('/updateByList', checkLoggedIn, supplyItemCtrl.updateByList);
api.post('/deleteByItem', checkLoggedIn, supplyItemCtrl.deleteByItem);

export default api;
