import axios from 'axios';
import moment from 'moment';

export const fInit = (setSearchVO, UserStore) => {
  setSearchVO({
    SchAccunit: UserStore.user.accunit,
    SchFactory: UserStore.user.factory,
    SchPno: UserStore.user.userid,
    SchPnoNm: UserStore.user.username.trim(),
    SchQcComplate: '0',
    SchFrDate: moment().subtract(1, 'month'),
    SchToDate: new Date(),
    SchQcDate: new Date(),
    SchSupNo: '',
    SchCustCd: '',
    SchCustNm: '',
  });
};

export const fSearchProc = async (MenuStore, searchVO, provider, title, fromSave) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.SchFrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.SchToDate, 'YYYY-MM-DD').isValid(), '조회기간을 바르게 입력해 주세요.')) return;

  if (MenuStore.Util.Common.fValidate(moment(searchVO.SchFrDate).format('YYYYMMDD') > moment(searchVO.SchToDate).format('YYYYMMDD'), '조회기간을 확인하세요.')) return;
  const paramVO = { ...searchVO };
  paramVO.SchFrDate = moment(paramVO.SchFrDate).format('YYYYMMDD');
  paramVO.SchToDate = moment(paramVO.SchToDate).format('YYYYMMDD');
  if (fromSave) {
    paramVO.SchQcComplate = '0';
  }

  await MenuStore.Util.Command.fSearch(provider, '/@api/quality/qcDelv/selectByList', paramVO, title);
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

export const fSaveProc = async (MenuStore, searchVO, dataProvider1, gridView1) => {
  gridView1.commit();
  const paramVO = { ...searchVO };
  let selected = [];
  selected = gridView1.getCheckedItems(true);

  let paramDetail = [];
  selected.forEach((row) => {
    const selectedRow = dataProvider1.getJsonRow(row);
    paramDetail.push(selectedRow);
  });
  // const checkResult = MenuStore.Util.Grid.fCheckGridData(dataProvider1, paramDetail, '', '');

  paramDetail.forEach((items) => {
    for (const [key, value] of Object.entries(items)) {
      if (typeof items[key] === 'string') items[key] = value.trim();
    }
  });
  try {
    let result = await axios.post('/@api/quality/QcDelv/updateByList', {
      header: paramVO,
      detail: paramDetail,
    });
    const resultData = result.data;
    if (resultData.errmess !== '') {
      MenuStore.setAlert({ visible: true, desc: resultData.errmess, type: 'W' });
      return;
    }
    MenuStore.setAlert({ visible: true, desc: '검사실적이 저장되었습니다.' });
    setTimeout(async () => {
      await fSearchProc(MenuStore, searchVO, dataProvider1, '', 'fromSave');
    }, 100);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다. ${e}` });
  }
};

export const fDeleteProc = async (MenuStore, searchVO, dataProvider1, gridView1) => {
  gridView1.commit();
  const paramVO = { ...searchVO };
  let selected = [];
  selected = gridView1.getCheckedItems(true);

  let selectedRows = [];
  selected.forEach((row) => {
    const selectedRow = dataProvider1.getJsonRow(row);
    selectedRows.push(selectedRow);
  });
  selectedRows.forEach((row) => {
    if (row.QcDate) {
      row.QcDate = moment(row.QcDate).format('YYYYMMDD');
    } else row.QcDate = '';
  });

  try {
    let result = await axios.post('/@api/quality/QcDelv/updateByDelete', {
      header: paramVO,
      detail: selectedRows,
    });
    const resultData = result.data;
    if (resultData.errmess !== '') {
      MenuStore.setAlert({ visible: true, desc: resultData.errmess, type: 'W' });
      return;
    }
    MenuStore.setAlert({ visible: true, desc: '검사실적 삭제가 완료되었습니다.' });
    setTimeout(async () => {
      await fSearchProc(MenuStore, searchVO, dataProvider1, '', 'fromSave');
    }, 100);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: `삭제 중 오류가 발생하였습니다. ${e}` });
  }
};
