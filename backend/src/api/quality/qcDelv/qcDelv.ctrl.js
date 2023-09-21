import { dbPool } from "@lib/db";
import winston from '@root/winston';
import sql from 'mssql';
import moment from 'moment';

export const selectByList = async ctx => {
  const {SchAccunit, SchFactory, SchQcComplate, SchFrDate, SchToDate, SchSupNo, SchCustCd  } = ctx.request.query;
  // console.log('item', SchQcComplate);
    if (!SchAccunit) {
      ctx.status = 500;
      return;
    }
    try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iTag', 'Q')
      .input('iAccunit', SchAccunit)
      .input('iFactory', SchFactory)
      .input('iFrDate', SchFrDate)
      .input('iToDate', SchToDate)
      .input('iSupNo', SchSupNo)
      .input('iGuBun', SchQcComplate)
      .input('iCustCd', SchCustCd)
      .output('SupNo')
      .output('ErrMess')      
      .execute('Sc_QcDelv');
  
      const rtn = result.recordset;
      // console.log('rtnnn', rtn);
      rtn.forEach((el) => {
        el.SupplyDate = moment(el.SupplyDate).format('YYYY-MM-DD')
        if (el.QcDate) {
          el.QcDate = moment(el.QcDate).format('YYYY-MM-DD')
        } else el.QcDate = '';
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

export const updateByList = async ctx => {
  const { header, detail } = ctx.request.body;
  // console.log('hel detail', detail);
  if (!detail) {
    ctx.status = 500;
    return;
  }
  const TSupplyItemQc = fTSupplyItemQc(detail);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'I')
    .input('iAccunit', header.SchAccunit)
    .input('iFactory', header.SchFactory)
    .input('iPno', header.SchPno)
    .input('TSupplyItemQc', TSupplyItemQc)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_QcDelv');
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

export const updateByDelete = async ctx => {
  const { header, detail } = ctx.request.body;
  // console.log('hel detail', detail);
  if (!detail) {
    ctx.status = 500;
    return;
  }
  const TSupplyItemQc = fTSupplyItemQc(detail);
  console.log('tsupplyitemqc', TSupplyItemQc);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'D')
    .input('iAccunit', header.SchAccunit)
    .input('iFactory', header.SchFactory)
    .input('iPno', header.SchPno)
    .input('TSupplyItemQc', TSupplyItemQc)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_QcDelv');
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

const fTSupplyItemQc = (item) => {
  const TSupplyItemQc = new sql.Table();

TSupplyItemQc.columns.add('CustCd', sql.NVarChar(5));
TSupplyItemQc.columns.add('SupNo', sql.NVarChar(12));
TSupplyItemQc.columns.add('SupSeq', sql.NVarChar(3));
TSupplyItemQc.columns.add('Su', sql.Numeric(18, 5));
TSupplyItemQc.columns.add('Qty', sql.Numeric(18, 5));
TSupplyItemQc.columns.add('QcDate', sql.NVarChar(8));
TSupplyItemQc.columns.add('QcOkQty', sql.Numeric(18, 5));
TSupplyItemQc.columns.add('QcErrorQty', sql.Numeric(18, 5));
TSupplyItemQc.columns.add('QcErrorDesc', sql.NVarChar(6));

for (const row of item) {
  TSupplyItemQc.rows.add(
    row.CustCd ? row.CustCd : '',
    row.SupNo ? row.SupNo : '',
    row.SupSeq ? row.SupSeq : '',
    row.Su ? row.Su : 0,
    row.Qty ? row.Qty : 0,
    row.QcDate ? row.QcDate : '',
    row.QcOkQty ? row.QcOkQty : 0,
    row.QcErrorQty ? row.QcErrorQty : 0,
    row.QcErrorDesc ? row.QcErrorDesc : '',
  )
}
return TSupplyItemQc
}