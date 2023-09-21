import PerfectScrollbar from 'react-perfect-scrollbar';
import React, { useState, useEffect, useRef } from 'react';
import numeral from 'numeral';
import useStores from '@stores/useStores';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';
import { Box } from '@material-ui/core';
import { TextBox, LinkButton, Label, ComboBox, Layout, LayoutPanel, Form, RadioButton, NumberBox, Dialog } from 'rc-easyui';
import { observer } from 'mobx-react-lite';
import { GridView, LocalDataProvider } from 'realgrid';
import axios from 'axios';
import moment from 'moment';
import { GridFields1, GridColumns1, GridFields2, GridColumns2 } from '@pages/purchase/OrderMaterialGrid';
import { StylesMain } from '@root/pages/purchase/OrderMaterialStyle';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import CommonButton from '@components/common/CommonButton';
import Alert from '@components/common/Alert';
import Toast from '@pages/stock/inventoryBook/main/Toast';
import Confirm from '@components/common/Confirm';
import CommonDatePicker from '@components/common/CommonDatePicker';
import Approval from '@components/common/Approval/Approval';
import Attachments from '@components/common/Attachments/Attachments';
import Utility from '@components/common/Utility/Utility';
import { createUseStyles } from 'react-jss';
import SearchGoods from '@components/common/SearchGoods/SearchGoods';
import imgEngMark from '@assets/images/img_eng_mark.png';

