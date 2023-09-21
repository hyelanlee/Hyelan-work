import { dbPool } from '@lib/db';
import winston from '@root/winston';
import numeral from 'numeral';
import moment from 'moment';
import sql from 'mssql';

const DocSource = 'OD';

export const selectByList = async ctx => {    
  const { SchAccunit, SchFrDate, SchToDate, SchWriting, cboSchType, SchFactory, schPno, schCustCd, schClastype } = ctx.request.query;
  if ( !SchAccunit ) {
    ctx.status = 500;
    return;
  }
  
  try {
      const pool = await dbPool();
      let result = await pool.request()    
      .input('iTag', 'Q')
      .input('iTagSave', 'M')
      .input('iSort', cboSchType)   
      .input('iChk_ApprDocProg', SchWriting)   
      .input('iAccunit', SchAccunit)
      .input('iFactory', SchFactory)
      .input('iCrePno', schPno)
      .input('iCustCd', schCustCd)
      .input('iStBalDate', SchFrDate)
      .input('iAnBalDate', SchToDate)
      .input('iClstype', schClastype)
      .output('BalNo')
      .output('ErrMess')      
      .execute('Sc_Order_WEB');
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

export const print01 = async ctx => {    
  const { accunit, factory , balNo  } = ctx.request.query;
  if (!balNo) {
    ctx.status = 500;
    return;
  }
  try {

      const pool = await dbPool();
      let result = await pool.request()  
      .input('iAccunit', accunit)
      .input('iFactory', factory)
      .input('iBalNo', balNo)
      .execute('SC_Order_report_WEB');
      const rtn = result.recordset;
      rtn.forEach((e) => {
        e.Qty = Number(e.Qty);
        e.Price = Number(e.Price);
        e.Amount = Number(e.Amount);
        e.TotalAmt = e.TotalAmt.replace('\\', '₩');
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

export const print02 = async ctx => {// 사용안함
  let { accunit, factory , balNo  } = ctx.request.query;
  try {

const pool = await dbPool();
let result = await pool.request()  
.input('iAccunit', accunit)
.input('iFactory', factory)
.input('iBalNo', balNo)
.execute('Sc_Order_CastReport_Page1_WEB');
const rtn = result.recordset;


const pool2 = await dbPool();
let result2 = await pool2.request()  
.input('iAccunit', accunit)
.input('iFactory', factory)
.input('iBalNo', balNo)
.execute('Sc_Order_CastReport_Page2_WEB');
const rtn2 = result2.recordset;


      ctx.body = {"data1":rtn,"data2":rtn2}
    
  } catch (e) {
    ctx.throw(500, e);
  }
}

export const print03 = async ctx => {// 사용안함
  let { accunit, factory , balNo  } = ctx.request.query;
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iAccunit', accunit)
      .input('iFactory', factory)
      .input('iBalNo', balNo)
      .execute('Sc_Order_Report_OEM_Page1_WEB');
      const rtn = result.recordset;
      
      const pool2 = await dbPool();
      let result2 = await pool2.request()  
      .input('iAccunit', accunit)
      .input('iFactory', factory)
      .input('iBalNo', balNo)
      .execute('Sc_Order_Report_OEM_Page2_WEB');
      const rtn2 = result2.recordset;
  
      ctx.body = {"data1":rtn,"data2":rtn2}
    
  } catch (e) {
    ctx.throw(500, e);
  }
}

export const cancelChargeNo = async ctx => {// 사용안함
  const {ChargeNo, factory, accunit, BalNo} = ctx.request.query;
  
    if ( !ChargeNo || !factory || !accunit || !BalNo ) {
      ctx.status = 500;
      return;
    }

  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iChargeno', ChargeNo)
      .input('iBalno', BalNo)   
      .output('iCheck')   
      .execute('Sc_Cancelcheck_Chargeno');

      const iCheck = result.output.iCheck;
      if(!iCheck || iCheck.length === 0){
        ctx.body = null;
      } else {
        try {
            const pool = await dbPool();
            let result = await pool.request()  
            .input('iChargeno', ChargeNo)
            .input('iBalno', BalNo)   
            .input('iFactory', factory)
            .input('iAccunit', accunit)
            .output('ErrMess')   
            .execute('Sc_Cancel_Chargeno');
      
            const rtn = result.output;
            if(!rtn || rtn.length === 0){
              ctx.body = null;
            } else {
              ctx.body = true;
            }
        } catch (e) {
          winston.error(e.message);
          ctx.throw(500, e);
        }
      }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const findIfChargenoEligible = async ctx => {// 사용안함
  const {jsonString, Pno} = ctx.request.query;
  var items = JSON.parse(jsonString)
  if ( !items ) {
    ctx.status = 500;
    return;
  }
  
  let formatedItems = [];
  let obj = {};
  
  if (items.length > 0) {
    items.forEach(e => { 
        obj = {};
        // obj.goodCd = e.GoodCd
        obj.GoodCd = e.GoodCd
        obj.No = e.No
        formatedItems.push(obj) 
      });
    } else {
        // obj.goodCd = items.GoodCd
        obj.GoodCd = items.GoodCd
        obj.No = items.No
        formatedItems.push(obj) 
    }
  
  const UTable = BuildUserTable2findChargeNo(formatedItems);
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iYm', '')   
      .input('iMaterialgubun', '')   
      .input('iTag', 'CC')   
      .input('iFactory', '')   
      .input('iAccunit', '')   
      .input('iBalno', '')   
      .input('iBalDate', '')   
      .input('iTOrderItem', UTable)   
      .input('iPno', Pno)
      .input('iDocSource', DocSource)
      .output('Chargeno')   
      .output('ErrMess')   

      .execute('Sc_KsGetChargenoSequence_WEB');

      const rtn = result.output;
      //the proc retrun error if pb and nothing if all good.
      const ChargeNo = rtn.Chargeno

      if (rtn.ErrMess !== '' && rtn.ErrMess !== null) {                  
        ctx.body = {errmess: rtn.ErrMess};
        return;
      } else if(!ChargeNo || ChargeNo.length === 0){
        ctx.body = null;
      } else {
        ctx.body = ChargeNo;
      }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const findNsaveChargeNo = async ctx => {// 사용안함
  let UserTable2findChargeNo
  const {BalDate, MaterialGubun, factory, accunit, BalNo, items, Pno} = ctx.request.query;

  if ( !BalDate || !MaterialGubun || !factory || !accunit || !BalNo   ) {
    ctx.status = 500;
    return;
  }
  if (items) {
    const formatedItems = JSON.parse(items)
    UserTable2findChargeNo = BuildUserTable2findChargeNo(formatedItems);
  }
  const formatedBalDate = moment(BalDate).format('YYYYMMDD');

  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', '')
    .input('iYm', formatedBalDate)
    .input('iMaterialgubun', MaterialGubun)
    .input('iFactory', factory)
    .input('iAccunit', accunit)
    .input('iBalno', BalNo)   
    .input('iBalDate', formatedBalDate)   
    .input('iTOrderItem', UserTable2findChargeNo)   
    .input('iPno', Pno)
    .input('iDocSource', DocSource)
    .output('Chargeno')
    .output('ErrMess')   

    .execute('Sc_KsGetChargenoSequence_WEB');

    const rtn = result.output;
    const ChargeNo = rtn.Chargeno

    if (rtn.ErrMess !== '' && rtn.ErrMess !== null) {   
      ctx.body = {errMess: rtn.ErrMess};
      return;
    } else if(!ChargeNo || ChargeNo.length === 0){
      ctx.body = null;
    } else {
      ctx.body = ChargeNo;
    }
  } catch (e) {
  winston.error(e.message);
  ctx.throw(500, e);
  }
}

export const findChargeNo = async ctx => {// 사용안함
  const {BalDate, MaterialGubun, factory, accunit, BalNo} = ctx.request.query;
    if ( !BalDate || !MaterialGubun || !factory || !accunit || !BalNo   ) {
      ctx.status = 500;
      return;
    }
  const formatedBalDate = moment(BalDate).format('YYYYMMDD');
  
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iTag', '')
      .input('iYm', formatedBalDate)
      .input('iMaterialgubun', MaterialGubun)
      .input('iFactory', factory)
      .input('iAccunit', accunit)
      .input('iBalno', BalNo)   
      .input('iBalDate', formatedBalDate)   
      .output('Chargeno')
      .output('ErrMess')   

      .execute('Sc_KsGetChargenoSequence_WEB');

      const rtn = result.output;
      const ChargeNo = rtn.Chargeno

      if (rtn.ErrMess !== '' && rtn.ErrMess !== null) {                  
        ctx.body = {errmess: rtn.ErrMess};
        return;
      } else if(!ChargeNo || ChargeNo.length === 0){
        ctx.body = null;
      } else {
        ctx.body = ChargeNo;
      }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const findGoodPrice2 = async ctx => {    
  const {items, accunit, custCd} = ctx.request.query;
  var myobj = JSON.parse(items)

    if ( !custCd || !accunit || !items ) {
      ctx.status = 500;
      return;
    }
  const TItemToPriceUpdate = BuildItemToPriceUpdate(myobj.arr);
  
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iAccunit', accunit)
      .input('iCustcd', custCd)
      .input('TItemToPriceUpdate', TItemToPriceUpdate)

      .execute('Sc_DelvPrice_WEB');

      const rtn = result.recordset;
      console.log('모두얼마?', rtn);
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

export const findGoodPrice = async ctx => {    
  const {  custCd, goodCd, accunit } = ctx.request.query;
    if ( !custCd || !goodCd || !accunit) {
      ctx.status = 500;
      return;
    }
  try {
      const pool = await dbPool();
      let result = await pool.request()  
      .input('iAccunit', accunit)
      .input('iCustcd', custCd)
      .input('iGoodcd', goodCd)
      .execute('Sc_DelvPrice');
      const rtn = result.recordset;
      console.log('얼마?', rtn);
      (!rtn || rtn.length == 0)?ctx.body = null:ctx.body = rtn;
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

export const searchConvertValue = async ctx => {
  const { SchGoodcd, SchConvertUnit, SchConvertValue } = ctx.request.query;
  if ( !SchGoodcd || !SchConvertValue ) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'B')
    .input('iGoodcd', SchGoodcd)
    .input('iConvertUnit', SchConvertUnit)
    .input('iConvertValue', SchConvertValue)
    .output('BalNo')
    .output('ErrMess')
    .execute('Sc_Order_WEB');
    const rtn = result.recordset[0];
    console.log('길이얼마?', rtn);
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
  const { SchOrderMaterialNo, SchAccunit, SchFactory} = ctx.request.query;
  
  if ( !SchAccunit ) {
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
      .input('iBalNo', SchOrderMaterialNo)
      .output('BalNo')
      .output('ErrMess')      
      .execute('Sc_Order_WEB');
      const rtn = result.recordset;
      let rtnList = [];

      let noUiSequence = 1
      rtn.map((item) => {//formating before entry
        if (item.No) {
          item.No = noUiSequence;
          item.No = numeral(item.No).format('000');
          noUiSequence++
        }
        if (item.Qty) {
          item.Qty = numeral(item.Qty).format('0.0[0000]');
        }
        if (item.Negoseq) {
          // item.Negoseq = numeral(item.Negoseq).format('000');
        }
        if (item.NapDate) {
          item.NapDate = moment(item.NapDate.trim()).format('YYYY-MM-DD');
        }        
        rtnList.push(item);
      });


      ctx.body = { dList: rtnList};
  } catch (e) {
    winston.info("catch!");
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
    .input('iBalNo', data.BalNo)
    .input('iPno', data.useridPno)
    .input('iDocSource', DocSource)

    .output('BalNo')
    .output('ErrMess')
    .execute('Sc_Order_WEB');

    const rtn = result.recordset;
    const output = result.output;
  
    if (output) {
      if ((output.ErrMess != '' || output.ErrMess != null) && output.ErrMess != null) {   
        ctx.body = {errmess: output.ErrMess, ReturnNo: output.ReturnNo};
        return;
      } else {
        ctx.body = {'errmess': '', 'ReturnNo': output.ReturnNo, 'List': rtn};
      }       
    } else {
      ctx.throw(500);
    }    
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
  //Important ! adding missing data 
  data.Balno = data.BalNo;
  item.forEach((e) => {
    for (const [key, value] of Object.entries(e)) {
      if (typeof e[key] === 'string') e[key] = value.trim();
    }
  });

  const TOrderItemInfo = fTOrderItemInfo2(item,data);
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iTag', 'E')
    .input('iAccunit', data.Accunit)
    .input('iBalNo', data.BalNo)
    .input('iDocSource', DocSource)
    .input('iFactory', data.Factory)  
    .input('iPno', data.useridPno)
    .input('TOrderItemInfo', TOrderItemInfo)
    .output('Balno')
    .output('ErrMess')                     
    .execute('SC_Order_WEB');
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

export const updateByList = async ctx => {//  update/insert details and headers
  const { header: headerVO, headerTable, detail: detailTable } = ctx.request.body;
  if (!headerVO && !detailTable) {
    ctx.status = 500;
    return;
  }
  detailTable.forEach((e) => {
    for (const [key, value] of Object.entries(e)) {
      if (typeof e[key] === 'string') e[key] = value.trim();
    }
  });
  for(const row of detailTable){
    row.Weight = Number(row.Weight);
    row.NapDate = moment(row.NapDate).format('YYYYMMDD');
  }
  const TOrderItemInfo = fTOrderItemInfo2(detailTable,headerVO);
  
  try {
    const pool = await dbPool();
    let result = await pool.request()  
    .input('iTag', 'I')
    .input('iAccunit', headerVO.Accunit)
    .input('iUserId', headerVO.UserId)
    .input('iFactory', headerVO.Factory)  
    .input('iBalNo', headerVO.BalNo)  
    .input('iDocSource', DocSource)
    .input('iExportyn', headerVO.ExportYn)//MAYBE/TODO: Find where it comes from...//HERE BE sure it s ==1?
    .input('iBaldate', headerVO.BalDate)
    .input('iDeptCd', headerVO.DeptCd)
    .input('iPno', headerVO.Pno)
    .input('iCustCd',headerVO.CustCd)
    .input('iRemarkM',headerVO.Remark) 
    .input('iURGENCY',headerVO.URGENCY)
    .input('iVatcd',headerVO.Vatcd)
    .input('iContractno',headerVO.ContractNo)
    .input('iFileno',headerVO.FileNo)
    .input('iCrepno',headerTable.CrePno)
    .input('iCredate',headerTable.CreDate)
    .input('iModpno',headerTable.ModPno)
    .input('iModdate',headerTable.ModDate)
    .input('iTotalWeight',headerVO.TotalWeight)
    .input('iTotalVat',headerVO.ToTalVat)
    .input('iTotalAmt',headerVO.TotalAmt)

    .input('TOrderItemInfo', TOrderItemInfo)

    .output('BalNo')
    .output('ErrMess')
    .execute('Sc_Order_WEB');

    const output = result.output;
  
    if (output) {
      if (output.ErrMess !== '' && output.ErrMess !== null) {     
        ctx.body = {errmess: output.ErrMess, BalNo: output.BalNo};
        return;
      }        
    } else {
      ctx.throw(500);
    }    
    ctx.body = {errmess: '', BalNo: output.BalNo};
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

const BuildUserTable2findChargeNo = (detail) => {  //exactly fit db table colums
  const T = new sql.Table();

  T.columns.add('No'                        , sql.NVarChar(3));
  T.columns.add('GoodCd'                    , sql.NVarChar(8));

  for(const row of detail){
    T.rows.add(    
      row.No               ?row.No                    :'',              
      row.GoodCd           ?row.GoodCd                :'',              
    )
  }
  return T;
};

const BuildItemToPriceUpdate = (detail) => {  //exactly fit db table colums
  const ItemToPriceUpdate = new sql.Table();

  ItemToPriceUpdate.columns.add('GoodCd'           , sql.NVarChar(8));
  ItemToPriceUpdate.columns.add('Price'            , sql.Numeric(15,5));
  ItemToPriceUpdate.columns.add('No'               , sql.Numeric(15,5));

  for (let [i, row] of detail.entries()) {
    ItemToPriceUpdate.rows.add(    
      row[0]        ? row[0]      :'',              
      row[1]        ? row[1]      :0,              
      i             ? i           :0,              
    )
  }

  return ItemToPriceUpdate;
};

const fTOrderItemInfo2 = (detail,header) => {  //exactly fit db table colums

  const TOrderItemInfo = new sql.Table();

  TOrderItemInfo.columns.add('Accunit'             , sql.NVarChar(3));
  TOrderItemInfo.columns.add('Factory'             , sql.NVarChar(3));
  TOrderItemInfo.columns.add('ExportYn'            , sql.NVarChar(1));
	TOrderItemInfo.columns.add('BalNo'               , sql.NVarChar(12));
  TOrderItemInfo.columns.add('BalSeq'              , sql.NVarChar(3));
  TOrderItemInfo.columns.add('GoodCd'              , sql.NVarChar(8));
  TOrderItemInfo.columns.add('Spec'                , sql.NVarChar(50));
  TOrderItemInfo.columns.add('UnitCd'              , sql.NVarChar(6));
  TOrderItemInfo.columns.add('Su'                  , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('Weight'              , sql.Numeric(15,5));  
  TOrderItemInfo.columns.add('Qty'                 , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('Price'               , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('Amount'              , sql.Numeric(15,5));
	TOrderItemInfo.columns.add('MarkCd'              , sql.NVarChar(8));
	TOrderItemInfo.columns.add('NapDate'             , sql.NVarChar(8));
  TOrderItemInfo.columns.add('WonAmt'              , sql.Numeric(18,5));
  TOrderItemInfo.columns.add('StockUnitCd'         , sql.NVarChar(6));
  TOrderItemInfo.columns.add('StockQty'            , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('ProgType'            , sql.NVarChar(1));
  TOrderItemInfo.columns.add('NapQty'              , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('No'                  , sql.NVarChar(3));
  TOrderItemInfo.columns.add('Remark'              , sql.NVarChar(120));
  TOrderItemInfo.columns.add('InQty'               , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('InCnt'               , sql.Numeric(15,5));  
  TOrderItemInfo.columns.add('CrePno'              , sql.NVarChar(5));  
  TOrderItemInfo.columns.add('CreDate'             , sql.SmallDateTime);  
  TOrderItemInfo.columns.add('ModPno'              , sql.NVarChar(5));
  TOrderItemInfo.columns.add('ModDate'             , sql.SmallDateTime);
  TOrderItemInfo.columns.add('Tax'                 , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('Okamt'               , sql.Numeric(15,5));
  TOrderItemInfo.columns.add('Clstype'             , sql.NVarChar(6));
  TOrderItemInfo.columns.add('BalQty'              , sql.Numeric(15,5));

  for(const row of detail){
    TOrderItemInfo.rows.add(    
      header.Accunit    ?header.Accunit                                                :'',              
      header.Factory    ?header.Factory                                                :'',              
      header.ExportYn   ?header.ExportYn                                               :'',             
      row.BalNo         ?row.BalNo                                                  :'',              
      row.BalSeq        ?row.BalSeq                                                    :'',              
      row.GoodCd        ?row.GoodCd                                                    :'',              
      row.Spec          ?row.Spec                                                      :'',              
      row.UnitCd        ?row.UnitCd                                                    :'',              
      row.Su            ?row.Su                                                        :0 ,               
      row.Weight        ?Number(row.Weight)                                            :0 ,               
      row.Qty           ?row.Qty                                                       :0 ,              
      row.Price         ?row.Price                                                     :0 ,              
      row.Amount        ?row.Amount                                                    :0 ,              
      row.MarkCd        ?row.MarkCd                                                    :'',              
      row.NapDate       ?moment(row.NapDate).format('YYYYMMDD')                        :'',              
      row.WonAmt        ?row.WonAmt                                                    :0 ,              
      row.StockUnitCd   ?row.StockUnitCd                                               :'',              
      row.StockQty      ?row.StockQty                                                  :0,              
      row.ProgType      ?row.ProgType                                                  :'',              
      row.NapQty        ?row.NapQty                                                    :0 ,              
      row.No            ?row.No                                                        :'',              
      row.Remark        ?row.Remark                                                    :'',              
      row.InQty         ?row.InQty                                                     :0 ,               
      row.InCnt         ?Number(row.InCnt)                                             :0 ,               
      row.CrePno        ?row.CrePno                                                    :'',              
      row.CreDate       ?new Date(moment(row.CreDate).format('YYYY-MM-DD hh:mm:ss'))   :null,  //seems odd... TODO.Check if is works well.
      row.ModPno        ?row.ModPno                                                    :'' ,   //if there is no credate given then we should            
      row.ModDate       ?new Date(moment(row.ModDate).format('YYYY-MM-DD hh:mm:ss'))   :null,  //put today date no?            
      row.Tax           ?row.Tax                                                       :0 ,                
      row.Okamt         ?row.Okamt                                                     :0 ,                
      row.Clstype       ?row.Clstype                                                   :'',                
      row.BalQty        ?row.BalQty                                                    :0 ,                 

    )
  }

  return TOrderItemInfo;
};
