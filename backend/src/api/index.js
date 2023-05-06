import Router from 'koa-router';
import auth from '@api/auth';
import business from '@api/business';
import product from '@api/product';
import purchase from '@api/purchase';
import expense from '@api/expense';
import stock from '@api/stock';
import technology from '@api/technology';
import quality from '@api/quality';
import order from '@api/order';
import viewer from '@api/viewer';
import admin from '@api/admin';
import common from '@api/common';

const api = new Router();

api.use('/auth', auth.routes());
api.use('/business', business.routes());
api.use('/product', product.routes());
api.use('/purchase', purchase.routes());
api.use('/expense', expense.routes());
api.use('/stock', stock.routes());
api.use('/technology', technology.routes());
api.use('/quality', quality.routes());
api.use('/order', order.routes());
api.use('/viewer', viewer.routes());
api.use('/admin', admin.routes());
api.use('/common', common.routes());

export default api;
