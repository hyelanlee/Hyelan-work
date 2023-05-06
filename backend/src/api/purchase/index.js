import Router from 'koa-router';
import orderTodelv from '@api/purchase/orderTodelv';
import delv from '@api/purchase/delv';
import ksOrderLedger from '@api/purchase/ksOrderLedger';
import purchaseStatusList from '@api/purchase/purchaseStatusList';
import outsourcingDetail from '@api/purchase/outsourcingProcessingOrderDetail';
import purchaseStorage from '@api/purchase/purchaseStorage';
import nego from '@api/purchase/nego';
import orderMaterial from '@api/purchase/orderMaterial';

const api = new Router();

api.use('/ordertodelv', orderTodelv.routes());
api.use('/delv', delv.routes());
api.use('/ksorderledger', ksOrderLedger.routes());
api.use('/purchaseStatusList', purchaseStatusList.routes());
api.use('/outsourcingdetail', outsourcingDetail.routes());
api.use('/purchaseStorage', purchaseStorage.routes());
api.use('/nego', nego.routes());
api.use('/orderMaterial', orderMaterial.routes());


export default api;
