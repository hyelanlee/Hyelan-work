import { dbPool } from "@lib/db";
import winston from '@root/winston';
import numeral from "numeral";
import sql from 'mssql';
import moment from 'moment';

export const selectByList = async ctx => {
  const {SchAccunit, SchFactory, SchCustCd, SchGoodNo, SchStatus, SchBalNo, SchFrDate, SchToDate, SchDateType  } = ctx.request.query;
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
    .input('iCustCd', SchCustCd)
    .input('iGoodNo', SchGoodNo)
    .input('iStatus', SchStatus)
    .input('iBalNo', SchBalNo)
    .input('iDateType', SchDateType)
    .input('iFrDate', SchFrDate)
    .input('iToDate', SchToDate)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_Supply');

    const rtn = result.recordset;
    rtn.forEach((el) => {
      el.BalDate = moment(el.BalDate).format('YYYY-MM-DD')
      el.NapDate = moment(el.NapDate).format('YYYY-MM-DD')
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

export const selectBySupNoList = async ctx => {
  const { supplyDate, custCd } = ctx.request.query;
  if (!supplyDate || !custCd) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'A')
    .input('iSupplyDate', supplyDate)
    .input('iCustCd', custCd)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');

    const rtn = result.recordset;
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const selectIsDelv = async ctx => { //사용안함 그러나 안지움
  const { supNo, custCd } = ctx.request.query;
  if (!supNo || !custCd) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'F')
    .input('iSupNo', supNo)
    .input('iCustCd', custCd)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');
    const rtn = result.recordset;
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const convertMultiValues = async ctx => { //사용안함 그러나 안지움
  const { items } = ctx.request.query;
  var myobj = JSON.parse(items)
  if (!items) {
    ctx.status = 500;
    return;
  }
  const TSupplyValueUpdate = fTSupplyValueUpdate(myobj.arr);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'M')
    .input('TSupplyValueUpdate', TSupplyValueUpdate)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');
    const rtn = result.recordset;
    // console.log('rtnnn^^', rtn);
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }

}

export const countIncomplateSupplyList = async ctx => {
  const { custCd, supplyDate } = ctx.request.query;

  if (!custCd) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'G')
    .input('iCustCd', custCd)
    .input('iSupplyDate', supplyDate)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');

    const rtn = result.recordset;
    // console.log('rtn', rtn);
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const selectBySupNoList2 = async ctx => { //사용안함 그러나 안지움
  const { supplyDate, custCd } = ctx.request.query;
  if (!supplyDate || !custCd) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'E')
    .input('iSupplyDate', supplyDate)
    .input('iCustCd', custCd)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');

    const rtn = result.recordset;
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const calculateMiNap = async ctx => {
  const { CustCd, BalNo, BalSeq, SupNo, SuValue, QtyValue } = ctx.request.query;
  console.log('heminsap', );
  if (!SuValue || !QtyValue) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'C')
    .input('iCustCd', CustCd)
    .input('iBalNo', BalNo)
    .input('iBalSeq', BalSeq)
    .input('iSupNo', SupNo)
    .input('iInputQty', QtyValue)
    .input('iInputSu', SuValue)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply');

    const rtn = result.recordset;
    if (rtn) {
      ctx.body = rtn;
    } else ctx.throw(500);
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const selectBySupplyList = async ctx => {
  const {SupplyDate, CustCd, SupNo} = ctx.request.query;
  if (!SupplyDate) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'B')
    .input('iCustCd', CustCd)
    .input('iSupplyDate', SupplyDate)
    .input('iSupNo', SupNo)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_Supply');
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

export const updateByList = async ctx => {
  const { header, detail } = ctx.request.body;
  if (!detail) {
    ctx.status = 500;
    return;
  }
  const TSupplyItemInfo = fTSupplyItemInfo(detail);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'U')
    .input('iAccunit', header.SchAccunit)
    .input('iFactory', header.SchFactory)
    .input('iCustCd', header.SchCustCd)
    .input('iSupNo', header.SupNo)
    .input('iSupplyDate', header.SupplyDate)
    .input('TSupplyItemInfo', TSupplyItemInfo)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_Supply');
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

export const deleteByItem = async ctx => {
  const { data, item } = ctx.request.body;
  if (!data) {
    ctx.status = 500;
    return;
  }
  item.forEach((e) => {
    for (const [key, value] of Object.entries(e)) {
      if (typeof e[key] === 'string') e[key] = value.trim();
    }
  });
  const TSupplyItemInfo = fTSupplyItemInfo(item);
  try{
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'D')
    .input('iAccunit', data.Accunit)
    .input('iFactory', data.Factory)
    .input('iSupNo', data.SupNo)
    .input('iSupplyDate', data.supplyDate)
    .input('iCustCd', data.SchCustCd)
    .input('TSupplyItemInfo', TSupplyItemInfo)
    .output('SupNo')
    .output('ErrMess')
    .execute('Sc_Supply')
    const output = result.output;
    if (output) {
      if (output.ErrMess !== '' && output.ErrMess !== null) {
        ctx.body = {errmess: output.ErrMess };
        return;
      }
    } else ctx.throw(500);
    ctx.body = {errmess: '', SupNo: output.SupNo};
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const selectByPrint = async ctx => {
  const { SchAccunit, SchFactory, CustCd, SupNo } = ctx.request.query;

  if ( !SchAccunit ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'P')
    .input('iAccunit', SchAccunit)
    .input('iFactory', SchFactory)
    .input('iCustCd', CustCd)
    .input('iSupNo', SupNo)
    .output('SupNo')
    .output('ErrMess')      
    .execute('Sc_Supply');
    const rtn = result.recordset;
    // console.log('rtn', rtn);
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

const fTSupplyValueUpdate = (item) => {
  const TSupplyValueUpdate = new sql.Table();

  TSupplyValueUpdate.columns.add('BalNo', sql.NVarChar(12));
  TSupplyValueUpdate.columns.add('BalSeq', sql.NVarChar(3));
  TSupplyValueUpdate.columns.add('GoodCd', sql.NVarChar(8));
  TSupplyValueUpdate.columns.add('MiNapQty', sql.Numeric(15,5));
  TSupplyValueUpdate.columns.add('No', sql.Int);

  for (let [i, row] of item.entries()) {
    TSupplyValueUpdate.rows.add(
      row[0] ? row[0] : '',
      row[1] ? row[1] : '',
      row[2] ? row[2] : '',
      row[3] ? row[3] : 0,
      i      ? i      : 0,
    )
  }
  return TSupplyValueUpdate
}

const fTSupplyItemInfo = (item) => {
  const TSupplyItemInfo = new sql.Table();

TSupplyItemInfo.columns.add('Accunit', sql.NVarChar(3));
TSupplyItemInfo.columns.add('Factory', sql.NVarChar(3));
TSupplyItemInfo.columns.add('CustCd', sql.NVarChar(5));
TSupplyItemInfo.columns.add('SupNo', sql.NVarChar(12));
TSupplyItemInfo.columns.add('SupSeq', sql.NVarChar(3));
TSupplyItemInfo.columns.add('BalNo', sql.NVarChar(12));
TSupplyItemInfo.columns.add('BalSeq', sql.NVarChar(3));
TSupplyItemInfo.columns.add('DelvGuid', sql.NVarChar(15));
TSupplyItemInfo.columns.add('GoodCd', sql.NVarChar(8));
TSupplyItemInfo.columns.add('Spec', sql.NVarChar(50));
TSupplyItemInfo.columns.add('UnitCd', sql.NVarChar(6));
TSupplyItemInfo.columns.add('Su', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('Weight', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('Qty', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('Price', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('Tax', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('Amount', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('OkAmt', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('No', sql.NVarChar(3));
TSupplyItemInfo.columns.add('CreDate', sql.NVarChar(8));
TSupplyItemInfo.columns.add('ModDate', sql.NVarChar(8));
TSupplyItemInfo.columns.add('QcPno', sql.NVarChar(5));
TSupplyItemInfo.columns.add('QcDate', sql.NVarChar(8));
TSupplyItemInfo.columns.add('QcOkQty', sql.Numeric(18, 5));
TSupplyItemInfo.columns.add('SupplyDate', sql.NVarChar(8));
TSupplyItemInfo.columns.add('Remark', sql.NVarChar(100));
TSupplyItemInfo.columns.add('Hcn', sql.NVarChar(5));
TSupplyItemInfo.columns.add('RealWeight', sql.Numeric(18, 5));

for (const row of item) {
  TSupplyItemInfo.rows.add(
    row.Accunit    ?  row.Accunit    :'',
    row.Factory    ?  row.Factory    :'',
    row.CustCd     ?  row.CustCd     :'',
    row.SupNo      ?  row.SupNo      :'',
    row.SupSeq     ?  row.SupSeq     :'',
    row.BalNo      ?  row.BalNo      :'',
    row.BalSeq     ?  row.BalSeq     :'',
    row.DelvGuid   ?  row.DelvGuid   :'',
    row.GoodCd     ?  row.GoodCd     :'',
    row.Spec       ?  row.Spec       :'',
    row.UnitCd     ?  row.UnitCd     :'',
    row.Su         ?  row.Su         :0,
    row.Weight     ?  row.Weight     :0,
    row.Qty        ?  row.Qty        :0,
    row.Price      ?  row.Price      :0,
    row.Tax        ?  row.Tax        :0,
    row.Amount     ?  row.Amount     :0,
    row.OkAmt      ?  row.OkAmt      :0,
    row.No         ?  row.No         :'',
    row.CreDate    ?  moment(row.CreDate).format('YYYYMMDD') :'',
    row.ModDate    ?  moment(row.ModDate).format('YYYYMMDD') :'',
    row.QcPno      ?  row.QcPno      :'',
    row.QcDate     ?  row.QcDate     :'',
    row.QcOkQty    ?  row.QcOkQty    :0,
    row.SupplyDate ?  moment(row.SupplyDate).format('YYYYMMDD') :'',
    row.Remark     ?  row.Remark     :'',
    row.Hcn        ?  row.Hcn        :'',
    row.RealWeight ?  row.RealWeight :0,
  )
}
return TSupplyItemInfo;

}