import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { StylesMain } from '@pages/business/returnSales/view/ReturnSalesStyle';
import { observer } from 'mobx-react-lite';
import useStores from '@stores/useStores';
import { useLocation } from 'react-router-dom';
import { ComboBox, LinkButton, RadioButton, TextBox, Dialog, Label, Tooltip } from 'rc-easyui';
import { FaPrint, FaSave, FaTrashAlt } from 'react-icons/fa';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { Box } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import { Utility } from '@components/common/Utility/Utility';
import CommonButton from '@components/common/CommonButton';
import CommonDatePicker from '@components/common/CommonDatePicker';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import imgEngMark from '@assets/images/img_eng_mark.png';
import Toast from '@pages/stock/inventoryBook/main/Toast';
import { GirdColumns1, GridFields1, GridColumns2, GridFields2 } from '../view/SupplyItemGrid';
import SupplyItemHeaderList from '../view/SupplyItemHeaderList';
import SupplyItemEditGrid from '../view/SupplyItemEditGrid';
import * as Presenter from '../presenter/SupplyItemPresenter';
import SupplyItemState from '../view/SupplyItemState';

const SupplyItem = observer(() => {
  const PGMID = 'SUPPLYITEM';
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();
  const location = useLocation();
  const [btnSupplySave] = useState($UserStore.fCheckAuth(`${PGMID}|SUPPLYSAVE`));
  const [btnSupplyDelete] = useState($UserStore.fCheckAuth(`${PGMID}|SUPPLYDELETE`));
  const [btnSupplyPrint] = useState($UserStore.fCheckAuth(`${PGMID}|SUPPLYPRINT`));

  const {
    searchVO,
    setSearchVO,
    // gridFocus,
    setGridFocus,
    cboSchType,
    alert,
    setAlert,
    confirm,
    setConfirm,
    supplyDate,
    setSupplyDate,
    supNoList,
    setSupNoList,
    supNo,
    setSupNo,
    dateLabel,
    setDateLabel,
    printView,
    setPrintView,
    toast,
    setToast,
  } = SupplyItemState();
  const Util = new Utility(PGMID, setAlert, true, true, true, true, true);
  const refIndex = useRef(0);
  const refSupNo = useRef('');
  // const refData2Arr = useRef([]);

  const fInit = () => {
    Presenter.fInit(setSearchVO, $UserStore);
    setTimeout(() => {
      Util.Common.fSetTabIndex();
      document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
    }, 100);
  };

  const [MenuStore] = useState({
    Util: Util,
    User: $UserStore,
    fInit: fInit,
    setAlert: setAlert,
    setToast: setToast,
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

  const EditGridTabKey = () => {
    gridView2.setFocus();
  };

  const HeaderGridTabKey = () => {
    gridView1.setFocus();
  };
  //--------------------------------------- Binding End-------------------------------------------//
  //--------------------------------------- Functions Start-------------------------------------------//
  const HeaderListChanged = (grid, index) => {
    gridView2.commit(true);
    setGridFocus('H');
    refIndex.current = index;
  };

  const HeaderDoubleClicked = async (clickedRow, index) => {
    if (refSupNo.current.includes('완료')) {
      setAlert({ visible: true, desc: '납품번호 : ' + refSupNo.current.substring(0, 12) + ' \n구매입고 완료 된 납품번호는 추가 저장이 불가합니다. ', type: 'W' });
      return;
    }
    if (refSupNo.current.includes('삭제')) {
      setAlert({ visible: true, desc: '납품번호 : ' + refSupNo.current.substring(0, 12) + ' \n삭제된 납품번호에는 저장이 불가합니다. ', type: 'W' });
      return;
    }
    if (dataProvider1.getValue(index, 'isSelected') !== 'Y' && dataProvider1.getValue(index, 'Clstype') !== '완료') {
      const BalNo = clickedRow.BalNo;
      const BalSeq = clickedRow.BalSeq;
      const grid2 = dataProvider2.getJsonRows();
      if (!grid2.some((item2) => item2.BalNo === BalNo && item2.BalSeq === BalSeq)) {
        const dataValue = {
          BalNo: clickedRow.BalNo,
          BalSeq: clickedRow.BalSeq,
          GoodCd: clickedRow.GoodCd,
          GoodNo: clickedRow.GoodNo,
          GoodNm: clickedRow.GoodNm,
          Spec: clickedRow.Spec,
          UnitCd: clickedRow.UnitCd,
          BalQty: clickedRow.BalQty,
          UnitNm: clickedRow.UnitNm,
          NapQty: clickedRow.MiNapQty, // 납품수량
          // NapQty: clickedRow.UnitNm === 'M' ? await Presenter.fConvert(MenuStore, clickedRow.MiNapQty, 'M', clickedRow.GoodCd) : clickedRow.MiNapQty, // 납품수량
          // Qty: clickedRow.MiNapQty,
          Qty: clickedRow.UnitNm === 'M' ? clickedRow.MiWeight : clickedRow.MiNapQty,
          // Su: clickedRow.UnitNm === 'M' ? await Presenter.fConvert(MenuStore, clickedRow.MiNapQty, 'M', clickedRow.GoodCd) : 0, // 납품길이
          Su: clickedRow.UnitNm === 'M' ? clickedRow.MiNapQty : 0, // 납품길이
          MiNapQty: 0,
          Price: clickedRow.Price,
          Clstype: clickedRow.Clstype,
          BalAmount: clickedRow.Amount,
          Amount: clickedRow.UnitNm === 'M' ? Math.round(clickedRow.MiWeight * clickedRow.Price) : Math.round(clickedRow.MiNapQty * clickedRow.Price),
          Remark: clickedRow.Remark,
        };
        dataProvider2.addRow(dataValue);
        const Grid2Data = dataProvider2.getJsonRows();
        for (let i = 1; i < Grid2Data.length + 1; i++) {
          dataProvider2.setValue(i - 1, 'No', i.toString().padStart(3, '0'));
        }
        dataProvider1.setValue(index, 'isSelected', 'Y');
      }
    }
  };

  const fAll = async () => {
    // refData2Arr.current = [];
    const data1 = dataProvider1.getJsonRow(refIndex.current);
    const balNo = data1.BalNo;
    dataProvider1.getJsonRows().forEach((row, i) => {
      if (row.BalNo === balNo) {
        HeaderDoubleClicked(dataProvider1.getJsonRow(i), i);
      }
    });
    // const result = await Presenter.fMultiConvert(MenuStore, refData2Arr);
    // result.forEach((rowA) => {
    //   dataProvider2.getJsonRows().forEach((rowB, i) => {
    //     if (rowA.BalNo === rowB.BalNo && rowA.BalSeq === rowB.BalSeq) {
    //       dataProvider2.setValue(i, 'NapQty', rowA.NewValue);
    //       dataProvider2.setValue(i, 'Su', rowA.NewValue);
    //     }
    //   });
    // });
  };

  const Grid2DoubleClicked = (clickedRow, index) => {
    const BalNo = dataProvider2.getValue(index, 'BalNo');
    const BalSeq = dataProvider2.getValue(index, 'BalSeq');
    dataProvider1.getJsonRows().forEach((value, i) => {
      if (value.BalNo === BalNo && value.BalSeq === BalSeq) {
        dataProvider1.setValue(i, 'isSelected', 'N');
      }
    });
  };

  const fNewRowChk = () => {
    const rows = dataProvider2.getAllStateRows().created;
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
    Util.Grid.fTab(gridView2, fNewRowChk() === 0, 'No');
  };

  const fDateType = (value, checked) => {
    if (checked) {
      setSearchVO({ ...searchVO, SchDateType: value });
      if (value === '1') setDateLabel('발주일자');
      if (value === '2') setDateLabel('납기일자');
    }
  };

  const tipContent = () => {
    return (
      <div style={{ width: 400, fontSize: 13 }}>
        <span>⊙발주 오더의 항목을 선택하고 싶다면 위 그리드의 해당 항목을 더블클릭하거나 키보드의 Enter 키를 누릅니다.</span>
        <p>⊙아래 그리드의 선택한 항목을 취소하고 싶다면 해당 항목을 더블클릭하거나 키보드의 Esc 키를 누릅니다.</p>
        <span>⊙[발주번호+]버튼은 위 그리드의 선택한 발주번호와 같은 발주를 한 번에 선택합니다. </span>
      </div>
    );
  };

  //--------------------------------------- Functions End-------------------------------------------//
  //--------------------------------------- CRUD Start-------------------------------------------//
  window.onkeydown = function (e) {
    if (location.pathname === '/supplyitem') {
      if (e.key === 'F8') {
        e.preventDefault();
        fSupplyNew();
      } else if (e.key === 'F10') {
        e.preventDefault();
        fSupplySave();
      } else if (e.key === 'F11') {
        e.preventDefault();
        fSupplyDelete();
      } else if (e.key === 'F12') {
        e.preventDefault();
        fSupplyPrint();
      }
    }
  };

  const fNew = () => {};

  const fSearch = async () => {
    await Presenter.fSearchProc(MenuStore, searchVO, dataProvider1, '발주 목록');
    gridView1.setFocus();
  };

  const fGetSupNoList = async () => {
    const list = await Presenter.fGetSupNoList(MenuStore, searchVO, setSupNoList, supplyDate);
    for (let i = 0; i < list.length; i++) {
      if (list[i].value.length === 12) {
        // refSupNo.current = list[i].value;
        setSupNo({ value: list[i].value, text: list[i].value });
        return;
      }
    }
  };

  const fIncomplateSupplyCount = async () => {
    const result = await Presenter.fIncomplateSupplyCount(MenuStore, searchVO, '');
    if (result.length > 0) {
      // setIncompleteSupply(result);
      setSupplyDate(moment(result[0].SupNo.substring(0, 8), 'YYYY-MM-DD').toDate());
    } else {
      fGetSupNoList();
    }
  };

  const fSupplyNew = async () => {
    // const result = await Presenter.fIncomplateSupplyCount(MenuStore, searchVO, supplyDate);
    // if (result.length > 0) {
    //   setIncompleteSupply(result);
    //   setAlert({ visible: true, desc: '납품번호 : ' + result[0].SupNo + ' \n구매입고 완료 후 신규저장이 가능합니다. ', type: 'W' });
    //   return;
    // }
    dataProvider2.clearRows();
    refSupNo.current = '';
    setSupNo({ value: 'NEW', text: '신규' });
    dataProvider1.getJsonRows().forEach((e, i) => {
      dataProvider1.setValue(i, 'isSelected', 'N');
    });
  };

  const fSupplySave = () => {
    gridView2.commit();
    if (dataProvider2.getJsonRows().length <= 0) return;

    let noneCount = 0;
    dataProvider2.getJsonRows().forEach((row, i) => {
      if (dataProvider2.getRowState(i) === 'none') noneCount += 1;
    });
    if (noneCount === dataProvider2.getJsonRows().length) {
      setToast({ visible: true, desc: '목록중에 입력/변경 한 내역이 없습니다' });
      return;
    }

    if (refSupNo.current) {
      if (refSupNo.current.includes('삭제')) {
        setToast({ visible: true, desc: '납품번호를 확인하세요', type: 'W' });
        return;
      }
    }

    const grid2 = dataProvider2.getJsonRows();
    if (grid2.some((item2) => item2.NapQty <= 0)) {
      setToast({ visible: true, desc: '납품량을 확인하세요.', type: 'W' });
      return;
    }
    if (grid2.some((item2) => item2.Su <= 0 && item2.UnitNm === 'M')) {
      setToast({ visible: true, desc: '납품길이를 확인하세요.', type: 'W' });
      return;
    }
    if (grid2.some((item2) => item2.MiNapQty < 0)) {
      setToast({ visible: true, desc: '미납량을 확인하세요.', type: 'W' });
      return;
    }
    setConfirm({ visible: true, desc: moment(supplyDate).format('YYYY-MM-DD') + ' 날짜에 납품자료를 저장 하시겠습니까?', id: 'SAVE' });
  };

  const fSearchSupply = async () => {
    gridView2.commit();
    dataProvider2.clearRows();
    await Presenter.fSearchSupplyItem(MenuStore, searchVO, dataProvider2, refSupNo, supplyDate, '납품 목록');
  };

  const fSupplyDelete = async () => {
    gridView2.commit(true);
    if (Util.Common.fValidate(gridView2.getCheckedItems(true).length < 1, '삭제할 납품 내역을 선택하세요.')) return;
    setConfirm({ visible: true, desc: `${moment(supplyDate).format('YYYY-MM-DD')}날짜의 납품 내역을 삭제 하시겠습니까?`, id: 'DELETE_ITEM' });
  };

  const fSupplyPrint = async () => {
    await Presenter.fPrintProc(MenuStore, searchVO, setPrintView, refSupNo);
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });
    if (confirm.id === 'SAVE') {
      const SupNo = await Presenter.fSupplySaveProc(MenuStore, searchVO, dataProvider2, gridView2, refSupNo, supplyDate, setSupNoList, setSupNo, dataProvider1);
      refSupNo.current = SupNo;
    } else if (confirm.id === 'DELETE_ITEM') {
      const SupNo = await Presenter.fItemDeleteProc(MenuStore, searchVO, dataProvider2, gridView2, refSupNo, supplyDate, setSupNoList, setSupNo, dataProvider1);
      refSupNo.current = SupNo;
    }
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };

  //--------------------------------------- CRUD End-------------------------------------------//
  useEffect(() => {
    if (searchVO.SchCustCd && moment(supplyDate).isValid()) {
      setTimeout(() => {
        fGetSupNoList();
      }, 1);
    }
  }, [supplyDate]);

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();
    fIncomplateSupplyCount();

    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);

  return (
    <>
      <CommonButton pgmid={PGMID} visible="01000" onNew={fNew} onSearch={fSearch} />
      <PerfectScrollbar className="mainCon">
        <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ padding: 1, border: '1px solid #e2e2e2', borderRadius: 5, backgroundColor: '#f9f9f9' }}>
          <Box style={{ display: 'flex', alignItems: 'center ' }}>
            <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>조회조건</Box>
              </Box>
              <Box
                id={Util.Common.fMakeId('radioBox')}
                className="inputCls"
                style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
              >
                <RadioButton
                  className={classes.Radio}
                  inputId={Util.Common.fMakeId('bal')}
                  inputCls="inputCls"
                  value="1"
                  groupValue={searchVO.SchDateType}
                  onChange={(checked) => fDateType('1', checked)}
                  style={{ marginLeft: 5 }}
                />
                <Label htmlFor={Util.Common.fMakeId('bal')} className={classes.RadioLabel} style={{ width: 100 }}>
                  발주일자
                </Label>
                <Box>
                  <RadioButton
                    inputCls="inputCls"
                    inputId={Util.Common.fMakeId('nap')}
                    value="2"
                    groupValue={searchVO.SchDateType}
                    onChange={(checked) => fDateType('2', checked)}
                    className={classes.Radio}
                  />
                  <Label htmlFor={Util.Common.fMakeId('nap')} className={classes.RadioLabel} style={{ width: 100 }}>
                    납기일자
                  </Label>
                </Box>
              </Box>
            </Box>

            <Box className={classes.SC4}>
              <Box className={classes.SC1}>{dateLabel}</Box>
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
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>발주번호</Box>
              <TextBox
                inputId={Util.Common.fMakeId('BalNo')}
                inputCls="inputCls"
                className={classes.SC3}
                onChange={(value) => {
                  Util.Common.fFieldChange(setSearchVO, 'SchBalNo', value.toUpperCase());
                }}
                value={searchVO.SchBalNo}
              />
            </Box>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>품번검색</Box>
              <TextBox
                inputId={Util.Common.fMakeId('GoodNo')}
                inputCls="inputCls"
                className={classes.SC3}
                onChange={(value) => {
                  Util.Common.fFieldChange(setSearchVO, 'SchGoodNo', value.toUpperCase());
                }}
                value={searchVO.SchGoodNo}
              />
            </Box>

            <Box className={classes.SC4}>
              <Box className={classes.SC1}>납품상태</Box>
              <ComboBox
                inputCls="inputCls"
                inputId={Util.Common.fMakeId('SchType')}
                data={cboSchType}
                value={searchVO.SchStatus}
                onChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchStatus', value)}
                className={classes.SA4}
                panelStyle={{ height: 160 }}
              />
            </Box>
          </Box>
        </Box>

        <Box style={{ marginTop: 5 }}>
          <SupplyItemHeaderList
            Util={Util}
            id="Grid1"
            Height={355}
            currentIndex={refIndex}
            GridFields={GridFields1}
            GridColumns={GirdColumns1}
            RowChanged={HeaderListChanged}
            DoubleClicked={HeaderDoubleClicked}
            DataProviderBind={DataProviderBindHeader}
            GridViewBind={GridViewBindHeader}
            TabKey={EditGridTabKey}
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ marginTop: 5, marginBottom: 5 }}>
          <Box display="flex" flexDirection="row">
            {/* <Box style={{ marginRight: 12 }}>
              <LinkButton style={{ width: 70, height: 30, color: '#424242', borderRadius: 3 }} onClick={fAdd}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaPlus size={17} />
                </Box>
              </LinkButton>
            </Box>
            <Box style={{ marginRight: 24 }}>
              <LinkButton className="c11" style={{ width: 70, height: 30, color: '#424242', borderRadius: 3 }} onClick={fRemove}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaMinus size={17} />
                </Box>
              </LinkButton>
            </Box> */}
            <Box style={{ marginRight: 12 }}>
              <LinkButton style={{ width: 100, height: 30, color: '#424242', borderRadius: 3 }} onClick={fAll}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* <AiOutlineFileAdd size={16} /> */}
                  <Box style={{ marginLeft: 5, fontSize: 15, paddingBottom: 2, fontWeight: 500 }}>발주번호 +</Box>
                  {/* <Box style={{ fontSize: 'x-small' }}>F8</Box> */}
                </Box>
              </LinkButton>
            </Box>
            <Box style={{ marginRight: 12 }}>
              <LinkButton style={{ width: 100, height: 30, color: '#424242', borderRadius: 3 }} onClick={fSupplyNew}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AiOutlineFileAdd size={16} />
                  <Box style={{ marginLeft: 5, fontSize: 15, paddingBottom: 2, fontWeight: 500 }}>신규</Box>
                  <Box style={{ fontSize: 'x-small' }}>F8</Box>
                </Box>
              </LinkButton>
            </Box>
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c4" style={{ width: 100, height: 30, color: '#424242', borderRadius: 3 }} onClick={fSupplySave} disabled={!btnSupplySave}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaSave size={16} />
                  <Box style={{ marginLeft: 5, fontSize: 15, paddingBottom: 2, fontWeight: 500 }}>저장</Box>
                  <Box style={{ fontSize: 'x-small' }}>F10</Box>
                </Box>
              </LinkButton>
            </Box>
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c11" style={{ width: 100, height: 30, color: '#424242', borderRadius: 3 }} onClick={fSupplyDelete} disabled={!btnSupplyDelete}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaTrashAlt size={16} />
                  <Box style={{ marginLeft: 5, fontSize: 15, paddingBottom: 2, fontWeight: 500 }}>삭제</Box>
                  <Box style={{ fontSize: 'x-small' }}>F11</Box>
                </Box>
              </LinkButton>
            </Box>
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c12" style={{ width: 100, height: 30, color: '#424242', borderRadius: 3 }} onClick={fSupplyPrint} disabled={!btnSupplyPrint}>
                <Box style={{ width: 100, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaPrint size={16} />
                  <Box style={{ marginLeft: 5, fontSize: 15, paddingBottom: 2, fontWeight: 500 }}>출력</Box>
                  <Box style={{ fontSize: 'x-small' }}>F12</Box>
                </Box>
              </LinkButton>
            </Box>

            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>납품일자</Box>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <CommonDatePicker
                  inputCls="inputCls"
                  selected={supplyDate}
                  inputId={Util.Common.fMakeId('supplyDate')}
                  onHandleDateChange={(value) => {
                    setSupNoList([]);
                    setSupplyDate(value);
                    setSupNo({ value: 'NEW', text: '신규' });
                    dataProvider1.getJsonRows().forEach((e, i) => {
                      dataProvider1.setValue(i, 'isSelected', 'N');
                    });
                  }}
                />
              </Box>
              <Box className={classes.SC4}>
                <Box className={classes.SC1}>납품번호</Box>
              </Box>
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <ComboBox
                  inputCls="inputCls"
                  inputId={Util.Common.fMakeId('SupNo')}
                  data={supNoList}
                  value={supNo}
                  onChange={(value) => {
                    refSupNo.current = value;
                    fSearchSupply(); //납품번호 바꿀때마다 이 함수 call
                    dataProvider1.getJsonRows().forEach((e, i) => {
                      dataProvider1.setValue(i, 'isSelected', 'N');
                    });
                  }}
                  className={classes.SA4}
                  panelStyle={{ height: 130 }}
                  style={{ width: 180 }}
                />
              </Box>
            </Box>

            <Box style={{ marginLeft: 20, width: 30, height: 30, color: '#424242', borderRadius: 3 }}>
              <Tooltip position="right" content={tipContent}>
                <LinkButton style={{ width: 30, height: 30, color: '#424242', borderRadius: 3, fontWeight: 500 }}>?</LinkButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        <Box style={{ marginTop: 5 }}>
          <SupplyItemEditGrid
            Util={Util}
            Id="Grid2"
            GridFields={GridFields2}
            GridColumns={GridColumns2}
            setGridFocus={setGridFocus}
            setAlert={setAlert}
            TabGrid={TabGrid}
            DoubleClicked={Grid2DoubleClicked}
            DataProviderBind={DataProviderBindDetail}
            GridViewBind={GridViewBindDetail}
            CustCd={searchVO.SchCustCd}
            TabKey={HeaderGridTabKey}
          />
        </Box>
      </PerfectScrollbar>
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Toast visible={toast.visible} description={toast.desc} type={toast.type} onConfirm={() => setToast({ visible: false })} duration={toast.duration} />
      {printView && (
        <Dialog
          title={
            <Box style={{ display: 'flex' }}>
              <img src={imgEngMark} alt="logo" style={{ width: '50px' }} />
              <Box style={{ marginLeft: 15 }}>거래명세서 출력</Box>
            </Box>
          }
          style={{ width: '1870px', height: '900px' }}
          bodyCls="f-column"
          closable
          draggable
          modal
          onClose={() => setPrintView(false)}
        >
          <Box className="f-full">
            <div id="crownix-viewer" style={{ position: 'absolute', width: '100%', height: '100%' }} />
          </Box>
        </Dialog>
      )}
    </>
  );
});

let gridView1, gridView2;
let dataProvider1, dataProvider2;

const Styles = createUseStyles(StylesMain);
export default SupplyItem;
