import axios from 'axios';
import moment from 'moment';

export const fInit = (setSearchVO, UserStore) => {
  setSearchVO({
    SchAccunit: '',
    SchFactory: '',
    SchCustCd: UserStore.user.custcd,
    SchCustNm: UserStore.user.custnm,
    SchBalNo: '',
    SchDateType: '1',
    SchGoodNo: '',
    SchStatus: '4',
    SchFrDate: moment().subtract(1, 'month'),
    // SchFrDate: new Date(),
    SchToDate: new Date(),
    SchNapDate: new Date(),
  });
};

export const fSearchProc = async (MenuStore, searchVO, Provider, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.SchFrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.SchToDate, 'YYYY-MM-DD').isValid(), '발주기간을 바르게 입력해 주세요.')) {
    return;
  }

  if (MenuStore.Util.Common.fValidate(moment(searchVO.SchFrDate).format('YYYYMMDD') > moment(searchVO.SchToDate).format('YYYYMMDD'), '조회기간을 확인해 주세요.')) {
    return;
  }

  const paramVO = { ...searchVO };
  paramVO.SchFrDate = moment(paramVO.SchFrDate).format('YYYYMMDD');
  paramVO.SchToDate = moment(paramVO.SchToDate).format('YYYYMMDD');
  paramVO.SchAccunit = MenuStore.User.user.accunit;
  paramVO.SchFactory = MenuStore.User.user.factory;

  await MenuStore.Util.Command.fSearch(Provider, '/@api/supply/supplyItem/selectByList', paramVO, title);
};

export const fSearchSupplyItem = async (MenuStore, searchVO, dataProvider2, refSupNo, supplyDate) => {
  if (refSupNo.current === 'NEW' || refSupNo.current === '' || refSupNo.current.includes('삭')) return;
  if (MenuStore.Util.Common.fValidate(!moment(supplyDate, 'YYYY-MM-DD').isValid(), '납품일자를 확인해 주세요.')) return;
  try {
    const result = await axios.get('@api/supply/supplyItem/selectBySupplyList', {
      params: { SupplyDate: moment(supplyDate).format('YYYYMMDD'), CustCd: searchVO.SchCustCd, SupNo: refSupNo.current },
    });
    dataProvider2.setRows(result.data);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '납품 상세 조회중 오류가 발생하였습니다.' });
  }
};

export const fGetSupNoList = async (MenuStore, searchVO, setSupNoList, supplyDate) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.SchNapDate, 'YYYY-MM-DD').isValid(), '납품일자를 바르게 입력해 주세요.')) {
    return;
  }
  setSupNoList([]);
  try {
    const result = await axios.get('@api/supply/supplyItem/selectBySupNoList', {
      params: { supplyDate: moment(supplyDate).format('YYYYMMDD'), custCd: searchVO.SchCustCd },
    });
    const orgData = result.data;
    let data = [];
    let falged = [];
    orgData.map((e, i) => {
      if (i == 0 || !falged.includes(e.value.substr(0, 12))) data.push(e);
      falged.push(e.value.substr(0, 12));
    });
    data.unshift({ value: 'NEW', text: '신규' });
    setSupNoList(data);
    return result.data;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '납품번호 조회중 오류가 발생하였습니다.' });
  }
};

export const fGetSupNoList2 = async (MenuStore, searchVO, supplyDate, setSupNo, dataProvider2, refSupNo) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.SchNapDate, 'YYYY-MM-DD').isValid(), '납품일자를 바르게 입력해 주세요.')) {
    return;
  }
  setSupNo([]);
  try {
    const result = await axios.get('@api/supply/supplyItem/selectBySupNoList2', {
      params: { supplyDate: moment(supplyDate).format('YYYYMMDD'), custCd: searchVO.SchCustCd },
    });
    const data = result.data;
    setSupNo(data);
    refSupNo.current = result.data[0];
    setTimeout(async () => {
      await fSearchSupplyItem(MenuStore, searchVO, dataProvider2, refSupNo, supplyDate);
    }, 10);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '납품번호 조회중 오류가 발생하였습니다.' });
  }
};

export const fIsDelv = async (MenuStore, searchVO, refSupNo) => {
  try {
    const result = await axios.get('@api/supply/supplyItem/selectIsDelv', {
      params: { supNo: refSupNo.current, custCd: searchVO.SchCustCd },
    });
    const data = result.data[0].isDelv;
    return data;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '구매입고 여부 확인 중 오류가 발생하였습니다.' });
  }
};

export const fIncomplateSupplyCount = async (MenuStore, searchVO, supplydate) => {
  let supDa = '';
  if (supplydate) {
    supDa = moment(supplydate).format('YYYYMMDD');
  }
  try {
    const result = await axios.get('@api/supply/supplyItem/countIncomplateSupplyList', {
      params: { custCd: searchVO.SchCustCd, supplyDate: supDa },
    });
    return result.data;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '납품목록 조회 중 오류가 발생하였습니다.' });
  }
};

