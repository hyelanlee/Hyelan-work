import { dbPool } from "@lib/db";
import winston from '@root/winston';
import sql from 'mssql';
import moment from 'moment';

export const selectByList = async ctx => {
  const { SchAccunit, SchFactory, SchCustCd, SchFrDate, SchToDate, SchDelvYn  } = ctx.request.query;
    if (!SchAccunit) {
      ctx.status = 500;
      return;
    }
    try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iTag', 'H')
      .input('iAccunit', SchAccunit)
      .input('iFactory', SchFactory)
      .input('iCustCd', SchCustCd)
      .input('iFrDate', SchFrDate)
      .input('iToDate', SchToDate)
      .input('iGubun', SchDelvYn)
      .output('SupNo')
      .output('ErrMess')      
      .execute('SC_OrderToDelv');
  
      const rtn = result.recordset;
      rtn.forEach((el) => {
        el.SupplyDate = moment(el.SupplyDate).format('YYYY-MM-DD')
      })
      if(!rtn || rtn.length === 0){
        ctx.body = null;
      } else {
        ctx.body = rtn;
      }
    } catch (e) {
      winston.error(e.message);
      ctx.throw(500, e);
    }
}

export const selectByDetailList = async ctx => {
  const { SupNo, CustCd, SchAccunit, SchFactory } = ctx.request.query;
  if (!SupNo) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'D')
    .input('iAccunit', SchAccunit)
    .input('iFactory', SchFactory)
    .input('iCustCd', CustCd)
    .input('iSupNo', SupNo)
    .output('SupNo')
    .output('ErrMess')      
    .execute('SC_OrderToDelv');
    const rtn = result.recordset;

    if(!rtn || rtn.length === 0){
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const insertByList = async ctx => {
  const { header, detail } = ctx.request.body;
  if (!detail) {
    ctx.status = 500;
    return;
  }
  const OrderToDelv = fOrderToDelv(detail);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'I')
    .input('iPno', header.SchPno)
    .input('iDeptCd', header.DeptCd)
    .input('iAccunit', header.SchAccunit)
    .input('iFactory', header.SchFactory)
    .input('OrderToDelv', OrderToDelv)
    .output('SupNo')
    .output('ErrMess')      
    .execute('SC_OrderToDelv');
    const output = result.output;
    if (output) {
      if (output.ErrMess != '' && output.ErrMess !== null) {
        ctx.body = {errmess: output.ErrMess, SupNo: output.SupNo};
        return;
      } 
      ctx.body = {errmess: '', SupNo: output.SupNo}
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }

}

const fOrderToDelv = (item) => {
  const OrderToDelv = new sql.Table();

    OrderToDelv.columns.add('CustCd', sql.NVarChar(5));
    OrderToDelv.columns.add('SupNo', sql.NVarChar(12));
    OrderToDelv.columns.add('SupplyDate', sql.NVarChar(8));
    OrderToDelv.columns.add('SupplyDa', sql.NVarChar(6));
    OrderToDelv.columns.add('VatCd', sql.NVarChar(6));
    OrderToDelv.columns.add('No', sql.Int);

    for (const [i, row] of item.entries()) {
      OrderToDelv.rows.add(
        row.CustCd      ? row.CustCd : '',
        row.SupNo       ? row.SupNo : '',
        row.SupplyDate  ? moment(row.SupplyDate).format('YYYYMMDD') : '',
        row.SupplyDate  ? moment(row.SupplyDate).format('YYYYMM') : '',
        row.VatCd       ? row.VatCd : '',
        i               ? i : 0,
      )
    }
    return OrderToDelv;
    
}