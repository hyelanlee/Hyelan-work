import axios from 'axios';
import moment from 'moment';

export const fInit = (setSearchVO, UserStore) => {
  setSearchVO({
    Accunit: UserStore.user.accunit,
    ReferenceDate: moment().format('YYYY-MM-DD'),
    NapDate: moment().format('YYYY-MM-DD'),
    FrDate: moment().startOf('month').format('YYYY-MM-DD'),
    ToDate: moment().format('YYYY-MM-DD'),
    CustCd: '',
    CustCdNm: '',
    Clastype: '0',
    Supply: '0',
    Factory: UserStore.user.factory,
    Category: '0',
    SaftyStock: false,
    BoxingYn: 0,
    Class2: '',
    Class2Nm: '',
    Class3: '',
    Class3Nm: '',
    Class4: '',
    Class4Nm: '',
    Class5: '',
    Class5Nm: '',
    GoodNo: '',
  });
};

// 재고장 - 상품, 제품, 반제품
export const fSearchProc0 = async (MenuStore, searchVO, Provider, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.ReferenceDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.NapDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) {
    return;
  }

  const paramVO = { ...searchVO };
  paramVO.ReferenceDate = moment(paramVO.ReferenceDate).format('YYYYMMDD');
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList10', paramVO, title);
};

// 재고장 - 원재료, 단조
export const fSearchProc0_1 = async (MenuStore, searchVO, Provider, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.ReferenceDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.NapDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) {
    return;
  }

  const paramVO = { ...searchVO };
  paramVO.ReferenceDate = moment(paramVO.ReferenceDate).format('YYYYMMDD');
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList1_1', paramVO, title);
};