export const fSupplySaveProc = async (MenuStore, searchVO, dataProvider2, gridView2, refSupNo, supplyDate, setSupNoList, setSupNo, dataProvider1) => {
  gridView2.commit();
  const paramVO = { ...searchVO };
  paramVO.SchAccunit = MenuStore.User.user.accunit;
  paramVO.SchFactory = MenuStore.User.user.factory;
  paramVO.SupNo = refSupNo.current;
  paramVO.SupplyDate = moment(supplyDate).format('YYYYMMDD');
  let paramDetail = [];
  MenuStore.Util.Grid.fCheckGridData(dataProvider2, paramDetail, '', '');

  let minusMinap = 0;
  paramDetail.forEach((row) => {
    if ((row.MiNapSu < 0 && row.UnitNm === 'M') || (row.MiNapQty < 0 && row.UnitNm !== 'M')) minusMinap += 1;
  });
  if (minusMinap > 0) {
    // MenuStore.setAlert({ visible: true, desc: '미납량을 확인하세요.' });
    MenuStore.setToast({ visible: true, desc: '미납량을 확인하세요.', type: 'W' });
    return;
  }

  paramDetail.forEach((items) => {
    for (const [key, value] of Object.entries(items)) {
      if (typeof items[key] === 'string') items[key] = value.trim();
    }
  });
  try {
    let result = await axios.post('/@api/supply/supplyItem/updateByList', {
      header: paramVO,
      detail: paramDetail,
    });
    const resultData = result.data;
    if (resultData.errmess !== '') {
      MenuStore.setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
      return refSupNo.current;
    }
    // MenuStore.setAlert({ visible: true, desc: '문서 저장이 완료되었습니다. ' });
    MenuStore.setToast({ visible: true, desc: '문서 저장이 완료되었습니다.', type: 'W', duration: 2000 });
    refSupNo.current = resultData.SupNo;
    setTimeout(async () => {
      await fSearchProc(MenuStore, searchVO, dataProvider1, '');
      await fSearchSupplyItem(MenuStore, searchVO, dataProvider2, refSupNo, supplyDate);
      await fGetSupNoList(MenuStore, searchVO, setSupNoList, supplyDate);
      setSupNo({ value: resultData.SupNo, text: resultData.SupNo });
    }, 100);
    return resultData.SupNo;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다.${e}` });
  }
};

export const fItemDeleteProc = async (MenuStore, searchVO, dataProvider2, gridView2, refSupNo, supplyDate, setSupNoList, setSupNo, dataProvider1) => {
  const paramVO = { ...searchVO };
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;
  paramVO.SupNo = refSupNo.current;
  paramVO.supplyDate = moment(supplyDate).format('YYYYMMDD');
  let jDeletedDatas = [];
  const deleted = gridView2.getCheckedItems(true);

  deleted.forEach((itemIndex) => {
    const rowData = dataProvider2.getJsonRow(itemIndex);
    jDeletedDatas.push(rowData);
  });
  try {
    let result = await axios.post('/@api/supply/supplyItem/deleteByItem', {
      data: paramVO,
      item: jDeletedDatas,
    });
    const data = result.data;
    if (data.errmess !== '') {
      MenuStore.setAlert({ visible: true, desc: data.errmess, type: 'E' });
      return refSupNo.current;
    }
    // MenuStore.setAlert({ visible: true, desc: '납품서 내역이 삭제되었습니다.' });
    MenuStore.setToast({ visible: true, desc: '납품서 내역이 삭제되었습니다.', type: 'W', duration: 2000 });
    refSupNo.current = data.SupNo;
    setTimeout(async () => {
      await fSearchProc(MenuStore, searchVO, dataProvider1, '');
      await fSearchSupplyItem(MenuStore, searchVO, dataProvider2, refSupNo, supplyDate);
      await fGetSupNoList(MenuStore, searchVO, setSupNoList, supplyDate, setSupNo, refSupNo);
      if (dataProvider2.getJsonRows().length < 1) setSupNo({ value: 'NEW', text: '신규' });
    }, 100);

    return data.SupNo;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '납품서 내역 삭제 중 오류가 발생했습니다.' });
  }
};

export const fConvert = async (MenuStore, su, unit, GoodCd) => {
  try {
    const result = await axios.get('@api/purchase/purchaseStorage/searchConvertValue', {
      params: { SchGoodcd: GoodCd, SchConvertUnit: unit, SchConvertValue: su },
    });
    if (!result.data) return;
    if (result.data.returnValue !== 0) {
      return result.data.returnValue;
    }
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '단위 환산 중 오류가 발생하였습니다.' });
  }
};

export const fPrintProc = async (MenuStore, searchVO, setPrintView, refSupNo) => {
  try {
    const result = await axios.get('@api/supply/supplyItem/selectByPrint', {
      params: { CustCd: searchVO.SchCustCd, SupNo: refSupNo.current, SchAccunit: MenuStore.User.user.accunit, SchFactory: MenuStore.User.user.factory },
    });
    if (!result.data) {
      // MenuStore.setAlert({ visible: true, desc: '출력자료 조회 결과가 없습니다.' });
      MenuStore.setToast({ visible: true, desc: '출력자료 조회 결과가 없습니다.', type: 'W', duration: 2000 });
    } else {
      setPrintView(true);
      const rdata = '{ "data": ' + JSON.stringify(result.data) + ' }';
      MenuStore.Util.Report.fReport(rdata, '/주문발주처리_거래명세서.mrd', process.env.VITE_APP_RD_SERVER_URL, process.env.VITE_APP_RD_CLIENT_URL);
    }
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '출력자료 조회중 오류가 발생하였습니다.' });
  }
};

export const fMultiConvert = async (MenuStore, refData2Arr) => {
  let arr = { arr: refData2Arr.current };
  try {
    const result = await axios.get('@api/supply/supplyItem/convertMultiValues', {
      params: { items: arr },
    });
    if (!result.data) return;
    return result.data;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '단위 환산 중 오류가 발생하였습니다.' });
  }
};
