import { dbPool } from '@lib/db';
import winston from '@root/winston';

// 재고장 - 상품, 제품, 반제품
export const selectByList10 = async ctx => {
  const {
    Accunit,
    Factory,
    ReferenceDate,
    NapDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
    BoxingYn,
    Category,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  let sp;
  if (Category === '0') {
    sp = 'Sc_HanEng_07_801_055003_New'
  } else if (Category === '1') {
    sp = 'Sc_HSE07801055004'
  } else if (Category === '2') {
    sp = 'Sc_HSE07801055008'
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iYmd', ReferenceDate)
    .input('iNapdate', NapDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGoodno', GoodNo)
    .input('iBoxingYn', BoxingYn)
    .execute(sp);
    let rtn;
    if (Category === '0') {
      rtn = result.recordset;
    } else if (Category === '1') {
      const rtn1 = result.recordset;
      rtn = rtn1.map(obj => {
        return { ...obj, Acceptqty: obj.AcceptQty }
      })
    } else if (Category === '2') {
      const rtn1 = result.recordset;
      rtn = rtn1.map(obj => {
        return { ...obj, Goodno: obj.GoodNo, Goodnm: obj.GoodNm, Possqty: obj.PossQty, Avg_Qty_12: obj.Avg_Qty }
      })
    }
    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 재고장 - 원재료, 단조
export const selectByList1_1 = async ctx => {
  const {
    Accunit,
    Factory,
    ReferenceDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
    Category,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  let sp;
  if (Category === '3') {
    sp = 'Sc_Raw_Material_Ledger'
  } else if (Category === '4') {
    sp = 'sc_incom07_802_061038'
  } 

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrYmd', ReferenceDate)
    .input('iToYmd', ReferenceDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGubun', '0')
    .input('iGubun1', '0')
    .input('iGoodno', GoodNo)
    .execute(sp);
    let rtn;
    if (Category === '3') {
      const rtn1 = result.recordset;
      rtn = rtn1.map(obj => {
        return { ...obj, possQty: obj.StkQty + obj.reqqty }
      })
    } else if (Category === '4') {
      const rtn1 = result.recordset;
      rtn = rtn1.map(obj => {
        return { ...obj, possQty: obj.StkQty + obj.reqqty }
      })
    }

    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 구매발주내역(전체)
export const selectByList11 = async ctx => {
  const {
    Accunit,
    Factory,
    FrDate,
    ToDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
    CustCd,
    Clastype,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGoodno', GoodNo)
    .input('iCustcd', CustCd)
    .input('iClstype', Clastype)
    .execute('Sc_OrderDelvSch');
    const rtn = result.recordset;
    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 외주발주내역(전체)
export const selectByList12 = async ctx => {
  const {
    Accunit,
    Factory,
    FrDate,
    ToDate,
    ReferenceDate,
    NapDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
    CustCd,
    Clastype,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .input('iYmd', ReferenceDate)
    .input('iNapdate', NapDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGoodno', GoodNo)
    .input('iCustcd', CustCd)
    .input('iClstype', Clastype)
    .execute('Sc_PMSOrderDelvSch_202005Debug');
    const rtn = result.recordset;
    console.log('rtn', rtn);
    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 생산입고대장(전체)
export const selectByList13 = async ctx => { 
  const {
    Accunit,
    Factory,
    FrDate,
    ToDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGoodno', GoodNo)
    .execute('Sc_Prodin_Prt');
    const rtn = result.recordset;
    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 발주/외주입고내역(전체)
export const selectByList15 = async ctx => {
  const {
    Accunit,
    Factory,
    FrDate,
    ToDate,
    Class2,
    Class3,
    Class4,
    Class5,
    GoodNo,
    CustCd,
    Clastype,
    Supply,
  } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .input('iClass2', Class2)
    .input('iClass3', Class3)
    .input('iClass4', Class4)
    .input('iClass5', Class5)
    .input('iGoodno', GoodNo)
    .input('iCustcd', CustCd)
    .input('iClstype', Clastype)
    .input('iGubun', Supply)
    .execute('Sc_Delv_Pms_Stocked_Record');
    let rtn;
    if (Supply === '0') {
      rtn = result.recordset;
    } else {
      const rtn1 = result.recordset;
      rtn = rtn1.map(obj => {
        return {...obj, GoodNo: obj.Goodno, InoutDate: obj.Inoutdate}
      }) 
    }
    if (!rtn||rtn.length === 0) {
      ctx.body = null;
    } else {
      ctx.body = rtn;
    }
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 반제품입고내역(보고용)
export const selectByList17 = async ctx => {
  const { Accunit, Factory, FrDate, ToDate } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }

  try {
    const pool = await dbPool();
    let result1 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .execute('Sc_ProdIn_055008_Report_Detail');
    const rtn1 = result1.recordset;

    let result2 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', FrDate)
    .input('iTodate', ToDate)
    .execute('Sc_ProdIn_055008_Report_Summary');
    const rtn2 = result2.recordset;
    rtn1.forEach((row) => {
      row.InoutDate = row.InoutDate.substr(0, 4) + '-'+ row.InoutDate.substr(4, 2) + '-'+ row.InoutDate.substr(6, 2);
    })
    rtn2.forEach((row) => {
      row.InoutDate = row.InoutDate.substr(0, 4) + '-'+ row.InoutDate.substr(4, 2) + '-'+ row.InoutDate.substr(6, 2);
    })

    ctx.body = { grid1: rtn1, grid2: rtn2 };
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
};

// 재고장 - 상품, 제품, 반제품 - 수주동향, 출고동향, 작업지시서발행내역
export const selectByDetailList10 = async ctx => {
  const {Accunit, Factory, ReferenceDate, goodcd, NapDate} = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result1 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iYmd', ReferenceDate)
    .input('iGoodcd', goodcd)
    .execute('Sc_HanEng_07_801_New_Accept_Trend');
    const rtn1 = result1.recordset;

    let result2 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iYmd', ReferenceDate)
    .input('iGoodcd', goodcd)
    .execute('Sc_HanEng_07_801_New_Forout_Trend');
    const rtn2 = result2.recordset;

    let result3 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    // .input('iDelvdate', '20230701')
    .input('iDelvdate', NapDate)
    .input('iItemcd', goodcd)
    // .input('iItemcd', '00019678')
    .execute('sc_HanSunEng_07_803_WorkReport');
    const rtn3 = result3.recordset;

    rtn1.forEach((item) => {
      if(Array.isArray(item.Be_01_Month)) {
        item.Be_01_Month = item.Be_01_Month[0];
      }
    })
    rtn2.forEach((item) => {
      if(Array.isArray(item.Be_01_Month)) {
        item.Be_01_Month = item.Be_01_Month[0];
      }
    })
    rtn3.forEach((row) => {
      row.DeliveryDate = row.DeliveryDate.substr(0, 4) + '-'+ row.DeliveryDate.substr(4, 2) + '-'+ row.DeliveryDate.substr(6, 2);
    });

    ctx.body = { grid1: rtn1, grid2: rtn2, grid3: rtn3 };
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

// 재고장 - 상품, 제품, 반제품 - 구매발주내역
export const selectByDetailList14 = async ctx => {
  const {Accunit, Factory, goodcd } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result4 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iGoodcd', goodcd)
    .execute('Sc_OrderDelvSch');
    const rtn4 = result4.recordset;
    ctx.body = rtn4

  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

// 재고장 - 상품, 제품, 반제품 - 외주발주내역
export const selectByDetailList15 = async ctx => {
  const {Accunit, Factory, goodcd } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result5 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iGoodcd', goodcd)
    .execute('Sc_PMSOrderDelvSchRealGrid6');
    const rtn5 = result5.recordset;
    ctx.body = rtn5

  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

// 재고장 - 상품, 제품, 반제품 - 미결수주내역
export const selectByDetailList16 = async ctx => {
  const {Accunit, Factory, goodcd, NapDate, BoxingYn } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result6 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iYmd', NapDate)
    .input('iGoodcd', goodcd)
    .input('iBoxingYn', BoxingYn)
    .execute('Sc_HanEng_07_801_New_Accept_Detail');

    let rtn6;
    const rtn = result6.recordset;
    rtn6 = rtn.map(obj => {
      return {
        ...obj, 
        MiQty: obj.Acceptqty + obj.OutQty, 
        PossQty: obj.StockQty - (obj.Acceptqty - obj.OutQty), 
        AcceptDate: obj.AcceptDate.substr(0, 4) + '-' + obj.AcceptDate.substr(4, 2) + '-' + obj.AcceptDate.substr(6, 2),
        Napdate: obj.Napdate.substr(0, 4) + '-' + obj.Napdate.substr(4, 2) + '-' + obj.Napdate.substr(6, 2),
        Cretime: obj.Cretime.substr(0, 4) + '-' + obj.Cretime.substr(4, 2) + '-' + obj.Cretime.substr(6, 2),
        Modtime: obj.Modtime.substr(0, 4) + '-' + obj.Modtime.substr(4, 2) + '-' + obj.Modtime.substr(6, 2)
      }
    })
    ctx.body = rtn6

  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

// 재고장 - 상품, 제품, 반제품 - 출고요청내역
export const selectByDetailList17 = async ctx => {
  const {Accunit, Factory, goodcd, NapDate } = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iFrdate', '')
    .input('iTodate', NapDate)
    .input('iGoodcd', goodcd)
    .execute('Sc_Forreq_List');
    let rtn;
    const rtn6 = result.recordset;
    rtn = rtn6.map((obj) => {
      return { ...obj, Reqdate: obj.Reqdate.substr(0, 4) + '-' + obj.Reqdate.substr(4, 2) + '-' + obj.Reqdate.substr(6, 2),}
    })
    ctx.body = rtn

  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}

// 재고장 - 원재료, 단조 - 출고동향, 외주발주내역, 출고요청내역
export const selectByDetailList11 = async ctx => { 
  const {Accunit, Factory, ReferenceDate, goodcd} = ctx.request.query;
  if (!Accunit) {
    ctx.status = 500;
    return;
  }
  try {
    const pool = await dbPool();
    let result1 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iYmd', ReferenceDate)
    .input('iGoodcd', goodcd)
    .execute('Sc_HanEng_07_801_New_Forout_Trend_RM');
    const rtn1 = result1.recordset;
    
    let result2 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iGoodcd', goodcd)
    .execute('Sc_PMSOrderDelvSchRealGrid6');
    const rtn2 = result2.recordset;

    let result3 = await pool.request()
    .input('iAccunit', Accunit)
    .input('iFactory', Factory)
    .input('iGoodcd', goodcd)
    .execute('Sc_Forreq_List_RM');
    let rtn3
    const rtn = result3.recordset;
    rtn1.forEach((item) => {
      if(Array.isArray(item.Be_01_Month)) {
        item.Be_01_Month = item.Be_01_Month[0];
      }
    })
    rtn3 = rtn.map((obj) => {
      return { ...obj, Workdate: obj.Workdate.substr(0, 4) + '-' + obj.Workdate.substr(4, 2) + '-' + obj.Workdate.substr(6, 2), }
    })


    ctx.body = { grid1: rtn1, grid2: rtn2, grid3: rtn3 };
  } catch (e) {
    winston.error(e.message);
    ctx.throw(500, e);
  }
}
