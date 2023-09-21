import Router from 'koa-router';
import * as orderMaterialCtrl from '@api/purchase/orderMaterial/orderMaterial.ctrl';
import * as materialSPanelCtrl from '@api/purchase/orderMaterial/materialSearchPanel.ctrl';
import checkLoggedIn from '@lib/checkLoggedIn';


const api = new Router();

api.get('/selectByList', checkLoggedIn, orderMaterialCtrl.selectByList);
api.get('/selectByDetailList', checkLoggedIn, orderMaterialCtrl.selectByDetailList);
api.post('/deleteByItem', checkLoggedIn, orderMaterialCtrl.deleteByItem);
api.post('/deleteByList', checkLoggedIn, orderMaterialCtrl.deleteByList);
api.post('/updateByList', checkLoggedIn, orderMaterialCtrl.updateByList);
api.get('/print01', checkLoggedIn, orderMaterialCtrl.print01);
api.get('/print02', checkLoggedIn, orderMaterialCtrl.print02);
api.get('/print03', checkLoggedIn, orderMaterialCtrl.print03);
api.get('/findGoodPrice', checkLoggedIn, orderMaterialCtrl.findGoodPrice);
api.get('/findGoodPrice2', checkLoggedIn, orderMaterialCtrl.findGoodPrice2);
api.get('/searchConvertValue', checkLoggedIn, orderMaterialCtrl.searchConvertValue);
api.get('/cancelChargeNo', checkLoggedIn, orderMaterialCtrl.cancelChargeNo);
api.get('/findIfChargenoEligible', checkLoggedIn, orderMaterialCtrl.findIfChargenoEligible);
api.get('/findChargeNo', checkLoggedIn, orderMaterialCtrl.findChargeNo);
api.get('/findNsaveChargeNo', checkLoggedIn, orderMaterialCtrl.findNsaveChargeNo);
// api.get('/search', checkLoggedIn, materialSPanelCtrl.search);
// api.get('/itemSeparate', checkLoggedIn, materialSPanelCtrl.itemSeparate);

export default api;