// 구매발주내역(전체)
export const fSearchProc1 = async (MenuStore, searchVO, Provider, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.FrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.ToDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) {
    return;
  }
  if (MenuStore.Util.Common.fValidate(moment(searchVO.FrDate).format('YYYYMMDD') > moment(searchVO.ToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.FrDate = moment(paramVO.FrDate).format('YYYYMMDD');
  paramVO.ToDate = moment(paramVO.ToDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList11', paramVO, title);
};

// 외주발주내역(전체)
export const fSearchProc2 = async (MenuStore, searchVO, Provider, title) => {
  if (
    MenuStore.Util.Common.fValidate(
      !moment(searchVO.FrDate, 'YYYY-MM-DD').isValid() ||
        !moment(searchVO.ToDate, 'YYYY-MM-DD').isValid() ||
        !moment(searchVO.ReferenceDate, 'YYYY-MM-DD').isValid() ||
        !moment(searchVO.NapDate, 'YYYY-MM-DD').isValid(),
      '검색 조건 일자를 바르게 입력하세요',
    )
  )
    return;

  if (MenuStore.Util.Common.fValidate(moment(searchVO.FrDate).format('YYYYMMDD') > moment(searchVO.ToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.FrDate = moment(paramVO.FrDate).format('YYYYMMDD');
  paramVO.ToDate = moment(paramVO.ToDate).format('YYYYMMDD');
  paramVO.ReferenceDate = moment(paramVO.ReferenceDate).format('YYYYMMDD');
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList12', paramVO, title);
};

// 생산입고대장(전체)
export const fSearchProc3 = async (MenuStore, searchVO, Provider, view, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.FrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.ToDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) return;

  if (MenuStore.Util.Common.fValidate(moment(searchVO.FrDate).format('YYYYMMDD') > moment(searchVO.ToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.FrDate = moment(paramVO.FrDate).format('YYYYMMDD');
  paramVO.ToDate = moment(paramVO.ToDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList13', paramVO, title);
  let fittingE8 = 0;
  let valveV8 = 0;
  let pmsYnSa = 0;
  let pmsYnJu = 0;
  let PmsYnAfter = 0;
  let halfProd = 0;
  let fittingE4 = 0;
  let valveV4 = 0;
  let product = 0;
  Provider.getJsonRows().forEach((row) => {
    if (row.PmsYn === '사내') {
      pmsYnSa += row.Prodqty;
    }
    if (row.PmsYn === '외주') {
      pmsYnJu += row.Prodqty;
    }
    if (row.PmsYn === '외주-후가공') {
      PmsYnAfter += row.Prodqty;
    }
    if (row.Goodtypenm === '반제품') {
      halfProd += row.Prodqty;
    }
    if (row.Goodtypenm === '제품') {
      product += row.Prodqty;
    }
    if (row.Gubun_Total === 'E8') {
      fittingE8 += row.Prodqty;
    }
    if (row.Gubun_Total === 'V8') {
      valveV8 += row.Prodqty;
    }
    if (row.Gubun_Total === 'E4') {
      fittingE4 += row.Prodqty;
    }
    if (row.Gubun_Total === 'V4') {
      valveV4 += row.Prodqty;
    }
  });
  view
    .columnByField('Prodqty')
    .setFooters([
      { text: fittingE8.toLocaleString('ko-KR') },
      { text: valveV8.toLocaleString('ko-KR') },
      { text: pmsYnSa.toLocaleString('ko-KR') },
      { text: pmsYnJu.toLocaleString('ko-KR') },
      { text: PmsYnAfter.toLocaleString('ko-KR') },
      { text: halfProd.toLocaleString('ko-KR') },
      { text: fittingE4.toLocaleString('ko-KR') },
      { text: valveV4.toLocaleString('ko-KR') },
      { text: product.toLocaleString('ko-KR') },
    ]);
};

// 발주/외주입고내역(전체)
export const fSearchProc5 = async (MenuStore, searchVO, Provider, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.FrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.ToDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) return;

  if (MenuStore.Util.Common.fValidate(moment(searchVO.FrDate).format('YYYYMMDD') > moment(searchVO.ToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.FrDate = moment(paramVO.FrDate).format('YYYYMMDD');
  paramVO.ToDate = moment(paramVO.ToDate).format('YYYYMMDD');

  await MenuStore.Util.Command.fSearch(Provider, '/@api/stock/inventoryBook/selectByList15', paramVO, title);
};

// 반제품입고내역(보고용) - 품번별입고내역, 기간별집계자료
export const fSearchProc7 = async (MenuStore, searchVO, Provider, Provider2, title) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.FrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.ToDate, 'YYYY-MM-DD').isValid(), '검색 조건 일자를 바르게 입력하세요')) return;

  if (MenuStore.Util.Common.fValidate(moment(searchVO.FrDate).format('YYYYMMDD') > moment(searchVO.ToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.FrDate = moment(paramVO.FrDate).format('YYYYMMDD');
  paramVO.ToDate = moment(paramVO.ToDate).format('YYYYMMDD');

  if (!Provider || !Provider2) return;
  Provider.clearRows();
  Provider2.clearRows();

  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByList17', {
      params: paramVO,
    });
    const data = result.data;
    data.grid1.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    data.grid1.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });

    if (data.grid1.length === 0 && data.grid2.length === 0) {
      MenuStore.setToast({ visible: true, desc: title + ' 조회 결과가 없습니다.', type: 'W', duration: 2000 });
    } else {
      Provider.setRows(data.grid1);
      Provider2.setRows(data.grid2);
    }
  } catch (error) {
    MenuStore.setAlert({ visible: true, desc: title + ' 조회 중 오류가 발생했습니다.', type: 'E' });
  }
};

// 재고장 - 상품, 제품, 반제품 - 수주동향, 출고동향, 작업지시서발행내역
export const fSearchDetail10 = async (MenuStore, searchVO, dataProviders, views, goodcd) => {
  if (!dataProviders) return;
  const paramVO = { ...searchVO.current };
  paramVO.ReferenceDate = moment(paramVO.ReferenceDate).format('YYYYMMDD');
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');
  paramVO.goodcd = goodcd;
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;

  dataProviders.forEach((provider) => {
    provider.clearRows();
  });
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList10', {
      params: paramVO,
    });
    const data = result.data;
    data.grid1.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    dataProviders[0].setRows(data.grid1);
    dataProviders[1].setRows(data.grid2);
    dataProviders[2].setRows(data.grid3);

    const fields = ['Be_11_Month', 'Be_10_Month', 'Be_09_Month', 'Be_08_Month', 'Be_07_Month', 'Be_06_Month', 'Be_05_Month', 'Be_04_Month', 'Be_03_Month', 'Be_02_Month', 'Be_01_Month', 'Be_00_Month'];
    const newFields = ['T_11_Month', 'T_10_Month', 'T_09_Month', 'T_08_Month', 'T_07_Month', 'T_06_Month', 'T_05_Month', 'T_04_Month', 'T_03_Month', 'T_02_Month', 'T_01_Month', 'T_00_Month'];
    fields.forEach((value) => {
      let header = views[0].getColumnProperty(value, 'header');
      let header1 = views[1].getColumnProperty(value, 'header');
      newFields.forEach((value2) => {
        if (value.substring(3, 6) === value2.substring(2, 5)) {
          header.text = dataProviders[0].getValue(0, value2);
          header1.text = dataProviders[1].getValue(0, value2);
          views[0].setColumnProperty(value, 'header', header);
          views[1].setColumnProperty(value, 'header', header1);
        }
      });
    });

    // for (let index = 11; index === 0; index--) {
    //   console.log('index', index);
    // let newIndex = index.length === 2 ? index : (index = '0' + index);
    // console.log('newIndex', newIndex);
    // let header = gridView10_1.getColumnProperty(`Be_${newIndex}_Month`, 'header');
    // header.text = dataProvider10_1.getValue(0, `T_${newIndex}_Month`);
    // gridView10_1.setColumnProperty(`Be_${newIndex}_Month`, 'header', header);
    // }
    // gridView10_1.setColumnProperty('Be_11_Month', 'header', header);
  } catch (error) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다.', type: 'E' });
  }
};

// 재고장 - 상품, 제품, 반제품 - 구매발주내역
export const fSearchDetail104 = async (MenuStore, searchVO, provider, goodcd) => {
  if (!provider) return;
  const paramVO = { ...searchVO.current };
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;
  paramVO.goodcd = goodcd;

  provider.clearRows();
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList14', { params: paramVO });
    const data = result.data;
    data.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    provider.setRows(data);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다', type: 'E' });
  }
};

