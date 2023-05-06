import { dbPool } from '@lib/db';
import winston from '@root/winston';
import numeral from 'numeral';
import moment from 'moment';
import sql from 'mssql';

export const selectByList = async ctx => {
    const { SchAccunit, SchFactory, SchFrDate, SchToDate, SchWriting, SchPno, SchCustCd, SchType } = ctx.request.query;
    if ( !SchAccunit ) {
      ctx.status = 500;
      return;
    }
  
    try {
        const pool = await dbPool();
        let result = await pool.request()  
        .input('iTag', 'Q')
        .input('iTagSave', 'H')
        .input('iSort', SchType)
        .input('iAccunit', SchAccunit)
        .input('iFactory', SchFactory)
        .input('iChk_ApprDocProg', SchWriting)      
        .input('iStBalDate', SchFrDate)
        .input('iAnBalDate', SchToDate)
        .input('iCrePno', SchPno)
        .input('iCustoutcd', SchCustCd)
        .output('DelvNo')
        .output('ErrMess')      
        .execute('Sc_Delv_WEB');
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

export const selectByExchange = async ctx => {
    const { SchAccunit, SchCurrcd, SchExchangeDate } = ctx.request.query;
    if ( !SchCurrcd || !SchExchangeDate ) {
      ctx.status = 500;
      return;
    }
    
    try {    
      const query = `
      SELECT Rate
      , CalGubun
      FROM nuv_sun.dbo.TFloatRate
      WHERE Accunit = '${SchAccunit}'
      AND RateDate = '${SchExchangeDate}'
      AND BeCurrCd= '${SchCurrcd}'
      AND Chcurrcd= '057001'
      `;
      const pool = await dbPool();
      const result = await pool.request().query(query);    
      const rtn = result.recordset[0];
      if(!rtn){
        ctx.body = null;        
      } else {
        ctx.body = rtn;
      }
    } catch (e) {
      winston.error(e.message);
      ctx.throw(500, e);
    }   
};

export const selectByDetailList = async ctx => {    
  const { SchDelvNo, SchAccunit, SchFactory, UserId, SchExportYn } = ctx.request.query;
  if ( !SchDelvNo || !SchAccunit || !UserId ) {
    ctx.status = 500;
    return;
  }
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iTag', 'Q')
      .input('iTagSave', 'D')
      .input('iAccunit', SchAccunit)
      .input('iFactory', SchFactory)
      .input('iDelvNo', SchDelvNo)  
      .input('iExportYn', SchExportYn)    
      .output('DelvNo')
      .output('ErrMess')      
      .execute('Sc_Delv_WEB');
      const rtn = result.recordset;
      let rtnList = [];
      rtn.map((item) => {
        if (item.No) {
          item.No = numeral(item.No).format('000');
        }
        if (item.ExchangeDate) {
          item.ExchangeDate = moment(item.ExchangeDate.trim()).format('YYYY-MM-DD');
        }        
        rtnList.push(item);
      });
      ctx.body = { dList: rtnList };
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }   
}

export const updateByList = async ctx => {
  const { header, detail } = ctx.request.body;
  detail
  if (!header && !detail) {
    ctx.status = 500;
    return;
  }
  detail.forEach((e) => {
    for (const [key, value] of Object.entries(e)) {
      if (typeof e[key] === 'string') e[key] = value.trim();
    }
  });
  const TDelvItemInfo = fTDelvItemInfo(detail);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'I')
    .input('iDelvNo', header.DelvNo)//
    .input('iFactory', header.Factory)//
    .input('iAccunit', header.Accunit)//
    .input('iExportYn', header.ExportYn)//
    .input('iDelvDate', header.DelvDate)//
    .input('iGendate', header.Gendate)//
    .input('iDeptCD', header.DeptCD)//
    .input('iPno', header.Pno)//
    .input('iCustCd', header.CustCd)//
    .input('iCurrCd', header.CurrCd)//
    .input('iExchang', header.Exchang)//
    .input('iRemark', header.Remark)//
    .input('iTaxdate', header.TaxDate)//
    .input('iVatcd', header.Vatcd)//
    .input('iTotalforeign', header.TotalForeign)//
    .input('iBL_No', header.BL_No)//
    .input('iCurrdate', header.Currdate)//
    .input('iTotalvat', header.TotalVat)//
    .input('iTotalamt', header.TotalAmt)//
    .input('iTotalweight', header.Totalweight)//
    .input('iUnitprice', header.UnitPrice)//
    .input('iUnitpricew', header.UnitPricew)//
    .input('iSliptyp', header.Sliptyp)//
    .input('iTotalprice', header.TotalPrice)//
    .input('iTotalAmount', header.TotalAmount)//
    .input('iQty', header.Qty)//
    .input('iProjectno', header.ProjectNo)//
    .input('iProjectcustCd', header.ProjectCustCd)//
    .input('iActno', header.ActNo)//
    .input('iCrePno', header.UserId)
    .input('TDelvItemInfo', TDelvItemInfo)
    .output('DelvNo')
    .output('ErrMess')
    .execute('SC_Delv_WEB');
    const output = result.output;

    if (output) {
      if (output.ErrMess != '' && output.ErrMess !== null) {
        ctx.body = {errmess: output.ErrMess, DelvNo: output.DelvNo};
        return;
      }
    } else {
      ctx.throw(500);
    }
    ctx.body = {errmess: '', DelvNo: output.DelvNo}
              
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const deleteByList = async ctx => {
  const { data } = ctx.request.body;
  if (!data) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'D')
    .input('iAccunit', data.Accunit)
    .input('iFactory', data.Factory)
    .input('iDelvNo', data.DelvNo )
    .input('iCustCd', data.CustCd )
    .input('iVatcd', data.Vatcd )
    .input('iDelvDate', data.DelvDate )
    .input('iSliptyp', data.Sliptyp )
    .input('iPno', data.Pno )
    .output('DelvNo')
    .output('ErrMess')
    .execute('SC_Delv_WEB');
    const rtn = result.recordset;
    const output = result.output;
    if (output) {
      if (output.ErrMess !== '' && output.ErrMess !== null) {
        ctx.body = {errmess: output.ErrMess};
        return;
      } else ctx.body = {'errmess': '', 'ReturnNo': output.DelvNo, 'List': rtn}
    } else {
      ctx.throw(500);
    }
    // ctx.body = {errmess: ''};
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const deleteByItem = async ctx => {
  const { data, item } = ctx.request.body;
  for (const row of item) {
    row.Guid = row.Guid.substr(0, 15);
  }

  if (!data) {
    ctx.status = 500;
    return;
  }
  item.forEach((e) => {
    for (const [key, value] of Object.entries(e)) {
      if (typeof e[key] === 'string') e[key] = value.trim();
    }
  });

  const TDelvItemInfo = fTDelvItemInfo(item);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'E')
    .input('iAccunit', data.Accunit)
    .input('iFactory', data.Factory)
    .input('iDelvNo', data.DelvNo)
    .input('iCustCd', data.CustCd )
    .input('iVatcd', data.Vatcd )
    .input('iDelvDate', data.DelvDate )
    .input('iSliptyp', data.Sliptyp )
    .input('iPno', data.Pno )
    .input('TDelvItemInfo', TDelvItemInfo)
    .output('DelvNo')
    .output('ErrMess')
    .execute('SC_Delv_WEB');
    const output = result.output;
    if (output) {
      if (output.ErrMess !== '' && output.ErrMess !== null) {
        ctx.body = {errmess: output.ErrMess};
        return;
      }
    } else {
      ctx.throw(500);
    }
    ctx.body = {errmess: ''};
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const selectByPrint1 = async ctx => {
  const { SchAccunit, SchFactory, SchFrDate, SchToDate, Gubun } = ctx.request.query;
  if ( !SchAccunit ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iAccunit', SchAccunit)
    .input('iFactory', SchFactory)
    .input('iFrdate', SchFrDate)
    .input('iTodate', SchToDate)
    .input('iGubun', Gubun)
    .execute('SC_ID_Report_Modify_WEB');
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
export const selectByPrint2 = async ctx => {
  const { SchAccunit, SchFactory, SchFrDate, SchToDate, Gubun } = ctx.request.query;
  if ( !SchAccunit ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iAccunit', SchAccunit)
    .input('iFactory', SchFactory)
    .input('iFrdate', SchFrDate)
    .input('iTodate', SchToDate)
    .input('iGubun', Gubun)
    .execute('SC_ID_Report_Modify_WEB');
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

export const searchBalJoo = async ctx => {
  const { SchAccunit, SchFactory, SchOrdergubun, SchCustcd, SchClass3, SchClass4, SchFileno } = ctx.request.query;
  if ( !SchAccunit ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', SchAccunit)
    .input('iFactory', SchFactory)
    .input('iOrdergubun', SchOrdergubun)
    .input('iCustcd', SchCustcd)
    .input('iClass3', SchClass3)
    .input('iClass4', SchClass4)
    .input('iFileno', SchFileno)
    .execute('Sc_KS_Ordersearch_WEB');
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

export const searchBalJooDetail = async ctx => {
  const { balNo, balSerl } = ctx.request.query;
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'Q')
    .input('iInId', 'PREORDERLIST')
    .input('iInCode1', balNo)
    .input('iInCode2', balSerl)
    .input('iInCode3', '')
    .input('iInCode4', '')
    .input('iInCode5', '')
    .input('iInCode6', '')
    .execute('sc_CodeClassSearch');
    const rtn = result.recordset;
    if(!rtn || rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const searchPrice = async ctx => {
  const { SchAccunit, SchCustcd, SchGoodcd, SchJukyocd } = ctx.request.query;
  if ( !SchAccunit || !SchCustcd || !SchGoodcd ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', SchAccunit)
    .input('iCustcd', SchCustcd)
    .input('iGoodcd', SchGoodcd)
    .input('iJukyocd', SchJukyocd)
    .execute('Sc_DelvPrice_Delv');
    const rtn = result.recordset[0];
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

export const updatePrices = async ctx => {
  const { items, SchAccunit, SchCustcd } = ctx.request.query;
  var myobj = JSON.parse(items)
  if ( !SchCustcd || !SchAccunit || !items ) {
    ctx.status = 500;
    return;
  }
  const TDelvPriceUpdate = fUpdatingPrices(myobj.arr);
  try{
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', SchAccunit)
    .input('iCustcd', SchCustcd)
    .input('TDelvPriceUpdate', TDelvPriceUpdate)
    .execute('Sc_DelvPrice_Delv_WEB');
    const rtn = result.recordset;
    if(!rtn || rtn.length === 0){
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch(e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

const fUpdatingPrices = (detail) => {
  const UpdatingPrices = new sql.Table();
  
  UpdatingPrices.columns.add('jukyocd'     ,sql.NVarChar(4));
  UpdatingPrices.columns.add('GoodCD'     ,sql.NVarChar(8));
  UpdatingPrices.columns.add('Price'     ,sql.Numeric(15, 5));
  UpdatingPrices.columns.add('No'     ,sql.Numeric(15,5));

  for (let [i, row] of detail.entries()) {
    UpdatingPrices.rows.add(
      row[0]    ? row[0]    :'',
      row[1]    ? row[1]    :'',
      row[2]    ? row[2]    :0,
      i         ? i         :0,
    )
  }
  return UpdatingPrices
}

const fTDelvItemInfo = (item) => {
  const TDelvItemInfo = new sql.Table();

  TDelvItemInfo.columns.add('Accunit'     ,sql.NVarChar(3)); 
  TDelvItemInfo.columns.add('Guid'      ,sql.NVarChar(15)); 
  TDelvItemInfo.columns.add('Factory'     ,sql.NVarChar(3)); 
  TDelvItemInfo.columns.add('ExportYn'      ,sql.NVarChar(1));
  TDelvItemInfo.columns.add('DelvNo'      ,sql.NVarChar(12));
  TDelvItemInfo.columns.add('DelvSeq'     ,sql.NVarChar(3)); 
  TDelvItemInfo.columns.add('GoodCD'      ,sql.NVarChar(8));
  TDelvItemInfo.columns.add('Spec'      ,sql.NVarChar(50));
  TDelvItemInfo.columns.add('UnitCD'      ,sql.NVarChar(6));
  TDelvItemInfo.columns.add('Price'     ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Div'     ,sql.NVarChar(20));
  TDelvItemInfo.columns.add('Weight'      ,sql.Numeric(18, 5));
  TDelvItemInfo.columns.add('Su'      ,sql.Numeric(18, 5));
  TDelvItemInfo.columns.add('Qty'     ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('InQty'     ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Amount'      ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('KorAmt'      ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Stockyn'     ,sql.NVarChar(1)); 
  TDelvItemInfo.columns.add('Stockqty'      ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('OkAmt'     ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Tax'     ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Whcd'      ,sql.NVarChar(2));
  TDelvItemInfo.columns.add('No'      ,sql.NVarChar(3));
  TDelvItemInfo.columns.add('Balno'     ,sql.NVarChar(14));
  TDelvItemInfo.columns.add('Balserl'     ,sql.NVarChar(4)); 
  TDelvItemInfo.columns.add('Sourcetype'      ,sql.NVarChar(1));
  TDelvItemInfo.columns.add('jukyocd'     ,sql.NVarChar(4)); 
  TDelvItemInfo.columns.add('BoxUnit'     ,sql.NVarChar(6)); 
  TDelvItemInfo.columns.add('Priceunit'     ,sql.NVarChar(50));
  TDelvItemInfo.columns.add('Unitweight'      ,sql.Numeric(15, 5));
  TDelvItemInfo.columns.add('Actno'     ,sql.NVarChar(10));
  TDelvItemInfo.columns.add('Actgoodcd'     ,sql.NVarChar(20));
  TDelvItemInfo.columns.add('Projectno'     ,sql.NVarChar(50));
  TDelvItemInfo.columns.add('Projectcustcd'     ,sql.NVarChar(5));
  TDelvItemInfo.columns.add('Remark'      ,sql.NVarChar(200));
  TDelvItemInfo.columns.add('Distributecost'      ,sql.Numeric(18, 5));
  TDelvItemInfo.columns.add('Bomchecksort'      ,sql.NVarChar(10)); 
  TDelvItemInfo.columns.add('ForeignAmt'      ,sql.Numeric(18, 5));
    
  for(const row of item) {
    TDelvItemInfo.rows.add(
      row.Accunit             ? row.Accunit       :'',
      row.Guid                ? row.Guid          :'',
      row.GFactory            ? row.GFactory       :'',
      row.ExportYn            ? row.ExportYn      :'',
      row.DelvNo              ? row.DelvNo        :'',
      row.DelvSeq             ? row.DelvSeq       :'',
      row.GoodCD              ? row.GoodCD        :'',
      row.Spec                ? row.Spec          :'',
      row.UnitCD              ? row.UnitCD        :'',
      row.Price               ? row.Price         :0,
      row.Div                 ? row.Div           :'',
      row.Weight              ? row.Weight        :0,
      row.Su                  ? row.Su            :0,
      row.Qty                 ? row.Qty           :0,
      row.InQty               ? row.InQty         :0,
      row.Amount              ? row.Amount        :0,
      row.KorAmt              ? row.KorAmt        :0,
      row.StockYn             ? row.StockYn       :'',
      row.Stockqty            ? row.Stockqty      :0,
      row.OkAmt               ? row.OkAmt         :0,
      row.Tax                 ? row.Tax           :0,
      row.Whcd                ? row.Whcd          :'',
      row.No                  ? row.No            :'',
      row.BalNo               ? row.BalNo         :'',
      row.BalSerl             ? row.BalSerl       :'',
      row.Sourcetype          ? row.Sourcetype    :'',
      row.jukyocd             ? row.jukyocd       :'',
      row.BoxUnit             ? row.BoxUnit       :'',
      row.Priceunit           ? row.Priceunit     :'',
      row.Unitweight          ? row.Unitweight    :0,
      row.Actno               ? row.Actno         :'',
      row.Actgoodcd           ? row.Actgoodcd     :'',
      row.Projectno           ? row.Projectno     :'',
      row.Projectcustcd       ? row.Projectcustcd :'',
      row.Remark              ? row.Remark        :'',
      row.Distributecost      ? row.Distributecost:0,
      row.Bomchecksort        ? row.Bomchecksort  :'',
      row.ForeignAmt          ? row.ForeignAmt    :'',
    )
  }
  return TDelvItemInfo;
}
