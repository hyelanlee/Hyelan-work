import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { observer } from 'mobx-react-lite';
import useStores from '@stores/useStores';
import { RadioButton, TextBox, Label } from 'rc-easyui';
import { Box } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import { Utility } from '@components/common/Utility/Utility';
import CommonButton from '@components/common/CommonButton';
import CommonDatePicker from '@components/common/CommonDatePicker';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import { GridColumns1, GridFields1 } from '../view/QcDelvGrid';
import QcDelvState from '../view/QcDelvState';
import * as Presenter from '../presenter/QcDelvPresenter';
import { StylesMain } from '../view/QcDelvStyle';
import QcDelvList from '../view/QcDelvList';

const QcDelv = observer(() => {
  const PGMID = 'QCDELV';
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();

  const { searchVO, setSearchVO, alert, setAlert, confirm, setConfirm, gridFocus, setGridFocus } = QcDelvState();
  const Util = new Utility(PGMID, setAlert, true, true, true, true, true);

  const GridViewBindDetail = (view) => {
    gridView1 = view;
  };
  const DataProviderBindDetail = (provider) => {
    dataProvider1 = provider;
  };

  const fInit = () => {
    Presenter.fInit(setSearchVO, $UserStore);
  };

  const [MenuStore] = useState({
    Util: Util,
    User: $UserStore,
    fInit: fInit,
    setAlert: setAlert,
    // searchVO: searchVO,
  });

  const fNewRowChk = () => {
    const rows = dataProvider1.getAllStateRows().created;
    if (rows.length > 0) {
      let emptyCnt = 0;
      // rows.map((item) => {
      //   if (itemIndex === undefined || item >= itemIndex) {
      //     const datas = gridView2.getValues(item);
      //     if (!datas.GoodCd || datas.GoodCd === undefined || !datas.Qty || datas.Qty === undefined) {
      //       emptyCnt += 1;
      //     }
      //   }
      // });
      return emptyCnt;
    }
    return 0;
  };

  const TabGrid = () => {
    Util.Grid.fTab(gridView1, fNewRowChk() === 0, 'No');
  };

  //--------------------------------------- CRUD Start-------------------------------------------//
  const fNew = async () => {};

  const fSearch = async () => {
    await Presenter.fSearchProc(MenuStore, searchVO, dataProvider1, '납품 목록');
  };

  const fSave = async () => {
    gridView1.commit();
    if (dataProvider1.getJsonRows().length <= 0) {
      setAlert({ visible: true, desc: '등록할 자료가 없습니다' });
      return;
    }

    if (Util.Common.fValidate(gridView1.getCheckedItems(true).length < 1, '검사등록할 내역 체크하세요.')) return;

    let selected = [];
    selected = gridView1.getCheckedItems(true);

    let selectedRows = [];
    selected.forEach((row) => {
      const selectedRow = dataProvider1.getJsonRow(row);
      selectedRows.push(selectedRow);
    });
    if (selectedRows.some((item) => item.QcErrorQty !== 0 && item.QcErrorDescNm === '')) {
      setAlert({ visible: true, desc: '불량사유를 입력하세요' });
      return;
    }

    if (selectedRows.some((item) => item.SupplyDate > moment(searchVO.SchQcDate).format('YYYY-MM-DD'))) {
      setAlert({ visible: true, desc: '검사날짜가 납품날짜보다 더 빠를 수 없습니다.' });
      return;
    }

    selected.forEach((row) => {
      dataProvider1.setValue(row, 'QcDate', moment(searchVO.SchQcDate).format('YYYYMMDD'));
    });
    setConfirm({ visible: true, desc: moment(searchVO.SchQcDate).format('YYYY-MM-DD') + ' 날짜에 검사 실적을 등록하시겠습니까?', id: 'SAVE' });
  };

  const fDelete = async () => {
    if (Util.Common.fValidate(gridView1.getCheckedItems(true).length < 1, '삭제할 내역 체크하세요.')) return;
    setConfirm({ visible: true, desc: '검사실적을 삭제하시겠습니까?', id: 'DELETE' });
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });
    if (confirm.id === 'SAVE') {
      // const SupNo = await Presenter.fSaveProc(MenuStore, searchVO, dataProvider1, gridView1);
      setSearchVO({ ...searchVO, SchQcComplate: '0' });
      await Presenter.fSaveProc(MenuStore, searchVO, dataProvider1, gridView1);
    } else if (confirm.id === 'DELETE') {
      setSearchVO({ ...searchVO, SchQcComplate: '0' });
      await Presenter.fDeleteProc(MenuStore, searchVO, dataProvider1, gridView1);
    }
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };
  //--------------------------------------- CRUD End-------------------------------------------//
  //--------------------------------------- Side Start-------------------------------------------//
  const fSetValue = (id, value, name) => {
    switch (id) {
      case 'schCustNm':
        Util.Common.fMultiFieldChange(setSearchVO, {
          SchCustCd: value,
          SchCustNm: name,
        });
        break;
      case 'SchPno':
        Util.Common.fMultiFieldChange(setSearchVO, {
          SchPno: value,
          SchPnoNm: name,
        });
        break;
    }
  };

  const fChooseType = (value, checked) => {
    if (checked) {
      setSearchVO({ ...searchVO, SchQcComplate: value });
    }
  };
  //--------------------------------------- Side End-------------------------------------------//

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch, fSave, fDelete);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();

    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);

  return (
    <>
      <CommonButton pgmid={PGMID} visible="01110" onNew={fNew} onSearch={fSearch} onSave={fSave} onDelete={fDelete} />
      <PerfectScrollbar className="mainCon">
        <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ padding: 1, border: '1px solid #e2e2e2', borderRadius: 5, backgroundColor: '#f9f9f9' }}>
          <Box style={{ display: 'flex', alignItems: 'center ' }}>
            <Box style={{ marginTop: 2, marginLeft: 0, display: 'flex', alignItems: 'center' }}>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>납품날짜조회</Box>
                <CommonDatePicker
                  inputCls="inputCls"
                  selected={searchVO.SchFrDate}
                  inputId={Util.Common.fMakeId('SchFrDate')}
                  onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchFrDate', value)}
                />
                <Box style={{ margin: '0 3px', width: '10px' }}>~</Box>
                <CommonDatePicker
                  inputCls="inputCls"
                  selected={searchVO.SchToDate}
                  inputId={Util.Common.fMakeId('SchToDate')}
                  onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchToDate', value)}
                />
              </Box>
            </Box>

            <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>검사조회구분</Box>
              </Box>
              <Box style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                <RadioButton
                  className={classes.Radio}
                  inputId={Util.Common.fMakeId('all')}
                  inputCls="inputCls"
                  value="0"
                  groupValue={searchVO.SchQcComplate}
                  onChange={(checked) => fChooseType('0', checked)}
                  style={{ marginLeft: 5 }}
                />
                <Label htmlFor={Util.Common.fMakeId('all')} className={classes.RadioLabel}>
                  전체
                </Label>

                <Box>
                  <RadioButton
                    className={classes.Radio}
                    inputId={Util.Common.fMakeId('mi')}
                    inputCls="inputCls"
                    value="1"
                    groupValue={searchVO.SchQcComplate}
                    onChange={(checked) => fChooseType('1', checked)}
                    style={{ marginLeft: 5 }}
                  />
                  <Label htmlFor={Util.Common.fMakeId('mi')} className={classes.RadioLabel}>
                    미검사
                  </Label>
                </Box>

                <Box>
                  <RadioButton
                    className={classes.Radio}
                    inputId={Util.Common.fMakeId('done')}
                    inputCls="inputCls"
                    value="2"
                    groupValue={searchVO.SchQcComplate}
                    onChange={(checked) => fChooseType('2', checked)}
                    style={{ marginLeft: 5 }}
                  />
                  <Label htmlFor={Util.Common.fMakeId('done')} className={classes.RadioLabel}>
                    검사
                  </Label>
                </Box>
              </Box>
            </Box>

            <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>조회납품번호</Box>
              </Box>
              {/* <Box style={{ display: 'flex', alignItems: 'center' }}> */}
              <TextBox
                inputId={Util.Common.fMakeId('SchSupNo')}
                inputCls="inputCls"
                className={classes.SC3}
                onChange={(value) => {
                  Util.Common.fFieldChange(setSearchVO, 'SchSupNo', value);
                }}
                value={searchVO.SchSupNo}
              />
              {/* </Box> */}
            </Box>

            <CodeHelperPopup
              title="거래처"
              inputCls="inputCls"
              pgmid={PGMID}
              inputType="Cust"
              id="schCustNm"
              helper={Util.CodeHelper.helperCust}
              ComponentCode={searchVO.SchCustCd}
              ComponentValue={searchVO.SchCustNm}
              SetValue={fSetValue}
              labelStyles={{ width: 70, height: 25, margin: '0px 3px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 150, margin: '0px 0px 5px 7px' }}
            />
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center ' }}>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>검사날짜입력</Box>
              <CommonDatePicker
                inputCls="inputCls"
                selected={searchVO.SchQcDate}
                inputId={Util.Common.fMakeId('SchQcDate')}
                onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchQcDate', value)}
              />
            </Box>
            <CodeHelperPopup
              title="입력자"
              inputCls="inputCls"
              pgmid={PGMID}
              inputType="Pno"
              id="SchPno"
              helper={Util.CodeHelper.helperPnoNm}
              ComponentCode={searchVO.SchPno}
              ComponentValue={searchVO.SchPnoNm}
              SetValue={fSetValue}
              labelStyles={{ width: 70, height: 25, margin: '0px 1px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 150, margin: '0px 0px 3px 1px' }}
            />
          </Box>
        </Box>

        <Box style={{ marginTop: 5 }}>
          <QcDelvList
            Util={Util}
            Id="Grid1"
            GridFields={GridFields1}
            GridColumns={GridColumns1}
            setGridFocus={setGridFocus}
            setAlert={setAlert}
            TabGrid={TabGrid}
            DataProviderBind={DataProviderBindDetail}
            GridViewBind={GridViewBindDetail}
          />
        </Box>
      </PerfectScrollbar>
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

let gridView1;
let dataProvider1;

const Styles = createUseStyles(StylesMain);
export default QcDelv;