// 재고장 - 상품, 제품, 반제품 - 외주발주내역
export const fSearchDetail105 = async (MenuStore, searchVO, provider, goodcd) => {
  if (!provider) return;
  const paramVO = { ...searchVO.current };
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;
  paramVO.goodcd = goodcd;

  provider.clearRows();
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList15', { params: paramVO });
    const data = result.data;
    data.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    provider.setRows(data);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다', type: 'E' });
  }
};

// 재고장 - 상품, 제품, 반제품 - 미결수주내역
export const fSearchDetail106 = async (MenuStore, searchVO, provider, goodcd) => {
  if (!provider) return;
  const paramVO = { ...searchVO.current };
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;
  paramVO.goodcd = goodcd;
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');

  provider.clearRows();
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList16', { params: paramVO });
    const data = result.data;
    data.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    provider.setRows(data);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다', type: 'E' });
  }
};

// 재고장 - 상품, 제품, 반제품 - 출고요청내역
export const fSearchDetail107 = async (MenuStore, searchVO, provider, goodcd) => {
  if (!provider) return;
  const paramVO = { ...searchVO.current };
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;
  paramVO.goodcd = goodcd;
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');

  provider.clearRows();
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList17', { params: paramVO });
    const data = result.data;
    data.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });
    provider.setRows(data);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다', type: 'E' });
  }
};

// 재고장 - 원재료, 단조 - 출고동향, 외주발주내역, 출고요청내역
export const fSearchDetail11 = async (MenuStore, searchVO, dataProviders, views, goodcd) => {
  if (!dataProviders) return;
  const paramVO = { ...searchVO.current };
  paramVO.ReferenceDate = moment(paramVO.ReferenceDate).format('YYYYMMDD');
  paramVO.NapDate = moment(paramVO.NapDate).format('YYYYMMDD');
  paramVO.goodcd = goodcd;
  paramVO.Accunit = MenuStore.User.user.accunit;
  paramVO.Factory = MenuStore.User.user.factory;

  dataProviders.forEach((provider) => {
    provider.clearRows();
  });
  try {
    let result = await axios.get('/@api/stock/inventoryBook/selectByDetailList11', {
      params: paramVO,
    });
    const data = result.data;
    dataProviders[0].setRows(data.grid1);
    dataProviders[1].setRows(data.grid2);
    dataProviders[2].setRows(data.grid3);

    const fields = ['Be_11_Month', 'Be_10_Month', 'Be_09_Month', 'Be_08_Month', 'Be_07_Month', 'Be_06_Month', 'Be_05_Month', 'Be_04_Month', 'Be_03_Month', 'Be_02_Month', 'Be_01_Month', 'Be_00_Month'];
    const newFields = ['T_11_Month', 'T_10_Month', 'T_09_Month', 'T_08_Month', 'T_07_Month', 'T_06_Month', 'T_05_Month', 'T_04_Month', 'T_03_Month', 'T_02_Month', 'T_01_Month', 'T_00_Month'];
    fields.forEach((value) => {
      let header = views[0].getColumnProperty(value, 'header');
      newFields.forEach((value2) => {
        if (value.substring(3, 6) === value2.substring(2, 5)) {
          header.text = dataProviders[0].getValue(0, value2);
          views[0].setColumnProperty(value, 'header', header);
        }
      });
    });
  } catch (error) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회 중 오류가 발생했습니다.', type: 'E' });
  }
};
