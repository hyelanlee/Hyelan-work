import Router from 'koa-router';
// import * as purchaseStatusListCtrl from '@api/purchase/purchaseStatusList/purchaseStatusList.ctrl';
import * as purchaseStorageCtrl from '@api/purchase/purchaseStorage/purchaseStorage.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';

const api = new Router();

api.get('/selectByList', checkLoggedIn, purchaseStorageCtrl.selectByList);
api.get('/selectByExchange', checkLoggedIn, purchaseStorageCtrl.selectByExchange);
api.get('/selectByDetailList', checkLoggedIn, purchaseStorageCtrl.selectByDetailList);
api.get('/selectByPrint1', checkLoggedIn, purchaseStorageCtrl.selectByPrint1);
api.get('/selectByPrint2', checkLoggedIn, purchaseStorageCtrl.selectByPrint2);
api.get('/searchBalJoo', checkLoggedIn, purchaseStorageCtrl.searchBalJoo);
api.get('/searchBalJooDetail', checkLoggedIn, purchaseStorageCtrl.searchBalJooDetail);
api.get('/searchPrice', checkLoggedIn, purchaseStorageCtrl.searchPrice);
api.get('/updatePrices', checkLoggedIn, purchaseStorageCtrl.updatePrices);

api.post('/updateByList', checkLoggedIn, purchaseStorageCtrl.updateByList);
api.post('/deleteByList', checkLoggedIn, purchaseStorageCtrl.deleteByList);
api.post('/deleteByItem', checkLoggedIn, purchaseStorageCtrl.deleteByItem);


export default api;
