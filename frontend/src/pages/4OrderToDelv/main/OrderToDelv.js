import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { observer } from 'mobx-react-lite';
import useStores from '@stores/useStores';
import { Utility } from '@components/common/Utility/Utility';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Label, RadioButton } from 'rc-easyui';
import { Box } from '@material-ui/core';
import CommonButton from '@root/components/common/CommonButton';
import CommonDatePicker from '@components/common/CommonDatePicker';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';
import { StylesMain } from '../view/OrderToDelvStyle';
import OrderToDelvState from '../view/OrderToDelvState';
import OrderToDelvHeaderGrid from '../view/OrderToDelvHeaderGrid';
import OrderToDelvDetailGrid from '../view/OrderToDelvDetailGrid';
import { GridColumns1, GridFields1, GridFields2, GridColumns2 } from '../view/OrderToDelvGrid';
import * as Presenter from '../presenter/OrderToDelvPresenter';

const OrderToDelv = observer(() => {
  const PGMID = 'ORDERTODELV';
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();

  const { searchVO, setSearchVO, alert, setAlert, confirm, setConfirm } = OrderToDelvState();

  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);
  const refIndex = useRef(0);
  const refSupNo = useRef('');
  const refCustCd = useRef('');

  const fInit = () => {
    Presenter.fInit(setSearchVO, $UserStore);
  };

  const [MenuStore] = useState({
    Util: Util,
    User: $UserStore,
    fInit: fInit,
    setAlert: setAlert,
  });

  //--------------------------------------- Binding Start-------------------------------------------//

  const GridViewBindHeader = (view) => {
    gridView1 = view;
  };
  const DataProviderBindHeader = (provider) => {
    dataProvider1 = provider;
  };
  const GridViewBindDetail = (view) => {
    gridView2 = view;
  };
  const DataProviderBindDetail = (provider) => {
    dataProvider2 = provider;
  };

  //--------------------------------------- Binding End-------------------------------------------//

  const HeaderListChanged = (grid, index) => {
    gridView2.commit(true);
    // setGridFocus('H');
    refSupNo.current = dataProvider1.getValue(index, 'SupNo');
    refCustCd.current = dataProvider1.getValue(index, 'CustCd');
    Presenter.fSearchDetail(MenuStore, searchVO, dataProvider2, refCustCd, refSupNo);
    setTimeout(() => {
      refIndex.current = index;
    }, 200);
  };

  //--------------------------------------- Side Start-------------------------------------------//
  const fSetValue = (id, value, name) => {
    switch (id) {
      case 'schCustNm':
        Util.Common.fMultiFieldChange(setSearchVO, {
          SchCustCd: value,
          SchCustCdNm: name,
        });
        return;
    }
  };

  const fChooseType = (checked, value) => {
    if (checked) {
      setSearchVO({ ...searchVO, SchDelvYn: value });
    }
  };
  //--------------------------------------- Side End-------------------------------------------//
  //--------------------------------------- CRUD Start-------------------------------------------//
  const fNew = () => {};

  const fSearch = async () => {
    await Presenter.fSearchProc(MenuStore, searchVO, dataProvider1, '납품 목록');
  };

  const fSave = async () => {
    if (Util.Common.fValidate(gridView1.getCheckedItems(true).length < 1, '저장할 납품 내역을 선택하세요.')) return;
    const count = gridView1.getCheckedItems(true).length;
    setConfirm({ visible: true, desc: count + '건을 입고하시겠습니까?', id: 'Save' });
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });
    if (confirm.id === 'Save') {
      setSearchVO({ ...searchVO, SchDelvYn: '0' });
      await Presenter.fSaveProc(MenuStore, searchVO, dataProvider1, gridView1);
    }
  };

  //--------------------------------------- CRUD End-------------------------------------------//

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch, fSave);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();

    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);

  return (
    <>
      <CommonButton pgmid={PGMID} visible="01100" onNew={fNew} onSearch={fSearch} onSave={fSave} />
      <PerfectScrollbar className="mainCon">
        <Box style={{ display: 'flex', alignItems: 'center', padding: 1, border: '1px solid #e2e2e2', borderRadius: 5, backgroundColor: '#f9f9f9' }}>
          <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
            <CodeHelperPopup
              title="거래처명"
              inputCls="inputCls"
              pgmid={PGMID}
              inputType="Cust"
              id="schCustNm"
              helper={Util.CodeHelper.helperCust}
              ComponentCode={searchVO.SchCustCd}
              ComponentValue={searchVO.SchCustCdNm}
              SetValue={fSetValue}
              labelStyles={{ width: 70, height: 25, margin: '0px 3px 5px 3px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 235, margin: '0px 0px 5px 7px' }}
            />
          </Box>

          <Box className={classes.SC4} style={{ marginLeft: 15 }}>
            <Box className={classes.SC1}>기간</Box>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Box>
              <CommonDatePicker
                inputCls="inputCls"
                selected={searchVO.SchFrDate}
                inputId={Util.Common.fMakeId('SchFrDate')}
                onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchFrDate', value)}
              />
            </Box>
            <Box style={{ margin: '0 3px', width: '10px' }}>~</Box>
            <CommonDatePicker
              inputCls="inputCls"
              selected={searchVO.SchToDate}
              inputId={Util.Common.fMakeId('SchToDate')}
              onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchToDate', value)}
            />
          </Box>

          <Box style={{ marginTop: 2, marginLeft: 15, display: 'flex', alignItems: 'center' }}>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>전표발행조건</Box>
            </Box>
            <Box style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
              <RadioButton
                className={classes.Radio}
                inputId={Util.Common.fMakeId('all')}
                inputCls="inputCls"
                value="0"
                groupValue={searchVO.SchDelvYn}
                onChange={(checked) => fChooseType(checked, '0')}
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
                  groupValue={searchVO.SchDelvYn}
                  onChange={(checked) => fChooseType(checked, '1')}
                  style={{ marginLeft: 5 }}
                />
                <Label htmlFor={Util.Common.fMakeId('mi')} className={classes.RadioLabel}>
                  미발행
                </Label>
              </Box>

              <Box>
                <RadioButton
                  className={classes.Radio}
                  inputId={Util.Common.fMakeId('bal')}
                  inputCls="inputCls"
                  value="2"
                  groupValue={searchVO.SchDelvYn}
                  onChange={(checked) => fChooseType(checked, '2')}
                  style={{ marginLeft: 5 }}
                />
                <Label htmlFor={Util.Common.fMakeId('bal')} className={classes.RadioLabel}>
                  발행
                </Label>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box style={{ marginTop: 5 }}>
          <OrderToDelvHeaderGrid
            Util={Util}
            id="Grid1"
            currentIndex={refIndex}
            GridFields={GridFields1}
            GridColumns={GridColumns1}
            RowChanged={HeaderListChanged}
            DataProviderBind={DataProviderBindHeader}
            GridViewBind={GridViewBindHeader}
          />
        </Box>

        <Box style={{ marginTop: 5 }}>
          <OrderToDelvDetailGrid
            Util={Util}
            id="Grid2"
            GridFields={GridFields2}
            GridColumns={GridColumns2}
            // RowChanged={HeaderListChanged2}
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

let gridView1, gridView2;
let dataProvider1, dataProvider2;

const Styles = createUseStyles(StylesMain);
export default OrderToDelv;
