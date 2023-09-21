import axios from 'axios';
import moment from 'moment';

export const fInit = (setSearchVO, UserStore) => {
  setSearchVO({
    SchAccunit: UserStore.user.accunit,
    SchFactory: UserStore.user.factory,
    SchPno: UserStore.user.userid,
    SchCustCd: '',
    SchCustCdNm: '',
    SchFrDate: moment().subtract(1, 'month'),
    SchToDate: new Date(),
    SchDelvYn: '1',
    DeptCd: UserStore.user.deptcd,
  });
};

export const fSearchProc = async (MenuStore, searchVO, Provider, title, fromsave) => {
  if (MenuStore.Util.Common.fValidate(!moment(searchVO.SchFrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.SchToDate, 'YYYY-MM-DD').isValid(), '조회기간을 바르게 입력해 주세요.')) return;
  if (MenuStore.Util.Common.fValidate(moment(searchVO.SchFrDate).format('YYYYMMDD') > moment(searchVO.SchToDate).format('YYYYMMDD'), '조회기간을 확인해 주세요.')) return;

  const paramVO = { ...searchVO };
  paramVO.SchFrDate = moment(paramVO.SchFrDate).format('YYYYMMDD');
  paramVO.SchToDate = moment(paramVO.SchToDate).format('YYYYMMDD');

  if (fromsave) {
    paramVO.SchDelvYn = '0';
  }

  await MenuStore.Util.Command.fSearch(Provider, '/@api/purchase/orderToDelv/selectByList', paramVO, title);
};

export const fSearchDetail = async (MenuStore, searchVO, provider, CustCd, SupNo) => {
  const paramVO = { ...searchVO };
  paramVO.SupNo = SupNo.current;
  paramVO.CustCd = CustCd.current;

  try {
    const resultData = await MenuStore.Util.Command.fSearchByReturn('/@api/purchase/orderToDelv/selectByDetailList', paramVO);

    provider.setRows(resultData);
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: '상세내역 조회중 오류가 발생하였습니다.', type: 'E' });
  }
};

export const fSaveProc = async (MenuStore, searchVO, dataProvider1, gridView1) => {
  const paramVO = { ...searchVO };
  let paramDetail = [];
  const inserted = gridView1.getCheckedItems(true);
  inserted.forEach((i) => {
    const rowData = dataProvider1.getJsonRow(i);
    paramDetail.push(rowData);
  });

  try {
    let result = await axios.post('/@api/purchase/orderToDelv/insertByList', {
      header: paramVO,
      detail: paramDetail,
    });
    const resultData = result.data;
    if (resultData.errmess !== '') {
      MenuStore.setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
      return;
    }
    MenuStore.setAlert({ visible: true, desc: '입고가 완료되었습니다.' });
    setTimeout(async () => {
      await fSearchProc(MenuStore, searchVO, dataProvider1, '', 'fromsave');
    }, 100);
    return resultData.SupNo;
  } catch (e) {
    MenuStore.setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다.${e}` });
  }
};