const thePage = observer(() => {
  const PGMID = 'ORDERMATERIAL';
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [toast, setToast] = useState({ visible: false, desc: '', type: 'N', duration: 2500 });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });

  const Util = new Utility(PGMID, setAlert, true, true, true, true, true);

  const [printView, setPrintView] = useState(false);
  const [gridFocus, setGridFocus] = useState('');

  const refGrid1 = useRef(null);
  const refGrid2 = useRef(null);
  const refWidth = useRef(0);

  const refApprovalInit = useRef(false);
  const refApprovalTitle = useRef('결재 · 미상신');
  const refOrderMaterialNo = useRef('');
  const refDelvdate = useRef(new Date());
  const refApprovalMaxRevNo = useRef(0);
  const refApprovalRevNo = useRef(0);
  const refIsPriceUpdateBtnPressed = useRef(false);
  const refDocSource = useRef('OD');
  const refBalNo = useRef('');

  const refBalDate = useRef('');
  const refBalSearchDate = useRef('');
  const refCustCd = useRef('');
  const refRate = useRef(1);
  const refTaxRate = useRef(10);
  const refPriceButton = useRef('');
  const refRetrieveFlag = useRef(true);
  const refIndex = useRef(0);

  const [searchVO, setSearchVO] = useState({
    schCustCd: '',
    SchWriting: 'Y',
    SchWritingRadio: '1',
  });
  const [attachView, setAttachView] = useState(false);

  const [headerVO, setHeaderVO] = useState({});
  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    description: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });
  const [cboSchType] = useState([
    { value: '0', text: '결재상태' },
    { value: '1', text: '발주일' },
    { value: '2', text: '발주번호' },
    { value: '3', text: '거래처명' },
  ]);
  const [searchGoods, setSearchGoods] = useState({
    visible: false,
    selectedData: {},
    id: '',
    pgmid: '',
  });

  const [headerRules] = useState({
    Delvdate: 'required',
    CustCd: 'required',
    CustCdNm: 'required',
    Pno: 'required',
    PnoNm: 'required',
    Vatcd: 'required',
    VatNm: 'required',
    URGENCY: 'required',
    URGENCYNM: 'required',
  });

  const mandatoryColumns2 = { BalQty: '발주량', GoodNo: '품번', GoodCdNm: '품명', NapDate: '납기일' };
  const ColumnsWithHelper2 = ['GoodNo'];
  const firstAlwaysEditableHeaderField = document.getElementById(Util.Common.fMakeId('BalDate'));

  const fInit = () => {
    setSearchVO(
      {
        SchAccunit: '',
        SchFactory: '',
        SchToDate: moment().format('YYYY-MM-DD'),
        SchFrDate: moment().startOf('month').format('YYYY-MM-DD'),
        SchWriting: 'Y',
        SchWritingRadio: '1',
        cboSchType: '2',
        SchText: '',
        schCustNm: '',
        schCustCd: '',
        schClastype: '1',
      },
      50,
    );

    fInitHeader();
    document.getElementById(Util.Common.fMakeId('Remark')).maxLength = 60;

    Util.Common.fSetTabIndex();

    refOrderMaterialNo.current = '';
    refBalDate.current = new Date();
    refBalNo.current = '';
    refCustCd.current = '';
  };

  const fInitHeader = () => {
    setHeaderVO({
      Accunit: $UserStore.user.accunit,
      ApprDocProg: '',
      ArrivalPortNm: '',
      AssentNm: '',
      BalDate: new Date(),
      BalNo: '',
      CiTypeNm: '',
      ContractNo: '',
      CurrCdNm: '',
      CustCdNm: '',
      delvqty: '',
      DeptCd: $UserStore.user.deptcd,
      DeptCDNm: $UserStore.user.deptnm,
      DocStatus: '',
      ExportYn: '',
      Factory: $UserStore.user.factory,
      FileNo: '',
      LoadportNm: '',
      LoadTypeNm: '',
      Mediator: '',
      Mediatornm: '',
      OrderProgressYN: '',
      orderqty: '',
      PaymentTypeNm: '',
      Pno: $UserStore.user.userid,
      PnoNm: $UserStore.user.username.trim(),
      Remark: '',
      Termsofpricecd: '',
      TermsofpriceNm: '',
      TotalAmt: 0,
      ToTalVat: 0,
      TotalWeight: 0,
      TotalOkAmt: 0,
      TruncNm: '',
      URGENCY: headerVO.URGENCY ? headerVO.URGENCY : '130001',
      URGENCYNM: '정상발주',
      Vatcd: '103011',
      VatNm: '전자세금계산서(일반과세)',
    });
  };

  // --------------------- Init Grid1 ------------------------------------------------------------- //
  const fInitGrid1 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid1'));
    dataProvider1 = new LocalDataProvider(false);
    gridView1 = new GridView(refGrid1.current);
    Util.Grid.fInitGridHeader(gridView1, dataProvider1, GridFields1, GridColumns1, 30, fOnCurrentRowChanged1, fOnCellClicked1, fKeyConfig1);
    gridView1.setRowIndicator({ visible: false });
    gridView1.setDisplayOptions({ fitStyle: 'none' });
    gridView1.setRowStyleCallback(rowColorChanged);

    gridView1.onShowTooltip = function (grid, index, value) {
      let custCdNmVal = grid.getValue(index.itemIndex, 'CustCdNm');
      if (index.column == 'CustCdNm') {
        if (custCdNmVal.length < 12) value = null;
      }
      return value;
    };

    gridView1.onCellDblClicked = function () {
      setGridFocus('H');
      document.getElementById(Util.Common.fMakeId('CustCdNm')).focus();
    };
  };

  const rowColorChanged = (grid, item) => {
    const ApprDocProg = grid.getValue(item.index, 'ApprDocProg');
    if (ApprDocProg === '완결') return 'rg-column-color-3';
    if (ApprDocProg === '진행중') return 'rg-column-color-2';
    if (ApprDocProg === '반려') return 'rg-column-color-1';
  };

  const fOnCurrentRowChanged1 = (grid, oldRow, newRow) => {
    refIsPriceUpdateBtnPressed.current = false;
    if (newRow >= 0) fRowChanged1(grid, newRow);
  };

  const fOnCellClicked1 = (grid, index) => {
    if (refIndex.current === index.dataRow && index.dataRow >= 0) fRowChanged1(grid, index.dataRow);
  };

  const fRowChanged1 = (grid, index) => {
    gridView2.commit();
    setGridFocus('H');

    $CommonStore.fSetBinding(true);

    const currentRow = dataProvider1.getJsonRow(index);

    if (refOrderMaterialNo.current === currentRow.BalNo) {
      refRetrieveFlag.current = !refRetrieveFlag.current;
    }

    refOrderMaterialNo.current = currentRow.BalNo;
    refBalDate.current = currentRow.BalDate;
    refCustCd.current = currentRow.CustCd;
    refApprovalTitle.current = currentRow.DocStatus;
    refDelvdate.current = currentRow.BalDate;
    currentRow.RateDay ? currentRow.RateDay : (currentRow.RateDay = currentRow.BalDate);

    setHeaderVO(currentRow);
    refBalNo.current = grid.getValue(index, 'BalNo');

    $CommonStore.fSetBinding(false);

    setRefTaxRateByVatcd(currentRow.Vatcd);
    fSearchDetail();
    setTimeout(() => {
      refIndex.current = index;
    }, 100);
  };

  const fKeyConfig1 = (grid, e) => {
    switch (e.key) {
      case e.shiftKey && 'Tab':
        document.getElementById(Util.Common.fMakeId('SchText')).focus();
        break;
      case 'Tab':
        setTimeout(() => {
          document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
        }, 0);
    }
  };

  // --------------------- Init Grid1 end------------------------------------------------------------- //
  // --------------------- Init Grid2 ------------------------------------------------------------- //
  const fInitGrid2 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid2'));
    dataProvider2 = new LocalDataProvider(false);
    gridView2 = new GridView(refGrid2.current);
    Util.Grid.fInitGridDetail(gridView2, dataProvider2, GridFields2, GridColumns2, onCellButtonClicked2, fOnCellEdited2, fKeyConfig2);
    gridView2.setRowIndicator({ visible: false });
    gridView2.setFooters({ visible: true });

    gridView2.onCellClicked = (grid, clickData) => {
      if (clickData.dataRow >= 0) {
        setGridFocus('D');
      }
    };

    gridView2.onValidateColumn = (grid, column, inserting, value, itemIndex) => {
      //do not commit grid here on codehelper partical search will not work anymore
      const error = {};
      if (Object.keys(mandatoryColumns2).includes(column.fieldName)) {
        if (!Util.Common.fEmptyReturn(value)) {
          // if (refIsSaving.current && !Util.Common.fEmptyReturn(value)) { //not sure it is that usefull...
          error.level = 'warning';
          error.message = '필수 입력 값입니다!';
        }
      }
      if (column.fieldName == 'Price') {
        if (grid.getValue(itemIndex, 'PriceUpdated') && grid.getValue(itemIndex, 'Price') > 0.001) {
          error.level = 'info';
          error.message = '최종 갱신 단가'; // tooltip = 'last updated price';
        }
      }
      return error;
    };

    dataProvider2.onRowInserted = (provider, i) => {
      Util.Grid.fSetMultiDataProvider(provider, i, {
        No: numeral(i + 1).format('000'),
        NapDate: moment(headerVO.BalDate).format('yyyy-MM-DD'),
      });
    };
    gridView2.getDataSource().addRow([]);
  };

  const onCellButtonClicked2 = async (grid, index) => {
    grid.commit();
    setGridFocus('D');
    let value = grid.getValue(grid.getCurrent().itemIndex, index.fieldName);
    if (!Util.Common.fEmptyReturn(value)) value = '';

    let codeClassValue = {};

    if (index.fieldName === 'GoodCdNm') {
      // codeClassValue = await Util.Grid.gridSearchGoods(grid.getCurrent(), PGMID, value, true);
      // setSearchGoods(codeClassValue);
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), Util.CodeHelper.helperOrderGoodno, PGMID, value, true);
    }
    let totalSize = 0;
    codeClassValue.datas[0].map((item) => {
      totalSize += Number(item.Size);
    });
    refWidth.current = totalSize < 470 ? 470 : totalSize + 500;
    setCodeClassInputs(codeClassValue);
  };

  const fOnCellEdited2 = (grid, itemIndex) => {
    gridView2.commit();
    setGridFocus('D');
    const { column, dataRow: i } = grid.getCurrent();
    const { dataRow } = grid.getCurrent();
    const value = grid.getValue(i, column);

    if (value === null || value === '') {
      if (column === 'GoodNo') {
        Util.Grid.fSetDataProvider(dataProvider2, i, ['GoodNo', 'GoodCd', 'GoodCdNm', 'UnitCdNm', 'Spec', 'Kgperm', 'Priceunit', 'StockUnitCd', 'UnitCd'], undefined);
      }
    } else if (column) {
      if (column === 'BalQty') {
        const unitCd = grid.getValue(i, 'UnitCd');
        const priceUnit = grid.getValue(i, 'Priceunit');
        const balQty = grid.getValue(i, 'BalQty');
        if (unitCd.trim() === '064047' && priceUnit === '220001' && balQty != undefined) {
          fConvert(i, balQty, 'Kg');
        } else {
          dataProvider2.setValue(i, 'Weight', balQty);
          dataProvider2.setValue(i, 'Su', 0);
          updateGrid2CalcField(dataRow);
          calcGrid2Sum4Header();
        }
      } else if (column === 'Price') {
        updateGrid2CalcField(i);
        calcGrid2Sum4Header();
      } else if (column === 'Amount') {
        dataProvider2.setValue(i, 'Tax', Math.round(grid.getValue(i, 'Amount') * refTaxRate.current));
        dataProvider2.setValue(i, 'Okamt', Math.round(grid.getValue(i, 'Amount') + grid.getValue(i, 'Tax')));
        calcGrid2Sum4Header();
      } else if (column === 'Okamt') {
        calcGrid2Sum4Header();
      } else if (column === 'Tax') {
        dataProvider2.setValue(i, 'Okamt', grid.getValue(i, 'Amount') + grid.getValue(i, 'Tax'));
        calcGrid2Sum4Header();
      }
    }

    // updateHeaderSumByGrid2();
    GuaranteeHeaderCalResultsLimits();
    gridView2.validateCells();
    gridView2.commit();
  };

  const fKeyConfig2 = async (grid, e) => {
    const rowCount = grid.getDataSource().getRowCount();
    const { fieldName, itemIndex: i } = grid.getCurrent();
    const rows = dataProvider2.getJsonRows();
    const rowLength = rows.length - 1;
    switch (e.key) {
      case 'Enter':
        grid.commit();

        if (fieldName === grid._view._columns.columns[grid._view._columns.columns.length - 1]._fieldName) {
          Util.Grid.fEnterLastField(grid, i, rowCount, fNewRowChk2() === 0);
          gridView2.commit();
        } else if (grid.getDataSource().getValue(i, fieldName)) {
          // for input to be copied to codeclass search bar
          if (ColumnsWithHelper2.includes(fieldName)) {
            grid.commit();

            const cellValue = grid.getValue(i, fieldName);
            let codeClassValue = {};
            if (Util.Common.fEmptyReturn(cellValue)) {
              if (fieldName === 'GoodNo') {
                grid.commit();
                const helperProtypeNm = Util.CodeHelper.fRedefHelper(Util.CodeHelper.helperProtypeNm, {
                  iInId: 'AD11',
                  iInCode1: '001',
                  iInCode2: $UserStore.user.factory,
                  iInCode3: Util.Common.fTrim(grid.getValue(grid.getCurrent().itemIndex, 'GoodNo')),
                });
                gridView2.commit();

                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), helperProtypeNm, PGMID, cellValue, false);
                if (!codeClassValue.visible) {
                  gridView2.commit();

                  Util.Grid.fSetMultiDataProvider(dataProvider2, i, {
                    GoodNo: codeClassValue.res.goodno,
                    GoodCd: codeClassValue.res.goodcd,
                    GoodCdNm: codeClassValue.res.goodnm,
                    UnitCdNm: codeClassValue.res.inunitnm,
                    Spec: codeClassValue.res.spec,
                    Kgperm: codeClassValue.res.kgperm,
                    Priceunit: codeClassValue.res.priceunit,
                    StockUnitCd: codeClassValue.res.stockunit,
                    UnitCd: codeClassValue.res.inunit,
                  });
                  const updatedPrice = await findUpdatedGoodPrice(dataProvider2, i, codeClassValue.res.goodcd);
                  dataProvider2.setValue(i, 'Price', updatedPrice);
                }
              }
            }

            let totalSize = 0;
            codeClassValue.datas[0].map((item) => {
              totalSize += Number(item.Size);
            });
            refWidth.current = totalSize < 470 ? 470 : totalSize + 300;
            setCodeClassInputs(codeClassValue);
            gridView2.commit();
          }
        }
        grid.setFocus();
        gridView2.validateCells();
        gridView2.commit();
        break;
      case 'Escape':
        Util.Grid.fEscape(grid, i, rowCount, 'NO');
        calcGrid2Sum4Header();
        // updateHeaderSumByGrid2();
        break;
      case 'Insert':
        Util.Grid.fKeyInsert(grid, i, fNewRowChk2(i) === 0, 'NO');
        break;
      case 'ArrowDown':
        Util.Grid.fArrowDown(grid, i, rowCount, fNewRowChk2(i) === 0, 'NO');
        gridView2.validateCells();
        break;
      case 'ArrowUp':
        // eslint-disable-next-line no-empty
        if (rows[rowLength].GoodNo || rows[rowLength].BalQty) {
        } else {
          Util.Grid.fArrowUp(grid, i, rowCount, fNewRowChk2(i) > 0);
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (refBalNo.current) {
          setTimeout(() => {
            document.getElementById(Util.Common.fMakeId('CustCdNm')).focus();
          }, 0);
        } else {
          setTimeout(() => {
            document.getElementById(Util.Common.fMakeId('BalDate')).focus();
          }, 0);
          gridView2.commit();
          gridView2.clearCurrent();
        }
        break;
      case e.ctrlKey && ' ':
        onCellButtonClicked2(grid, { fieldName: fieldName });
        break;
      default:
        break;
    }
  };

  const fNewRowChk2 = (itemIndex) => {
    gridView2.commit();
    const rows = dataProvider2.getAllStateRows().created;
    if (rows.length > 0) {
      let emptyCnt = 0;
      rows.map((item) => {
        if (itemIndex === undefined || item >= itemIndex) {
          const datas = gridView2.getValues(item);
          for (let i = 0; i < Object.keys(mandatoryColumns2).length; i++) {
            if (Object.getOwnPropertyDescriptor(datas, `${Object.keys(mandatoryColumns2)[i]}`) != undefined) {
              if (!Object.getOwnPropertyDescriptor(datas, `${Object.keys(mandatoryColumns2)[i]}`).value) emptyCnt += 1;
              if (Object.getOwnPropertyDescriptor(datas, `${Object.keys(mandatoryColumns2)[i]}`).value === undefined) emptyCnt += 1;
            }
          }
        }
      });
      return emptyCnt;
    }
    return 0;
  };

  // --------------------- Init Grid2 end ------------------------------------------------------------- //
  // --------------------- Side start ------------------------------------------------------------------- //

  const fInitDataProvider = () => {
    dataProvider2.clearRows();
    gridView1.clearCurrent();
    gridView2.clearCurrent();
    Util.Grid.fNewRow(dataProvider2, { NO: '001' });
  };

  const fSearchGoodsConfirm = () => {
    if (gridFocus === 'D') {
      gridView2.commit();

      const { dataRow, column } = searchGoods.selectedData;
      if (column === 'GoodCdNm') {
        try {
          $CommonStore.Parameter.map((item, index) => {
            const rowCount = gridView2.getDataSource().getRowCount();
            if (rowCount <= index + dataRow) {
              gridView2.getDataSource().addRow([]);
            }
            Util.Grid.fSetMultiDataProvider(dataProvider2, dataRow + index, {
              GoodCdNm: $CommonStore.Parameter[index].Goodnm,
              Spec: $CommonStore.Parameter[index].Spec,
              GoodNo: $CommonStore.Parameter[index].Goodno,
              GoodCd: $CommonStore.Parameter[index].Goodcd,
              Kgperm: $CommonStore.Parameter[index].Goodcd,
              Priceunitnm: $CommonStore.Parameter[index].Priceunitnm,
              Priceunit: $CommonStore.Parameter[index].Priceunit,
              Stockunitnm: $CommonStore.Parameter[index].Unitnm,
              UnitCdNm: $CommonStore.Parameter[index].Unitnm,
              UnitCd: $CommonStore.Parameter[index].unitcd,
              StockUnitCd: $CommonStore.Parameter[index].stockunit ? $CommonStore.Parameter[index].stockunit : $CommonStore.Parameter[index].unitcd,
              Jukyocd: $CommonStore.Parameter[index].Jukyocd,
              Jukyonm: $CommonStore.Parameter[index].Jukyonm,
              Weight: $CommonStore.Parameter[index].Weight,
            });
          });
        } catch (e) {
          setAlert({ visible: true, desc: '품목을 선택해주세요.', type: 'W' });
          return;
        }
      }
      gridView2.commit();
      gridView2.validateCells();
      setSearchGoods({ visible: false, selectedData: {}, id: '', viewId: '', searchValue: '' });
      gridView2.setFocus();
      $CommonStore.fSetParameter('');
    }
  };

  const fCodeClassConfirm = async () => {
    gridView2.commit();
    const selectedData = $CommonStore.Codeclass.selData;
    const { column, dataRow } = codeClassInputs.selectedData;

    if (column === 'GoodNo' || column === 'GoodCdNm') {
      Util.Grid.fSetMultiDataProvider(dataProvider2, dataRow, {
        GoodNo: selectedData.goodno,
        GoodCd: selectedData.goodcd,
        GoodCdNm: selectedData.goodnm,
        UnitCdNm: selectedData.inunitnm,
        Goodtype: selectedData.goodtype,
        Spec: selectedData.spec,
        Kgperm: selectedData.kgperm,
        Priceunit: selectedData.priceunit,
        StockUnitCd: selectedData.stockunit ? selectedData.stockunit : selectedData.unitcd,
        UnitCd: selectedData.inunit,
      });
      const updatedPrice = await findUpdatedGoodPrice(dataProvider2, dataRow, selectedData.goodcd);
      dataProvider2.setValue(dataRow, 'Price', updatedPrice);
    }

    gridView2.commit();
    gridView2.validateCells(); //to take off signs if an input trigger multiple field input. (eg: 품번 hotsearch)
    setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
    gridView2.setFocus();
  };

  const fCodeClassConfirmCancel = () => {
    gridView2.setFocus();
    setGridFocus('D');
    setCodeClassInputs({ visible: false });
  };

  const fSearchDate = (value, frto) => {
    if (frto === 'fr') {
      Util.Common.fFieldChange(setSearchVO, 'SchFrDate', value);
    } else {
      Util.Common.fFieldChange(setSearchVO, 'SchToDate', value);
    }
  };

  // --------------------- Side end------------------------------------------------------------------- //
  // --------------------- Main start----------------------------------------------------------------- //
  const fNew = async () => {
    gridView2.commit();
    fInitHeader();
    fInitDataProvider();
    Util.Grid.fNewRow(dataProvider2, { NO: '001' });
    gridView1.clearCurrent();
    gridView2.clearCurrent();
    refOrderMaterialNo.current = '';
    refBalDate.current = new Date();
    refBalSearchDate.current = new Date();
    refBalNo.current = '';
    refCustCd.current = '';
    refApprovalTitle.current = '결재';
    //to cover the case when user has already open a page.
    setTimeout(() => {
      firstAlwaysEditableHeaderField.focus(); //the first field in the headerPanel
    }, 100);
  };

  const fSearch = async () => {
    fInitHeader();
    fInitDataProvider();
    gridView2.commit();
    if (Util.Common.fValidate(!moment(searchVO.SchFrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.SchToDate, 'YYYY-MM-DD').isValid(), '조회기간을 바르게 입력해 주세요.')) return;
    if (Util.Common.fValidate(moment(searchVO.SchFrDate).format('YYYYMMDD') > moment(searchVO.SchToDate).format('YYYYMMDD'), '조회기간을 확인해 주세요.')) return;

    const restVO = { ...searchVO };
    if (refBalSearchDate.current) {
      const newDate = moment(refBalSearchDate.current).format('YYYY-MM-DD');
      const oldSearchFrom = moment(searchVO.SchFrDate).format('YYYY-MM-DD');
      const oldSearchTo = moment(searchVO.SchToDate).format('YYYY-MM-DD');
      if (newDate < oldSearchFrom) {
        restVO.SchFrDate = moment(newDate).format('YYYYMMDD');
        fSearchDate(refBalSearchDate.current, 'fr');
      } else if (newDate > oldSearchTo) {
        restVO.SchToDate = moment(newDate).format('YYYYMMDD');
        fSearchDate(refBalSearchDate.current, 'to');
      }
    }
    restVO.SchFrDate = moment(restVO.SchFrDate).format('YYYYMMDD');
    restVO.SchToDate = moment(restVO.SchToDate).format('YYYYMMDD');
    restVO.SchWriting = refApprovalTitle.current === '결재 · 진행중' ? 'N' : searchVO.SchWriting;
    restVO.SchAccunit = $UserStore.user.accunit;
    restVO.SchFactory = $UserStore.user.factory;
    restVO.schPno = $UserStore.user.userid;

    await Util.Command.fSearch(dataProvider1, '/@api/purchase/orderMaterial/selectByList', restVO, '발주자료입력 목록');
    document.getElementById(Util.Common.fMakeId('SchText')).focus();
    refBalSearchDate.current = '';
  };

  const fSearchDetail = async () => {
    dataProvider2.clearRows();
    let rtnDlist = [];
    try {
      const rtn = await axios.get('/@api/purchase/orderMaterial/selectByDetailList', {
        params: {
          SchOrderMaterialNo: refOrderMaterialNo.current,
          SchAccunit: $UserStore.user.accunit,
          SchFactory: $UserStore.user.factory,
          UserId: $UserStore.user.userid,
          CustCd: headerVO.CustCd,
        },
      });
      rtnDlist = rtn.data.dList;
      if (rtnDlist === undefined || rtnDlist.length < 1) {
        Util.Grid.fNewRow(dataProvider2, { No: '001' });
      } else {
        for (let i = 0; i < rtnDlist.length; i++) {
          for (const [key, value] of Object.entries(rtnDlist[i])) {
            rtnDlist[i][key] = Util.Common.fTrim(value);
          }
        }
        dataProvider2.setRows(rtnDlist);
        rtnDlist.forEach((e) => (e.Weight = Number(e.Weight)));
      }
      gridView2.clearCurrent();
    } catch (error) {
      setAlert({ visible: true, desc: '상세내역 조회중 오류가 발생하였습니다.', type: 'E' });
    }

    // updateGrid2TaxByHeaderVatcd();
    // updateHeaderSumByGrid2();
    // calcGrid2Sum4Header();
    // GuaranteeHeaderCalResultsLimits();
    gridView2.commit();
    gridView2.validateCells();
  };

  const fPrint = async () => {
    try {
      setPrintView(true);
      const result = await axios.get('/@api/purchase/orderMaterial/print01', {
        params: {
          factory: $UserStore.user.factory,
          accunit: $UserStore.user.accunit,
          balNo: refOrderMaterialNo.current,
        },
      });
      const rdata = '{ "data" :' + JSON.stringify(result.data) + '}';
      Util.Report.fReport(rdata, '/발주서.mrd', process.env.VITE_APP_RD_SERVER_URL, process.env.VITE_APP_RD_CLIENT_URL);
    } catch (error) {
      setAlert({ visible: true, desc: '자료 조회중 오류가 발생하였습니다.', type: 'W' });
    }
  };

  const fSave = () => {
    const rows = dataProvider2.getJsonRows();
    let qtySum = 0;
    let amountSum = 0;
    let vatSum = 0;
    rows.forEach((val) => {
      qtySum += val.Weight;
      amountSum += val.Amount;
      vatSum += val.Tax;
    });
    const qtySumAfter = Math.round(qtySum * 100) / 100;
    if (qtySumAfter !== Math.round(headerVO.TotalWeight * 100) / 100 || amountSum !== headerVO.TotalAmt || vatSum !== headerVO.ToTalVat) {
      setAlert({ visible: true, desc: '헤더자료와 아이템의 합계 자료가 일치하지 않습니다.' });
      return;
    }
    if (Util.Common.fValidate(!headerVO.Vatcd, '계산서구분이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.CustCd, '거래처명이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.DeptCd, '부서명이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.URGENCY, '발주구분이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!moment(headerVO.BalDate, 'YYYY-MM-DD').isValid(), '발주일 제대로 입력되지 않았습니다.')) return;
    if (refBalSearchDate.current === '') refBalSearchDate.current = headerVO.BalDate;
    gridView2.commit();
    gridView2.validateCells();

    setConfirm({
      visible: true,
      desc: '저장 하시겠습니까?',
      id: 'SAVE',
    });
  };

  const fSaveProc = async () => {
    const restVO = { ...headerVO };

    restVO.BalDate = moment(headerVO.BalDate).format('YYYYMMDD');
    restVO.Delvdate = moment(headerVO.Delvdate).format('YYYYMMDD');
    restVO.RateDay = moment(headerVO.RateDay).format('YYYY-MM-DD');
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    restVO.UserId = $UserStore.user.userid;

    let paramDetail = [];
    let paramHeader = [];
    const checkResultDetail = Util.Grid.fCheckGridData(dataProvider2, paramDetail, mandatoryColumns2, '발주자료입력 상세');
    const checkResultHeader = Util.Grid.fCheckGridData(dataProvider1, paramHeader, mandatoryColumns2, '발주자료입력 HeaderVO');
    if (checkResultHeader !== undefined || checkResultDetail !== undefined) return;
    try {
      const result = await axios.post('/@api/purchase/orderMaterial/updateByList', {
        header: restVO,
        detail: paramDetail,
        headerTable: paramHeader,
      });
      if (result.data.errmess !== '') {
        setAlert({ visible: true, desc: result.data.errmess, type: 'E' });
        return;
      }
      setToast({ visible: true, desc: '문서 저장이 완료되었습니다.', type: 'W' });
      const balNo = result.data.BalNo.trim();
      fSearch().then(() => {
        const sd = dataProvider1.searchData({ fields: ['BalNo'], value: balNo, partialMatch: true });
        if (sd != null) gridView1.setCurrent({ dataRow: sd.dataRow, column: 0 });
      });
    } catch (error) {
      setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다.${error}` });
    }
  };

  const fDelete = async () => {
    gridView2.commit();
    const checkedItemNb = gridView2.getCheckedItems(true).length;
    if (Util.Common.fValidate(!headerVO.BalNo, '발주자료 목록이 선택되지 않았습니다.')) return;
    gridView2.commit(true);
    if (checkedItemNb >= 1) {
      setConfirm({
        visible: true,
        desc: `${refBalNo.current} 발주 상세내역을 삭제 하시겠습니까?`,
        id: 'DELETE_ITEM',
      });
    } else {
      setConfirm({
        visible: true,
        desc: `주의) ${refBalNo.current} 발주 문서를 삭제 하시겠습니까?`,
        id: 'DELETE',
      });
    }
  };

  const fDeleteProc = async () => {
    const restVO = { ...headerVO };
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    restVO.useridPno = $UserStore.user.userid;

    try {
      let result = await axios.post('/@api/purchase/orderMaterial/deleteByList', {
        data: restVO,
      });

      if (result.data.errmess !== '') {
        setAlert({ visible: true, desc: result.data.errmess, type: 'E' });
        return;
      }
      setToast({ visible: true, desc: '발주자료 문서가 삭제되었습니다', type: 'W' });
      result.data.status = true;
      return result.data;
    } catch (error) {
      setAlert({ visible: true, desc: '발주자료 문서 삭제 중 오류가 발생하였습니다.' });
      return false;
    }
  };

  const fItemDeleteProc = async () => {
    const restVO = { ...headerVO };
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    restVO.useridPno = $UserStore.user.userid;

    await Util.Command.fDeleteCheckItem(gridView2, dataProvider2, '/@api/purchase/orderMaterial/deleteByItem', restVO, '발주자료입력 상세내역');

    await fSearchDetail();
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });
    if (confirm.id === 'SAVE') {
      fSaveProc();
    } else if (confirm.id === 'DELETE') {
      const result = await fDeleteProc();
      if (!result.errmess) {
        await Util.Command.fDeleteFiles('OD', result.List);
      }
      fNew();
      fSearch();
    } else if (confirm.id === 'DELETE_ITEM') {
      fItemDeleteProc();
    }
  };

  const fConfirmCancel = () => setConfirm({ visible: false, desc: '', id: '' });
  const fAttachClose = () => setAttachView(false);

  const fAttachment = () => {
    gridView2.commit();
    if (Util.Common.fValidate(Util.Common.fEmptyReturn(refBalNo.current) === '', '발주번호가 선택되지 않았습니다. \n확인해 주십시오.')) return;
    setAttachView(true);
  };

  // --------------------- CRUD end ------------------------------------------------------------------- //
  // --------------------- other component functions start ------------------------------------------------------------------- //
  const fConvert = async (dataRow, weight, unit) => {
    const goodcd = dataProvider2.getValue(dataRow, 'GoodCd');
    if (goodcd === '') return;
    try {
      const result = await axios.get('/@api/purchase/purchaseStorage/searchConvertValue', {
        params: { SchGoodcd: goodcd, SchConvertUnit: unit, SchConvertValue: weight },
      });
      if (!result.data) return;
      if (unit === 'M') {
        dataProvider2.setValue(dataRow, 'Weight', result.data.returnValue);
        dataProvider2.setValue(dataRow, 'Su', weight);
      }
      if (unit === 'Kg') {
        dataProvider2.setValue(dataRow, 'Su', weight);
        dataProvider2.setValue(dataRow, 'Weight', result.data.returnValue);
      }
      updateGrid2CalcField(dataRow);
      calcGrid2Sum4Header();
      gridView2.validateCells();
    } catch (e) {
      setAlert({ visible: true, desc: '단위 환산 중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fsetValue = (id, value, name) => {
    if ($CommonStore.fGetBinding()) return;

    switch (id) {
      case 'schCustNm':
        Util.Common.fMultiFieldChange(setSearchVO, {
          schCustCd: value,
          SchCustCdNm: name,
        });
        break;
      case 'CustCdNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          CustCd: value,
          CustCdNm: name,
        });
        if (!gridView2) return;
        if (value) {
          refCustCd.current = value;
          findUpdatedGoodsPrices();
        }
        break;
      case 'DeptCDNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          DeptCd: value,
          DeptCDNm: name,
        });
        break;
      case 'PnoNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          Pno: value,
          PnoNm: name,
        });
        break;
      case 'URGENCYNM':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          URGENCY: value,
          URGENCYNM: name,
        });
        break;
      case 'VatNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          Vatcd: value,
          VatNm: name,
        });
        setRefTaxRateByVatcd(value);

        if (!gridView2) return;
        updateGrid2CalcFields();
        // updateHeaderSumByGrid2();
        calcGrid2Sum4Header();
        // GuaranteeHeaderCalResultsLimits();
        gridView2.commit();

        break;
      default:
        break;
    }
  };

  const handleRadioBtn = (value, checked) => {
    if ($CommonStore.fGetBinding()) {
      return;
    }
    if (checked) setSearchVO({ ...searchVO, SchWriting: value });
  };

  const handleRadioBoxEvent = (e) => {
    const radioValue = searchVO.SchWriting;
    if (e.shiftKey && e.keyCode == 9) {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('SchToDate')).focus();
    } else if (e.key === 'ArrowRight') {
      if (radioValue === 'Y') setSearchVO({ ...searchVO, SchWriting: 'N' });
      if (radioValue === 'N') setSearchVO({ ...searchVO, SchWriting: 'Y' });
    } else if (e.key === 'ArrowLeft') {
      if (radioValue === 'N') setSearchVO({ ...searchVO, SchWriting: 'Y' });
      if (radioValue === 'Y') setSearchVO({ ...searchVO, SchWriting: 'N' });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('radioBox2')).focus();
    }
  };

  const handleRadioBtn2 = (value, checked) => {
    if (checked) setSearchVO({ ...searchVO, schClastype: value });
  };

  const handleRadioBoxEvent2 = (e) => {
    const radioValue = searchVO.schClastype;
    if (e.shiftKey && e.keyCode == 9) {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('radioBox')).focus();
    } else if (e.key === 'ArrowRight') {
      if (radioValue === '0') setSearchVO({ ...searchVO, schClastype: '1' });
      if (radioValue === '1') setSearchVO({ ...searchVO, schClastype: '2' });
      if (radioValue === '2') setSearchVO({ ...searchVO, schClastype: '0' });
    } else if (e.key === 'ArrowLeft') {
      if (radioValue === '0') setSearchVO({ ...searchVO, schClastype: '2' });
      if (radioValue === '1') setSearchVO({ ...searchVO, schClastype: '0' });
      if (radioValue === '2') setSearchVO({ ...searchVO, schClastype: '1' });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('schCustNm')).focus();
    }
  };

  const SetTitle = (title) => {
    refApprovalTitle.current = title;
    fSearch().then(() => {
      handleRadioBtn('N', 'checked');
      const sd = dataProvider1.searchData({ fields: ['BalNo'], value: refBalNo.current, partialMatch: true });
      if (sd != null) gridView1.setCurrent({ dataRow: sd.dataRow, column: 0 });
    });
  };

  const fClose = () => {
    setSearchGoods({ visible: false, selectedData: {}, id: '', viewId: '', value: '' });
    setTimeout(() => {
      $CommonStore.fSetParameter('');
    }, 10);
  };

  // --------------------- other component functions end ------------------------------------------------------------------- //
  // --------------------- calculations start ------------------------------------------------------------------- //

  const GuaranteeHeaderCalResultsLimits = () => {
    if (String(headerVO.TotalWeight).length > 17) Util.Common.fFieldChange(setHeaderVO, 'TotalWeight', 99999999999999999);
    if (String(headerVO.ToTalVat).length > 17) Util.Common.fFieldChange(setHeaderVO, 'ToTalVat', 99999999999999999);
    if (String(headerVO.TotalAmt).length > 17) Util.Common.fFieldChange(setHeaderVO, 'TotalAmt', 99999999999999999);
  };

  const updateGrid2CalcFields = () => {
    const rows = dataProvider2.getJsonRows();
    gridView2.commit();
    rows.forEach((e, i) => {
      // const BalQty = dataProvider2.getValue(i, 'BalQty');
      const Weight = dataProvider2.getValue(i, 'Weight');
      const Price = dataProvider2.getValue(i, 'Price');
      dataProvider2.setValue(i, 'Amount', Math.round(Weight * Price));

      const Amount = dataProvider2.getValue(i, 'Amount');
      if (Amount * refTaxRate.current == Infinity) {
        dataProvider2.setValue(i, 'Tax', 0);
      } else {
        dataProvider2.setValue(i, 'Tax', Math.round(Amount * refTaxRate.current));
      }

      const Tax = dataProvider2.getValue(i, 'Tax');
      dataProvider2.setValue(i, 'Okamt', Tax + Amount);
    });
  };

  const updateGrid2CalcField = (i) => {
    if (!dataProvider2) return;
    // gridView2.commit();
    const Weight = dataProvider2.getValue(i, 'Weight');
    const Price = dataProvider2.getValue(i, 'Price');
    dataProvider2.setValue(i, 'Amount', Math.round(Weight * Price));
    const Amount = Weight * Price;

    if (Amount * refTaxRate.current == Infinity) {
      dataProvider2.setValue(i, 'Tax', 0);
    } else {
      dataProvider2.setValue(i, 'Tax', Math.round(Amount * refTaxRate.current));
    }
    dataProvider2.setValue(i, 'Okamt', dataProvider2.getValue(i, 'Tax') + Amount);
  };

  const calcGrid2Sum4Header = () => {
    Util.Common.fMultiFieldChange(setHeaderVO, {
      ToTalVat: sumByfield(dataProvider2.getJsonRows(), 'Tax'),
      TotalAmt: sumByfield(dataProvider2.getJsonRows(), 'Amount') * refRate.current,
      orderqty: sumByfield(dataProvider2.getJsonRows(), 'Weight'),
      TotalWeight: sumByfield(dataProvider2.getJsonRows(), 'Weight'),
      TotalOkAmt: sumByfield(dataProvider2.getJsonRows(), 'Okamt'),
    });
  };

  const sumByfield = (arr, field) => {
    let sum = 0;
    for (let i in arr) {
      let itemValue = Object.getOwnPropertyDescriptor(arr[i], `${field}`).value;
      if (isNaN(itemValue)) itemValue = 0;
      sum += itemValue;
    }
    return sum;
  };

  const setRefTaxRateByVatcd = (cd) => {
    cd == 103011 || cd == 103015 ? (refTaxRate.current = 0.1) : (refTaxRate.current = 0);
  };

  const findUpdatedGoodPrice = async (dataProvider, index, goodCd) => {
    try {
      let result = await axios.get(`/@api/purchase/orderMaterial/findGoodPrice`, {
        params: { custCd: refCustCd.current, goodCd: goodCd, accunit: $UserStore.user.accunit },
      });
      const updatedPrice = result.data[0].Price;
      gridView2.commit();
      // if (updatedPrice || updatedPrice == 0) dataProvider2.setValue(index, 'PriceUpdated', true);
      return updatedPrice;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAlert({ visible: true, desc: error.response });
        return;
      } else {
        return;
      }
    }
  };

  const findUpdatedGoodsPrices = async () => {
    if (!Util.Common.fEmptyReturn(refCustCd.current)) {
      // setAlert({ visible: true, desc: '거래처명을 지정하지 않아 가격을 업데이트 할 수 없습니다.', type: 'W' });
      setToast({ visible: true, desc: '거래처명을 지정하지 않아 가격을 업데이트 할 수 없습니다.', type: 'W' });
      return false;
    } else {
      const rows = dataProvider2.getJsonRows();
      const smallerRows = [];
      rows.forEach((e) => {
        const aRow = [];
        aRow.push(e.GoodCd);
        aRow.push(e.Price);
        smallerRows.push(aRow);
      });
      let smallerRowsObj = { arr: smallerRows };

      try {
        const result = await axios.get(`/@api/purchase/orderMaterial/findGoodPrice2`, {
          params: {
            items: smallerRowsObj,
            accunit: $UserStore.user.accunit,
            custCd: refCustCd.current,
          },
        });
        result.data.forEach((e, i) => {
          dataProvider2.setValue(i, 'Price', e.price);
        });
        updateGrid2CalcFields();
        calcGrid2Sum4Header();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAlert({ visible: true, desc: error.response });
          return;
        }
      }
    }
  };

  // --------------------- calculation end ------------------------------------------------------------------- //
  // --------------------- other component functions start ------------------------------------------------------------------- //

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch, fSave, fDelete, fPrint);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();
    fInitGrid1();
    fInitGrid2();
    setTimeout(() => {
      document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
    }, 1);
    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);

  return (
    <>
      <CommonButton pgmid={PGMID} onNew={fNew} onSearch={fSearch} onSave={fSave} onDelete={fDelete} onPrint={fPrint} onAttachment={fAttachment} />
      <PerfectScrollbar className="mainCon">
        <Layout style={{ width: '100%', height: '100%' }}>
          <LayoutPanel region="west" split style={{ minWidth: 340, maxWidth: 450, width: 440, height: 775 }}>
            <PerfectScrollbar>
              <Box display="flex" alignItems="center" style={{ marginTop: 5, marginLeft: 5 }}>
                <Box style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
                  <Box className={classes.SA1}>
                    <Box className={classes.SA2}>기간</Box>
                  </Box>
                  <Box
                    style={{ display: 'flex', alignItems: 'center', marginLeft: 5 }}
                    onKeyDown={(e) => {
                      if (e.shiftKey && e.keyCode == 9) {
                        e.preventDefault();
                        gridView1.setFocus();
                      }
                    }}
                  >
                    <CommonDatePicker
                      inputCls="inputCls"
                      selected={searchVO.SchFrDate}
                      id={Util.Common.fMakeId('SchFrDate')}
                      inputId={Util.Common.fMakeId('SchFrDate')}
                      onHandleDateChange={(value) => fSearchDate(value, 'fr')}
                    />
                    <Box style={{ margin: '0 3px', width: '10px' }}>~</Box>
                    <Box
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.keyCode == 9) {
                          e.preventDefault();
                          setTimeout(() => {
                            document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
                          }, 10);
                        } else if (e.keyCode === 9) {
                          e.preventDefault();
                          document.getElementById(Util.Common.fMakeId('radioBox')).focus();
                        }
                      }}
                    >
                      <CommonDatePicker inputCls="inputCls" selected={searchVO.SchToDate} inputId={Util.Common.fMakeId('SchToDate')} onHandleDateChange={(value) => fSearchDate(value, 'to')} />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box style={{ marginLeft: 5, display: 'flex', alignItems: 'center', marginTop: 3 }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>결재상태</Box>
                </Box>
                <Box
                  id={Util.Common.fMakeId('radioBox')}
                  onKeyDown={(e) => {
                    handleRadioBoxEvent(e);
                  }}
                  className="inputCls"
                  style={{ display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, height: 25, width: 235.82, alignItems: 'center', marginLeft: 5 }}
                >
                  <Box style={{ marginLeft: 5 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('notcomplated')}
                      value="Y"
                      groupValue={searchVO.SchWriting}
                      onChange={(checked) => handleRadioBtn('Y', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('notcomplated')} style={{ marginLeft: 5, fontSize: 12 }}>
                      작성중+반려
                    </Label>
                  </Box>
                  <Box style={{ marginLeft: 25 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('all')}
                      value="N"
                      groupValue={searchVO.SchWriting}
                      onChange={(checked) => handleRadioBtn('N', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('all')} style={{ marginLeft: 5, fontSize: 12 }}>
                      전체
                    </Label>
                  </Box>
                </Box>
              </Box>
              <Box style={{ marginLeft: 5, display: 'flex', alignItems: 'center', marginTop: 3 }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>마감상태</Box>
                </Box>
                <Box
                  id={Util.Common.fMakeId('radioBox2')}
                  onKeyDown={(e) => {
                    handleRadioBoxEvent2(e);
                  }}
                  className="inputCls"
                  style={{ display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, height: 25, width: 235.82, alignItems: 'center', marginLeft: 5 }}
                >
                  <Box style={{ marginLeft: 5 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('r0')}
                      value="0"
                      groupValue={searchVO.schClastype}
                      onChange={(checked) => handleRadioBtn2('0', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('r0')} style={{ marginLeft: 5, fontSize: 12, width: 45 }}>
                      전체
                    </Label>
                  </Box>
                  <Box style={{ marginLeft: 15 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('r1')}
                      value="1"
                      groupValue={searchVO.schClastype}
                      onChange={(checked) => handleRadioBtn2('1', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('r1')} style={{ marginLeft: 5, fontSize: 12, width: 45 }}>
                      미결
                    </Label>
                  </Box>
                  <Box style={{ marginLeft: 15 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('r2')}
                      value="2"
                      groupValue={searchVO.schClastype}
                      onChange={(checked) => handleRadioBtn2('2', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('r2')} style={{ marginLeft: 5, fontSize: 12, width: 45 }}>
                      완료
                    </Label>
                  </Box>
                </Box>
              </Box>

              <Box style={{ marginLeft: 5, marginTop: 5 }}>
                <CodeHelperPopup
                  title="거래처명"
                  inputCls="inputCls"
                  pgmid={PGMID}
                  inputType="Cust"
                  id="schCustNm"
                  helper={Util.CodeHelper.helperCust}
                  ComponentCode={searchVO.schCustCd}
                  ComponentValue={searchVO.schCustNm}
                  SetValue={fsetValue}
                  labelStyles={{ width: 70, height: 25, margin: '0px 3px 5px 3px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                  inputStyles={{ width: 236, margin: '0px 0px 5px 5px' }}
                />
              </Box>
              <Box style={{ paddingLeft: 5, marginTop: 2, display: 'flex', alignItems: 'center' }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>검색</Box>
                </Box>
                <ComboBox
                  inputCls="inputCls"
                  inputId={Util.Common.fMakeId('cboSchType')}
                  data={cboSchType}
                  value={searchVO.cboSchType}
                  editable={false}
                  onChange={(value) => Util.Common.fFieldChange(setSearchVO, 'cboSchType', value)}
                  onSelectionChange={(item) => {
                    Util.Common.fGridSort(gridView1, item.value, {
                      0: 'ApprDocProg',
                      1: 'BalDate',
                      2: 'BalNo',
                      3: 'CustCdNm',
                    });
                  }}
                  panelStyle={{ height: 130 }}
                  className={classes.SA4}
                  style={{ width: 80, marginLeft: 5 }}
                />
                <Box
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.keyCode == 9) {
                      e.preventDefault();
                      document.getElementById(Util.Common.fMakeId('cboSchType')).focus();
                    } else if (e.key === 'Tab') {
                      e.preventDefault();
                      gridView1.setFocus();
                    }
                  }}
                >
                  <TextBox
                    inputCls="inputCls"
                    inputId={Util.Common.fMakeId('SchText')}
                    className={classes.SA5}
                    onChange={(value) => {
                      Util.Common.fFieldChange(setSearchVO, 'SchText', value);
                      gridView1.commit();
                      Util.Common.fSearchMatch(
                        gridView1,
                        dataProvider1,
                        searchVO.cboSchType,
                        {
                          0: 'ApprDocProg',
                          1: 'BalDate',
                          2: 'BalNo',
                          3: 'CustCdNm',
                        },
                        value,
                      );
                    }}
                    value={searchVO.SchText}
                    style={{ width: 151 }}
                  />
                </Box>
              </Box>
              <Box ref={refGrid1} id={Util.Common.fMakeId('Grid1')} style={{ width: '100%', height: 596, marginTop: 5 }} />
            </PerfectScrollbar>
          </LayoutPanel>

          <LayoutPanel region="center" style={{ width: 1280, height: 775 }}>
            <Box style={{ display: 'flex', height: 220 }}>
              <Form style={{ maxWidth: '100%' }} model={headerVO} rules={headerRules}>
                <Box style={{ width: '100%', height: '100%', borderRadius: '5px', display: 'flex', flexDirection: 'row', padding: 5 }}>
                  <Box style={{ marginTop: 0, display: 'flex', flexDirection: 'column' }}>
                    <Box style={{ marginTop: 0, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1} style={{ marginLeft: 5 }}>
                        <Box className={classes.SC2}>공장명</Box>
                      </Box>
                      <Box
                        onKeyDown={(e) => {
                          if (e.shiftKey && e.keyCode === 9) {
                            e.preventDefault();
                            gridView2.setFocus();
                          }
                        }}
                      >
                        <TextBox
                          inputId={Util.Common.fMakeId('Factorynm')}
                          inputCls="inputCls"
                          name="Factorynm"
                          value={$UserStore.user.factorynm}
                          editable={false}
                          className={classes.textBoxMatchPickDateBox}
                        />
                      </Box>
                    </Box>
                    <Box style={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1} style={{ marginLeft: 5 }}>
                        <Box className={classes.SC2} id={Util.Common.fMakeId('BalDateLabel')}>
                          발주일
                        </Box>
                      </Box>
                      <CommonDatePicker
                        inputCls="inputCls"
                        selected={headerVO.BalDate}
                        inputId={Util.Common.fMakeId('BalDate')}
                        disabled={refOrderMaterialNo.current ? true : false}
                        onHandleDateChange={(value) => {
                          Util.Common.fFieldChange(setHeaderVO, 'BalDate', value);
                          refBalSearchDate.current = value;
                        }}
                        style={{ width: 110 }}
                      />
                    </Box>
                    <Box style={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1} style={{ marginLeft: 5 }}>
                        <Box className={classes.SC2} id={Util.Common.fMakeId('BalDateLabel')}>
                          발주번호
                        </Box>
                      </Box>
                      <TextBox
                        inputCls="inputCls"
                        name="BalNo"
                        inputId={Util.Common.fMakeId('BalNo')}
                        value={headerVO.BalNo}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'BalNo', value)}
                        editable={false}
                        className={classes.textBoxMatchPickDateBox}
                        disabled
                      />
                    </Box>
                    <CodeHelperPopup
                      ComponentCode={headerVO.CustCd}
                      ComponentValue={headerVO.CustCdNm}
                      helper={Util.CodeHelper.helperCust}
                      id="CustCdNm"
                      inputCls="inputCls"
                      inputRequired
                      inputType="Cust"
                      labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 5px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 150, margin: '4px 0px 5px 0px' }}
                      pgmid={PGMID}
                      SetValue={fsetValue}
                      title="거래처명"
                    />
                    <CodeHelperPopup
                      title="부서명"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Dept"
                      id="DeptCDNm"
                      helper={Util.CodeHelper.helperDeptNm}
                      ComponentCode={headerVO.DeptCd}
                      ComponentValue={headerVO.DeptCDNm}
                      SetValue={fsetValue}
                      labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 5px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 150, margin: '3px 0px 5px 0px' }}
                    />
                    <CodeHelperPopup
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Pno"
                      id="PnoNm"
                      title="사원명"
                      helper={Util.CodeHelper.helperPnoNm2}
                      ComponentCode={headerVO.Pno}
                      ComponentValue={headerVO.PnoNm}
                      SetValue={fsetValue}
                      labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 5px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 150, margin: '3px 0px 5px 0px' }}
                    />
                  </Box>
                  <Box style={{ marginTop: 0, display: 'flex', flexDirection: 'column' }}>
                    <Box style={{ marginTop: 0, display: 'flex', flexDirection: 'row' }}>
                      <Box style={{ marginTop: 30, display: 'flex', flexDirection: 'column' }}>
                        <CodeHelperPopup
                          title="발주구분"
                          id="URGENCYNM"
                          inputCls="inputCls"
                          pgmid={PGMID}
                          inputType="notListed"
                          helper={Util.CodeHelper.UrgencyNm}
                          ComponentCode={headerVO.URGENCY}
                          ComponentValue={headerVO.URGENCYNM}
                          SetValue={fsetValue}
                          labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                          inputStyles={{ width: 150, margin: '5px 0px 5px 0px' }}
                          inputRequired
                        />
                        <CodeHelperPopup
                          inputCls="inputCls"
                          pgmid={PGMID}
                          inputType="notListed"
                          id="VatNm"
                          title="계산서구분"
                          helper={Util.CodeHelper.helperExpenseVatNm}
                          ComponentCode={headerVO.Vatcd}
                          ComponentValue={headerVO.VatNm}
                          SetValue={fsetValue}
                          labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                          inputStyles={{ width: 150, margin: '3px 0px 5px 0px' }}
                          inputRequired
                        />
                        <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center', davNoteNm: '계약번호-??????' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>계약번호</Box>
                          </Box>
                          <TextBox
                            inputCls="inputCls"
                            placeholder2=""
                            placeholder3=""
                            inputId={Util.Common.fMakeId('ContractNo')}
                            className={classes.textBoxMatchPickDateBox}
                            value={headerVO.ContractNo}
                            onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'ContractNo', value)}
                          />
                        </Box>
                        <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center', davNoteNm: '관리번호-FileNo' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>관리번호</Box>
                          </Box>
                          <TextBox
                            inputCls="inputCls"
                            inputId={Util.Common.fMakeId('FileNo')}
                            className={classes.textBoxMatchPickDateBox}
                            onChange={(value) => {
                              Util.Common.fFieldChange(setHeaderVO, 'FileNo', value);
                            }}
                            value={headerVO.FileNo}
                            disabled
                          />
                        </Box>
                      </Box>
                      <Box style={{ marginTop: 30, display: 'flex', flexDirection: 'column' }}>
                        <Box style={{ marginTop: 5, display: 'flex', alignItems: 'center', davNoteNm: '공급가액-TotalAmt' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>공급가액</Box>
                          </Box>
                          <NumberBox
                            // inputCls="inputCls"
                            inputId={Util.Common.fMakeId('TotalAmt')}
                            name="TotalAmt"
                            value={headerVO.TotalAmt}
                            groupSeparator=","
                            precision={0}
                            spinners={false}
                            className={classes.textBoxMatchPickDateBox}
                            inputStyle={{ textAlign: 'right' }}
                            onChange={() => {}}
                            disabled
                          />
                        </Box>
                        <Box style={{ marginTop: 5, display: 'flex', alignItems: 'center', davNoteNm: 'VAT-ToTalVat' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>부가세</Box>
                          </Box>
                          <NumberBox
                            // inputCls="inputCls"
                            name="ToTalVat"
                            inputId={Util.Common.fMakeId('ToTalVat')}
                            value={headerVO.ToTalVat}
                            groupSeparator=","
                            precision={0}
                            spinners={false}
                            className={classes.textBoxMatchPickDateBox}
                            inputStyle={{ textAlign: 'right' }}
                            disabled
                          />
                        </Box>
                        <Box style={{ marginTop: 5, display: 'flex', alignItems: 'center', davNoteNm: 'VAT-ToTalVat' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>합계금액</Box>
                          </Box>
                          <NumberBox
                            // inputCls="inputCls"
                            name="TotalOkAmt"
                            inputId={Util.Common.fMakeId('TotalOkAmt')}
                            value={headerVO.TotalOkAmt}
                            groupSeparator=","
                            precision={0}
                            spinners={false}
                            className={classes.textBoxMatchPickDateBox}
                            inputStyle={{ textAlign: 'right' }}
                            disabled
                          />
                        </Box>
                        <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SC1}>
                            <Box className={classes.SC2}>발주량</Box>
                          </Box>
                          <NumberBox
                            // inputCls="inputCls"
                            name="TotalWeight"
                            inputId={Util.Common.fMakeId('orderqty')}
                            value={headerVO.TotalWeight}
                            groupSeparator=","
                            precision={2}
                            spinners={false}
                            className={classes.textBoxMatchPickDateBox}
                            inputStyle={{ textAlign: 'right' }}
                            disabled
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Box style={{ marginTop: 0, display: 'flex', flexDirection: 'row' }}>
                      <Box
                        style={{ marginTop: 5, display: 'flex', alignItems: 'center' }}
                        onKeyDown={(e) => {
                          if (e.shiftKey && e.key === 'Tab') {
                            e.preventDefault();
                            document.getElementById(Util.Common.fMakeId('VatNm')).focus();
                          } else if (e.key === 'Tab') {
                            e.preventDefault();
                            refPriceButton.current.focus();
                          }
                        }}
                      >
                        <Box className={classes.SC1}>
                          <Box className={classes.SC2}>비고</Box>
                        </Box>
                        <TextBox
                          placeholder="최대60자"
                          inputCls="inputCls"
                          inputId={Util.Common.fMakeId('Remark')}
                          className={classes.textBoxMatchPickDateBox}
                          onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'Remark', value)}
                          value={headerVO.Remark}
                          style={{ width: 410 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Form>
            </Box>
            <Box
              style={{ height: 40, backgroundColor: '#fff3d3', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              id={Util.Common.fMakeId('refPriceButton')}
              onKeyDown={(e) => {
                if (e.shiftKey && e.key === 'Tab') {
                  e.preventDefault();
                  document.getElementById(Util.Common.fMakeId('Remark')).focus();
                } else if (e.key === 'Tab') {
                  e.preventDefault();
                  gridView2.setFocus();
                }
              }}
            >
              <LinkButton ref={refPriceButton} iconCls="icon-search" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3, marginLeft: 10 }} onClick={findUpdatedGoodsPrices}>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box style={{ marginLeft: 5, fontSize: 14, paddingBottom: 2, fontWeight: 500 }}>직전단가조회</Box>
                </Box>
              </LinkButton>
            </Box>
            <Box
              onKeyDown={(e) => {
                if (e.shiftKey && e.key === 'Tab') {
                  setTimeout(() => {
                    refPriceButton.current.focus();
                  }, 10);
                }
              }}
            >
              <Box ref={refGrid2} id={Util.Common.fMakeId('Grid2')} style={{ width: '100%', height: 510, marginTop: 3 }} />
            </Box>
          </LayoutPanel>
          <LayoutPanel region="east" title={refApprovalTitle.current} collapsible collapsed expander style={{ width: 410 }}>
            <Box style={{ marginTop: 10 }}>
              <Approval
                PGMID={PGMID}
                ApprovalType="A"
                ApprovalDocNo={refOrderMaterialNo.current}
                ApprovalDocSource="OD"
                ApprovalDocFlag="C"
                AttachmentsKeyName="문서번호"
                RetrieveFlag={refRetrieveFlag.current}
                SetTitle={SetTitle}
                isAttachments
                isImageComponent
                Init={refApprovalInit.current}
                filepath="OD"
                MaxRevNo={refApprovalMaxRevNo.current}
                RevNo={refApprovalRevNo.current}
              />
            </Box>
          </LayoutPanel>
        </Layout>
      </PerfectScrollbar>

      {printView && (
        <Dialog
          title={
            <Box style={{ display: 'flex' }}>
              <img src={imgEngMark} alt="logo" style={{ width: '50px' }} /> <Box style={{ marginLeft: 15 }}>발주서 출력</Box>
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
      <CodeclassConfirm
        visible={codeClassInputs.visible}
        description={codeClassInputs.desc}
        value={codeClassInputs.value}
        datas={codeClassInputs.datas}
        id={codeClassInputs.id}
        viewId={codeClassInputs.viewId}
        selectedData={codeClassInputs.selectedData}
        width={refWidth.current}
        onConfirm={fCodeClassConfirm}
        onCancel={() => fCodeClassConfirmCancel({ target: codeClassInputs.id })}
      />
      {attachView && <Attachments PGMID={PGMID} FileTitle="발주자료번호" FileType={refDocSource.current} FileNo={refOrderMaterialNo.current} FilePath="OD" setClose={fAttachClose} />}
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Toast visible={toast.visible} description={toast.desc} type={toast.type} onConfirm={() => setToast({ visible: false })} duration={toast.duration} />
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      <SearchGoods visible={searchGoods.visible} selectedData={searchGoods.selectedData} id={searchGoods.id} onConfirm={() => fSearchGoodsConfirm()} onClose={() => fClose()} pgmid={PGMID} />
    </>
  );
});

let dataProvider1, dataProvider2;
let gridView1, gridView2;

const Styles = createUseStyles(StylesMain);

export default thePage;
