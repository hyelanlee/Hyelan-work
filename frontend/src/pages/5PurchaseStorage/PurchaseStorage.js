import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import useStores from '@stores/useStores';
import { StylesMain } from '@pages/purchase/PurchaseStorageStyle';
import CommonButton from '@root/components/common/CommonButton';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Box } from '@material-ui/core';
import CommonDatePicker from '@components/common/CommonDatePicker';
// import CodeHelperTextBox from '@components/common/helper/CodeHelperTextBox';
import { Utility } from '@components/common/Utility/Utility';
import { CodeHelper } from '@components/common/Utility/CodeHelper';
import { TextBox, NumberBox, Form, Dialog, Layout, LayoutPanel, ComboBox, CheckBox, Label, Accordion, AccordionPanel, LinkButton, RadioButton } from 'rc-easyui';
import { GridView, LocalDataProvider } from 'realgrid';
import { GridFields1, GridColumns1, GridFields2, GridColumns2 } from '@pages/purchase/PurchaseStorageGrid';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import numeral from 'numeral';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import imgKsMark from '@assets/images/img_ks_mark.png';
import Approval from '@components/common/Approval/Approval';
import Attachments from '@components/common/Attachments/Attachments';
import PurchaseStorageBalSearch from '@pages/purchase/PurchaseStorageBalSearch';
import BaljooDetail from '@pages/purchase/PurchaseStorageBaljooDetail';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { Report } from '@components/common/Utility/Report';
import SearchGoods from '@components/common/SearchGoods/SearchGoods';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';

const PurchaseStorage = observer(() => {
  const PGMID = 'PURCHASESTORAGE';
  const { $CommonStore, $UserStore } = useStores();

  const classes = Styles();

  const refGrid1 = useRef(null);
  const refGrid2 = useRef(null);
  const refDelvNo = useRef(null);
  const refTaxType = useRef(null);
  // const refIndex = useRef(0);
  const refTaxno = useRef(null);
  const refExportYn = useRef(null);
  const refCustCd = useRef(null);
  const refJukyocd = useRef(null);
  const refGoodcd = useRef(null);
  const refApprovalTitle = useRef('결재 · 미상신');
  const refBalJoobutton = useRef(null);
  const refBalNo = useRef(null);
  const refBalSerl = useRef(null);
  const refPrintingDate1 = useRef(null);
  const refPrintingDate2 = useRef(null);
  const refWidth = useRef(0);

  const [searchVO, setSearchVO] = useState({});
  const [headerVO, setHeaderVO] = useState({});
  const [printList, setPrintList] = useState(false);
  const [printView, setPrintView] = useState(false);
  const [printTitle, setPrintTitle] = useState('');
  const [gridFocus, setGridFocus] = useState('');
  const [attachView, setAttachView] = useState(false);
  const [headerRules] = useState({
    DelvDate: 'required', //입고일자
    Gendate: 'required', //작성일자
    ExportYn: 'required', //내외자구분
    CustCdNm: 'required', //거래처명
    CustCd: 'required',
    Taxdate: 'required', //세금계산서일자
    Vatcd: 'required', //계산서구분
    VatNm: 'required',
    Sliptyp: 'required', //전표처리구분
    DeptCD: 'required',
    DeptCDNm: 'required',
    Pno: 'required',
    PnoNm: 'required',
  });
  // const [num, setNum] = useState(Math.random() * 100);
  const [cboSchType] = useState([
    { value: '0', text: '입고일자' },
    { value: '1', text: '입고번호' },
    { value: '2', text: '거래처명' },
    { value: '3', text: '줄임상호' },
  ]);

  const [ExportYnType] = useState([
    { value: '0', text: '0.클래임' },
    { value: '1', text: '1.내수' },
    { value: '2', text: '2.수입' },
  ]);
  const [Sliptype] = useState([
    { value: '0', text: '0.건별' },
    { value: '1', text: '1.월별' },
  ]);

  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    desc: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });
  const [balJooButton, setBalJooButton] = useState({
    visible: false,
    // id: '',
  });
  const [balJooDetail, setBalJooDetail] = useState({
    visible: false,
  });
  const [searchGoods, setSearchGoods] = useState({
    visible: false,
    selectedData: {},
    id: '',
    pgmid: '',
  });
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });
  const UtilCodeHelper = new CodeHelper();
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);
  const UtilReport = new Report();

  const validationField = ['No', 'GoodNo', 'jukyonm', 'Delvqty'];
  const fCodeClassConfirmCancelField = ['GoodNo', 'Priceunitnm', 'jukyocd', 'WhCdNm'];
  const helperField = ['GoodNo', 'GoodCdNm', 'Priceunitnm', 'jukyocd', 'jukyonm'];
  const vatField = ['103011', '103013', '103015'];
  const validationGrid = {
    GoodCD: '품번코드',
    jukyocd: '회계처리코드',
    Delvqty: '구매량',
  };

  const fInit = () => {
    setSearchVO(
      {
        SchAccunit: '',
        SchFactory: '',
        SchFrDate: moment().clone().startOf('month').toDate(),
        SchToDate: new Date(),
        SchWriting: 'Y',
        SchPno: '',
        SchPnoNm: '',
        SchCustCd: '',
        SchCustCdNm: '',
        SchType: '0',
        SchText: '',
      },
      50,
    );

    setHeaderVO(
      {
        Accunit: $UserStore.user.accunit,
        Factory: $UserStore.user.factory,
        Factorynm: $UserStore.user.factorynm,
        ExportYn: '1', //내외자구분
        DelvNo: '',
        DelvDate: new Date(),
        CustCd: '',
        Exchang: 1,
        state: '',
        Billdate: new Date(),
        TotalPrice: 0, //공급가액
        TotalVat: 0, //부가세
        TotalAmount: 0, //입고총액
        Qty: 0,
        ProjectNo: '',
        ActNo: '',
        CustCdNm: '',
        CustNm: '',
        Truncnm: '',
        VatNm: '전자세금계산서(일반과세)',
        ProjectCustCd: '',
        ProjectCustNm: '',
        Slpdat: '',
        DocSource: '',
        Pno: $UserStore.user.userid,
        DocNo: '',
        ApprDocProg: '',
        Gendate: new Date(), //작성일자
        DeptCD: $UserStore.user.deptcd,
        CurrCd: '057001',
        Remark: '',
        TaxDate: new Date(),
        Vatcd: '103011',
        Sliptyp: '1', //전표처리구분
        slipno: '',
        LNKCOD: '',
        TotalForeign: 0,
        Currdate: new Date(),
        TotalAmt: 0, //원화금액
        Totalweight: 0,
        UnitPrice: 0,
        UnitPricew: 0,
        PnoNm: $UserStore.user.username,
        DeptCDNm: $UserStore.user.deptnm,
        CurrCdNm: 'KOR',
        Taxno: '',
        BL_No: '',
      },
      50,
    );

    refDelvNo.current = '';
    refTaxType.current = '103011';
    refExportYn.current = '';
    refTaxno.current = '';
    refCustCd.current = '';
    refGoodcd.current = '';
    refJukyocd.current = '';
    refBalNo.current = '';
    refBalSerl.current = '';
    document.getElementById(Util.Common.fMakeId('Remark')).maxLength = 50;
    setTimeout(() => {
      Util.Common.fSetTabIndex();
    }, 300);
    document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
  };
  // --------------------- Init Grid1 시작 ------------------------------------------------------------- //
  const fInitGrid1 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid1'));
    dataProvider1 = new LocalDataProvider(false);
    gridView1 = new GridView(refGrid1.current);
    Util.Grid.fInitGridHeader(gridView1, dataProvider1, GridFields1, GridColumns1, 30, fOnCurrentRowChanged1, fOnCellClicked1, fKeyConfig1);
    gridView1.setRowIndicator({ visible: false });
    gridView1.onCellDblClicked = function () {
      document.getElementById(Util.Common.fMakeId('Gendate')).focus();
    };

    gridView1.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'ApprDocProg') === '반려') return 'rg-column-color-1';
      if (grid.getValue(item.index, 'ApprDocProg') === '완결') return 'rg-column-color-3';
      if (grid.getValue(item.index, 'ApprDocProg') === '진행중') return 'rg-column-color-2';
    });
  };

  // 수입부대비용 헤더 그리드 행변경
  const fOnCurrentRowChanged1 = async (grid, oldRow, newRow) => {
    if (newRow >= 0) {
      $CommonStore.fSetBinding(true);
      gridView2.commit();
      setGridFocus('H');
      const currentRow = dataProvider1.getJsonRow(newRow);
      setHeaderVO(currentRow);
      $CommonStore.fSetBinding(false);
      refDelvNo.current = currentRow.DelvNo;
      refTaxType.current = currentRow.Vatcd;
      refExportYn.current = currentRow.ExportYn;
      refCustCd.current = currentRow.CustCd;
      refTaxno.current = currentRow.Taxno.substr(0, 3) + '-' + currentRow.Taxno.substr(3, 2) + '-' + currentRow.Taxno.substr(5, 5);
      refApprovalTitle.current = currentRow.DocStatus;
      refPrintingDate1.current = currentRow.DelvDate;
      refPrintingDate2.current = currentRow.Gendate;
      if (currentRow.CustCdNm !== null || currentRow.CustCdNm !== '') {
        Util.Common.fFieldChange(setHeaderVO, 'Taxno', refTaxno.current);
      }
      await fSearchDetail();
    }
  };

  // 수입부대비용 헤더 그리드 Cell 클릭
  const fOnCellClicked1 = async () => {};
  const fKeyConfig1 = async (grid, event) => {
    switch (event.key) {
      case 'Tab':
        setTimeout(() => {
          document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
        }, 0);
        break;
      default:
        break;
    }
  };
  // --------------------- Init Grid1 끝 ------------------------------------------------------------- //
  // --------------------- Init Grid2 시작 ------------------------------------------------------------- //
  const fInitGrid2 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid2'));
    dataProvider2 = new LocalDataProvider(false);
    gridView2 = new GridView(refGrid2.current);
    Util.Grid.fInitGridDetail(gridView2, dataProvider2, GridFields2, GridColumns2, fGridView2onCellButtonClicked, fOnCellEdited2, fKeyConfig2);
    gridView2.setRowIndicator({ visible: false });
    gridView2.setFooters({ visible: true });
    gridView2.onCellClicked = function (grid, clickData) {
      if (clickData.dataRow >= 0) {
        setGridFocus('D');
      }
    };
    gridView2.onValidateColumn = (grid, column, inserting, value) => {
      const error = {};
      if (validationField.includes(column.fieldName)) {
        if (value === undefined || value === null) {
          error.level = 'warning';
          error.message = '필수 입력 값입니다.';
        }
      }
      return error;
    };
    // eslint-disable-next-line prettier/prettier
    gridView2.setContextMenu([
      { label: '엑셀 다운로드' }, 
      { label: '전체체크' }, 
      { label: '체크해제' }, 
      { label: '발주내역조회' }
    ]);

    gridView2.onContextMenuItemClicked = async (grid, item, column) => {
      if (item.label === '엑셀 다운로드') {
        if (dataProvider2.getRowCount()) {
          gridView2.exportGrid({
            compatibility: true,
            type: 'excel',
            target: 'local',
            applyDynamicStyles: true,
            fileName: `구매입고_${moment(new Date()).format('YYYYMMDD')}.xlsx`,
          });
        }
      } else if (item.label === '전체체크') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'Y');
          });
        }
      } else if (item.label === '체크해제') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'N');
          });
        }
      } else if (item.label === '발주내역조회') {
        refBalNo.current = dataProvider2.getJsonRow(column.itemIndex).BalNo;
        refBalSerl.current = dataProvider2.getJsonRow(column.itemIndex).BalSerl;
        if (refBalNo.current === '' || refBalSerl.current === '') {
          setAlert({ visible: true, desc: '조회할 발주내역이 없습니다.', type: 'W' });
          return;
        }

        setBalJooDetail({ visible: true });
      }
    };

    dataProvider2.onRowInserted = (provider, rownumber) => {
      Util.Grid.fSetMultiDataProvider(provider, rownumber, {
        No: numeral(parseInt(Util.Grid.fMaxSeq(provider, 'No')) + 1).format('000'),
        Accunit: $UserStore.user.accunit,
        Factory: $UserStore.user.factory,
      });
    };
    gridView2.getDataSource().addRow([]);
  };

  const fGridView2onCellButtonClicked = async (grid, index) => {
    grid.commit();
    setGridFocus('D');
    let value = grid.getValue(grid.getCurrent().itemIndex, index.fieldName);
    if (value === null) value = '';
    let codeClassValue = {};

    if (index.fieldName === 'GoodCdNm') {
      if (refCustCd.current === undefined || refCustCd.current === '') {
        setAlert({ visible: true, desc: '거래처를 먼저 선택하세요', type: 'W' });
        return;
      }
      codeClassValue = await Util.Grid.gridSearchGoods(grid.getCurrent(), PGMID, value, true);
      setSearchGoods(codeClassValue);
    }

    if (index.fieldName === 'Priceunitnm') {
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperPriceUnit, PGMID, value, true);
    } else if (index.fieldName === 'jukyonm') {
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperJukyoNm, PGMID, value, true);
    } else if (index.fieldName === 'WhCdNm') {
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperWhNm, PGMID, value, true);
    }
    let totalSize = 0;
    codeClassValue.datas[0].map((item) => {
      totalSize += Number(item.Size);
    });
    refWidth.current = totalSize < 470 ? 470 : totalSize + 500;
    setCodeClassInputs(codeClassValue);
  };

  // 상세 그리드 셀 변경
  const fOnCellEdited2 = async (grid, itemIndex) => {
    grid.commit();
    setGridFocus('D');
    const item = grid.getCurrent();
    const value = grid.getValue(item.itemIndex, item.column);

    if (value === null || value === '') {
      if (item.column === 'GoodCdNm' || item.column === 'GoodNo') {
        Util.Grid.fSetDataProvider(
          dataProvider2,
          item.dataRow,
          [
            'GoodNo',
            'GoodCdNm',
            'Spec',
            'GoodCD',
            'Whcd',
            'WhCdNm',
            'jukyonm',
            'jukyocd',
            'UnitCD',
            'UnitCdNm',
            'Boxunit',
            'BoxUnitNm',
            'StockYn',
            'Priceunit',
            'Priceunitnm',
            'goodtype',
            'KgPerM',
            'Unitweight',
          ],
          undefined,
        );
      } else if (item.column === 'Priceunitnm') {
        Util.Grid.fSetDataProvider(dataProvider2, item.dataRow, ['Priceunitnm', 'Priceunit'], undefined);
      } else if (item.column === 'jukyocd') {
        Util.Grid.fSetDataProvider(dataProvider2, item.dataRow, ['jukyocd', 'Jukyonm'], undefined);
      }
    } else if (item.column) {
      const priceUnit = grid.getValue(item.itemIndex, 'Priceunit');
      if (item.column === 'Qty') {
        const qty = grid.getValue(item.itemIndex, 'Qty');
        if (priceUnit === '220003') {
          dataProvider2.setValue(item.itemIndex, 'Delvqty', qty);
          dataProvider2.setValue(item.itemIndex, 'Weight', qty);
        } else if (priceUnit === '220001') {
          const unitWeight = grid.getValue(item.itemIndex, 'Unitweight');
          dataProvider2.setValue(item.itemIndex, 'Delvqty', qty * unitWeight);
          dataProvider2.setValue(item.itemIndex, 'Weight', qty * unitWeight);
        } else if (priceUnit.trim() === '') {
          dataProvider2.setValue(item.itemIndex, 'Delvqty', dataProvider2.getValue(item.itemIndex, 'Qty'));
        }
      } else if (item.column === 'Weight') {
        if (priceUnit === '220001') {
          dataProvider2.setValue(item.dataRow, 'Delvqty', grid.getValue(item.itemIndex, 'Weight'));
        } else if (priceUnit === '220003') {
          dataProvider2.setValue(item.dataRow, 'Qty', grid.getValue(item.itemIndex, 'Weight'));
          dataProvider2.setValue(item.dataRow, 'Delvqty', grid.getValue(item.itemIndex, 'Weight'));
        }
      } else if (item.column === 'Unitweight') {
        if (priceUnit === '220001') {
          const unitWeight = grid.getValue(item.itemIndex, 'Unitweight');
          const qty = grid.getValue(item.itemIndex, 'Qty');
          dataProvider2.setValue(item.dataRow, 'Delvqty', unitWeight * qty);
          dataProvider2.setValue(item.dataRow, 'Weight', unitWeight * qty);
        }
      } else if (item.column === 'Price') {
      }
      updateAmountOkamt(itemIndex);
      UpdateheaderSum();
    }

    if (item.column === 'Tax' || item.column === 'Amount') {
      const Amount = dataProvider2.getValue(item.dataRow, 'Amount');
      const tax = dataProvider2.getValue(item.dataRow, 'Tax');
      dataProvider2.setValue(item.dataRow, 'OkAmt', Amount + tax);
      UpdateheaderSum();
    } else if (item.column === 'Remark') {
      const remark = grid.getValue(item.itemIndex, 'Remark');
      if (remark.length > 200) dataProvider2.setValue(item.itemIndex, 'Remark', remark.substring(0, 200));
    }

    grid.validateCells();
  };

  // 상세 그리드 키 이벤트
  const fKeyConfig2 = async (grid, event) => {
    const lastFieldName = 'Bomchecksort';
    const rowCount = grid.getDataSource().getRowCount();
    const { fieldName } = grid.getCurrent();
    const { itemIndex } = grid.getCurrent();
    const rows = dataProvider2.getJsonRows();
    const rowLength = rows.length - 1;

    switch (event.key) {
      case 'Enter':
        setAlert({ visible: false, desc: '' });
        grid.commit(true);

        if (fieldName === lastFieldName) {
          Util.Grid.fEnterLastField(grid, itemIndex, rowCount, fNewRowChk() === 0);
        } else if (grid.getDataSource().getValue(itemIndex, fieldName)) {
          if (helperField.includes(fieldName)) {
            grid.setCurrent({ itemIndex, fieldName });
            const value = grid.getValue(itemIndex, fieldName);
            let codeClassValue = {};
            if (value !== '') {
              if (fieldName === 'GoodNo') {
                const goodHelper = Util.CodeHelper.fRedefHelper(Util.CodeHelper.helperProtypeNm, {
                  iInId: 'AD11',
                  iInCode1: '001',
                  iInCode2: $UserStore.user.factory,
                  iInCode3: Util.Common.fTrim(grid.getValue(grid.getCurrent().itemIndex, 'GoodNo')),
                });
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), goodHelper, PGMID, value, false);
                if (!codeClassValue.visible) {
                  const selectedData = codeClassValue.res;
                  Util.Grid.fSetMultiDataProvider(dataProvider2, itemIndex, {
                    GoodNo: selectedData.goodno,
                    GoodCdNm: selectedData.goodnm,
                    Spec: selectedData.spec,
                    GoodCD: selectedData.goodcd,
                    Whcd: selectedData.wrhcd,
                    WhCdNm: selectedData.wrhnm,
                    jukyonm: selectedData.jukyonm_c,
                    jukyocd: selectedData.jukyocd_c,
                    UnitCD: selectedData.inunit,
                    UnitCdNm: selectedData.inunitnm,
                    Boxunit: selectedData.boxunit,
                    BoxUnitNm: selectedData.boxunitnm,
                    StockYn: selectedData.stockyn,
                    Priceunit: selectedData.priceunit,
                    Priceunitnm: selectedData.priceunitnm,
                    goodtype: selectedData.goodtype,
                    KgPerM: selectedData.kgperm,
                    Unitweight: selectedData.weight,
                  });
                  refGoodcd.current = selectedData.goodcd;
                  refJukyocd.current = selectedData.jukyocd_c;
                  const balNo = gridView2.getValue(itemIndex, 'BalNo');
                  if (refCustCd.current !== '' && refGoodcd.current !== '') {
                    if (!balNo) {
                      await fSearchPrice(itemIndex);
                      setTimeout(() => {
                        updateAmountOkamt(itemIndex);
                        UpdateheaderSum();
                      }, 100);
                    }
                  }
                }
              } else if (fieldName === 'Priceunitnm') {
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperPriceUnit, PGMID, value, false);
                if (!codeClassValue.visible) {
                  const selectedData = codeClassValue.res;
                  Util.Grid.fSetMultiDataProvider(dataProvider2, itemIndex, { Priceunit: selectedData.minorcd, Priceunitnm: selectedData.minornm });
                  updateUnitDefaultValue(itemIndex, value);
                  updateAmountOkamt(itemIndex);
                  UpdateheaderSum();
                }
              } else if (fieldName === 'jukyonm' || fieldName === 'jukyocd') {
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperJukyoNm, PGMID, value, false);
                if (!codeClassValue.visible) {
                  const selectedData = codeClassValue.res;
                  Util.Grid.fSetMultiDataProvider(dataProvider2, itemIndex, { jukyocd: selectedData.jukyocd, Jukyonm: selectedData.jukyonm });

                  refGoodcd.current = gridView2.getValue(itemIndex, 'GoodCD');
                  refJukyocd.current = gridView2.getValue(itemIndex, 'jukyocd');
                  if (refCustCd.current !== '' && refGoodcd.current !== '') {
                    // await fSearchPrice(itemIndex);
                    // setTimeout(() => {
                    //   updateAmountOkamt(itemIndex);
                    //   UpdateheaderSum();
                    // }, 100);
                  }
                }
              } else if (fieldName === 'WhCdNm') {
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), UtilCodeHelper.helperWhNm, PGMID, value, false);
                if (!codeClassValue.visible) {
                  const selectedData = codeClassValue.res;
                  Util.Grid.fSetMultiDataProvider(dataProvider2, itemIndex, { Whcd: selectedData.wrhcd, WhCdNm: selectedData.wrhnm });
                }
              }
              let totalSize = 0;
              codeClassValue.datas[0].map((item) => {
                totalSize += Number(item.Size);
              });
              refWidth.current = totalSize < 470 ? 470 : totalSize + 80;
              setCodeClassInputs(codeClassValue);
              gridView2.validateCells();
            }
          }
        }
        grid.setFocus();
        break;
      case 'Escape':
        Util.Grid.fEscape(grid, itemIndex, rowCount, 'No');
        // eslint-disable-next-line no-case-declarations
        UpdateheaderSum();
        break;
      case 'Insert':
        Util.Grid.fKeyInsert(grid, itemIndex, fNewRowChk() === 0, 'No');
        break;
      case 'ArrowDown':
        Util.Grid.fArrowDown(grid, itemIndex, rowCount, fNewRowChk() === 0, 'No');
        break;
      case 'ArrowUp':
        if (rows[rowLength].GoodCD || rows[rowLength].jukyocd) {
        } else {
          Util.Grid.fArrowUp(grid, itemIndex, rowCount, fNewRowChk(itemIndex) > 0);
        }
        break;
      case 'Tab':
        document.getElementById(Util.Common.fMakeId('Factorynm')).focus();
        break;
      case event.ctrlKey && ' ':
        // eslint-disable-next-line no-case-declarations
        const fieldIndex = { fieldName: fieldName };
        fGridView2onCellButtonClicked(grid, fieldIndex);
        break;
      default:
        break;
    }
  };

  const fNewRowChk = (itemIndex) => {
    const rows = dataProvider2.getAllStateRows().created;
    if (rows.length > 0) {
      let emptyCnt = 0;
      rows.map((item) => {
        if (itemIndex === undefined || item >= itemIndex) {
          const datas = gridView2.getValues(item);
          if (!datas.GoodCD || datas.GoodCD === undefined || !datas.Qty || datas.Qty === undefined || !datas.jukyocd || datas.jukyocd === undefined) {
            emptyCnt += 1;
          }
        }
      });
      return emptyCnt;
    }
    return 0;
  };
  // --------------------- Init Grid2 끝 ------------------------------------------------------------- //
  // --------------------- SIDE 시작 ------------------------------------------------------------- //

  // 그리드 데이터 소스 초기화
  const fInitDataProvider = () => {
    dataProvider2.clearRows();
    gridView1.clearCurrent();
    gridView2.clearCurrent();
    Util.Grid.fNewRow(dataProvider2, { No: '001' });
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };

  const fSetValue = (id, value, name, currentData) => {
    if ($CommonStore.fGetBinding()) {
      return;
    }
    let result;
    const selDataTaxno = currentData.Data.taxno;
    switch (id) {
      case 'schCrePnoNm':
        Util.Common.fMultiFieldChange(setSearchVO, {
          SchPno: value,
          SchPnoNm: name,
        });
        break;
      case 'schCustNm':
        Util.Common.fMultiFieldChange(setSearchVO, {
          SchCustCd: currentData.Data.custoutcd,
          SchCustCdNm: currentData.Data.custnm,
        });
        break;
      case 'CustCdNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          CustCd: value,
          CustCdNm: name,
        });
        if (value) {
          refCustCd.current = value;
          fUpdatePrices();
        }
        if (selDataTaxno) {
          result = selDataTaxno.substr(0, 3) + '-' + selDataTaxno.substr(3, 2) + '-' + selDataTaxno.substr(5, 5);
          Util.Common.fFieldChange(setHeaderVO, 'Taxno', result);
        }
        break;
      case 'DeptCDNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          DeptCD: value,
          DeptCDNm: name,
        });
        break;
      case 'PnoNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          Pno: value,
          PnoNm: name,
        });
        break;
      case 'CurrCdNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          CurrCd: value,
          CurrCdNm: name,
        });
        break;
      case 'VatNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          Vatcd: value,
          VatNm: name,
        });
        if (value) {
          refTaxType.current = value;
          fCalTax();
          UpdateheaderSum();
        }
        break;
      case 'ProjectCustNm':
        Util.Common.fMultiFieldChange(setHeaderVO, {
          ProjectCustCd: value,
          ProjectCustNm: name,
        });
        break;
    }
  };

  const fGetExchange = async (Currcd, ExchangeDate) => {
    if (!Currcd || !ExchangeDate) {
      return;
    }

    try {
      const result = await axios.get('/@api/purchase/purchaseStorage/selectByExchange', {
        params: { SchAccunit: $UserStore.user.accunit, SchCurrcd: Currcd, SchExchangeDate: moment(ExchangeDate).format('YYYYMMDD') },
      });
      const rdata = result.data;
      if (rdata) {
        Util.Common.fFieldChange(setHeaderVO, 'Exchang', rdata.Rate);
      } else {
        Util.Common.fFieldChange(setHeaderVO, 'Exchang', 1);
      }
    } catch (error) {
      setAlert({ visible: true, desc: '환율정보 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  // 그리드 코드도움말 팝업 확인 버튼
  const fCodeClaseConfirm = async () => {
    if (gridFocus === 'D') {
      gridView2.commit();
      const clickData = codeClassInputs.selectedData;
      const selectedData = $CommonStore.Codeclass.selData;
      if (clickData.column === 'GoodCdNm' || clickData.column === 'GoodNo') {
        Util.Grid.fSetMultiDataProvider(dataProvider2, clickData.dataRow, {
          GoodNo: selectedData.goodno,
          GoodCdNm: selectedData.goodnm,
          Spec: selectedData.spec,
          GoodCD: selectedData.goodcd,
          Whcd: selectedData.wrhcd,
          WhCdNm: selectedData.wrhnm,
          jukyonm: selectedData.jukyonm_c,
          jukyocd: selectedData.jukyocd_c,
          UnitCD: selectedData.inunit,
          UnitCdNm: selectedData.inunitnm,
          Boxunit: selectedData.boxunit,
          BoxUnitNm: selectedData.boxunitnm,
          StockYn: selectedData.stockyn,
          Unitweight: selectedData.Weight,
          // StockQty: selectedData.Stockqty,
          Priceunit: selectedData.priceunit,
          Priceunitnm: selectedData.priceunitnm,
          goodtype: selectedData.goodtype,
          KgPerM: selectedData.kgperm,
        });
        if (refCustCd.current !== '' && refGoodcd.current !== '') {
          await fSearchPrice(clickData.dataRow);
          updateAmountOkamt(clickData.dataRow);
          UpdateheaderSum();
        }
      } else if (clickData.column === 'Priceunitnm') {
        Util.Grid.fSetMultiDataProvider(dataProvider2, clickData.dataRow, { Priceunit: selectedData.minorcd, Priceunitnm: selectedData.minornm });
        updateUnitDefaultValue(clickData.dataRow, selectedData.minorcd);
        updateAmountOkamt(clickData.dataRow);
        UpdateheaderSum();
      } else if (clickData.column === 'jukyonm') {
        Util.Grid.fSetMultiDataProvider(dataProvider2, clickData.dataRow, { jukyocd: selectedData.jukyocd, jukyonm: selectedData.jukyonm });
        refJukyocd.current = gridView2.getValue(clickData.dataRow, 'jukyocd');
        if (refCustCd.current !== '' && refGoodcd.current !== '') {
          // await fSearchPrice(clickData.dataRow);
          setTimeout(() => {
            updateAmountOkamt(clickData.dataRow);
            UpdateheaderSum();
          }, 100);
        }
      } else if (clickData.column === 'WhCdNm') {
        Util.Grid.fSetMultiDataProvider(dataProvider2, clickData.dataRow, { Whcd: selectedData.wrhcd, WhCdNm: selectedData.wrhnm });
      }

      gridView2.commit();
      gridView2.validateCells();
      setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
      gridView2.setFocus();
    }
  };

  // 그리드 코드도움말 팝업 취소 버튼
  const fCodeClassConfirmCancel = (e) => {
    if (gridFocus === 'D') {
      const Index = gridView2.getCurrent().itemIndex;

      if (fCodeClassConfirmCancelField.includes(e.target)) {
        setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
      }
      gridView2.setCurrent({ itemIndex: Index, fieldName: gridView2.getCurrent().fieldName });
      gridView2.setFocus();
      setGridFocus('D');
    }
    setCodeClassInputs({ visible: false });
  };

  const fSearchGoodsConfirm = () => {
    if (gridFocus === 'D') {
      gridView2.commit();
      const clickData = searchGoods.selectedData;
      if (clickData.column === 'GoodCdNm') {
        try {
          $CommonStore.Parameter.map((item, index) => {
            const rowCount = gridView2.getDataSource().getRowCount();
            if (rowCount <= index + clickData.dataRow) {
              gridView2.getDataSource().addRow([]);
            }
            Util.Grid.fSetMultiDataProvider(dataProvider2, clickData.dataRow + index, {
              GoodCdNm: $CommonStore.Parameter[index].Goodnm,
              GoodNo: $CommonStore.Parameter[index].Goodno,
              Spec: $CommonStore.Parameter[index].Spec,
              GoodCD: $CommonStore.Parameter[index].Goodcd,
              Whcd: $CommonStore.Parameter[index].Wrhcd,
              WhCdNm: $CommonStore.Parameter[index].Wrhnm,
              jukyonm: $CommonStore.Parameter[index].Jukyonm,
              jukyocd: $CommonStore.Parameter[index].Jukyocd,
              UnitCD: $CommonStore.Parameter[index].Unitcd,
              UnitCdNm: $CommonStore.Parameter[index].Unitnm,
              Boxunit: $CommonStore.Parameter[index].Boxunit,
              BoxUnitNm: $CommonStore.Parameter[index].Boxunitnm,
              StockYn: $CommonStore.Parameter[index].Storkyn,
              Priceunit: $CommonStore.Parameter[index].Priceunit,
              Priceunitnm: $CommonStore.Parameter[index].Priceunitnm,
              Unitweight: $CommonStore.Parameter[index].Weight,
              StockQty: $CommonStore.Parameter[index].Stockqty,
              goodtype: $CommonStore.Parameter[index].GoodType,
              KgPerM: $CommonStore.Parameter[index].KgPerM,
            });
            refGoodcd.current = $CommonStore.Parameter[index].Goodcd;
            refJukyocd.current = $CommonStore.Parameter[index].Jukyocd;
          });
        } catch (e) {
          setAlert({ visible: true, desc: '품목을 선택해주세요.', type: 'E' });
          return;
        }
        if (refGoodcd.current !== '' && refJukyocd.current !== '') {
          setTimeout(() => {
            fSearchPrice(clickData.dataRow);
            updateAmountOkamt(clickData.dataRow);
            UpdateheaderSum();
          }, 100);
        }
      }
      gridView2.commit();
      gridView2.validateCells();
      setSearchGoods({ visible: false, selectedData: {}, id: '', viewId: '' });
      gridView2.setFocus();
      $CommonStore.fSetParameter('');
    }
  };

  const fClose = () => {
    setSearchGoods({ visible: false, selectedData: {}, id: '', viewId: '', value: '' });
    $CommonStore.fSetParameter('');
  };

  const modifyGuid = (data) => {
    data.forEach((e) => {
      if (Util.Common.fEmptyReturn(e.Guid)) {
        e.Guid = e.Guid.substr(0, 15);
      }
    });
    return data;
  };

  const fCalTax = () => {
    // if (!dataProvider2) return;

    if (vatField.includes(refTaxType.current)) {
      const rows = dataProvider2.getJsonRows();
      rows.forEach((value, index) => {
        const Amount = dataProvider2.getValue(index, 'Amount');
        Util.Grid.fSetMultiDataProvider(dataProvider2, index, { Tax: Amount * 0.1, OkAmt: Amount * 1.1 });
      });
      rows.map(function (el) {
        el.Tax = el.Amount * 0.1;
        el.OkAmt = el.Amount * 1.1;
      });
    } else {
      const rows = dataProvider2.getJsonRows();
      rows.forEach((value, index) => {
        const Amount = dataProvider2.getValue(index, 'Amount');
        Util.Grid.fSetMultiDataProvider(dataProvider2, index, { Tax: '0', OkAmt: Amount });
      });
      for (const row of rows) {
        row.Tax = 0;
        row.OkAmt = row.Amount;
      }
    }
  };

  const updateAmountOkamt = (index) => {
    if (index < -1) return;
    const Price = dataProvider2.getValue(index, 'Price');
    const Delvqty = dataProvider2.getValue(index, 'Delvqty');
    if (Util.Common.fEmptyReturn(Price) || Util.Common.fEmptyReturn(Price) === 0) {
      dataProvider2.setValue(index, 'Amount', Price * Delvqty);
    }
    const Amount = dataProvider2.getValue(index, 'Amount');
    let taxVal = 0;
    if (vatField.includes(refTaxType.current)) {
      taxVal = Math.round(Amount * 0.1);
    }
    dataProvider2.setValue(index, 'Tax', taxVal);
    dataProvider2.setValue(index, 'OkAmt', Amount + taxVal);
  };

  const updateUnitDefaultValue = (index, value) => {
    const qty = dataProvider2.getValue(index, 'Qty');
    const Unitweight = dataProvider2.getValue(index, 'Unitweight');
    if (Util.Common.fEmptyReturn(qty)) {
      if (value === '220001') {
        if (Unitweight) {
          Util.Grid.fSetMultiDataProvider(dataProvider2, index, {
            Weight: qty * Unitweight,
            Su: 0,
            Delvqty: qty * Unitweight,
          });
        } else {
          Util.Grid.fSetMultiDataProvider(dataProvider2, index, {
            Delvqty: dataProvider2.getValue(index, 'qty'),
            Weight: dataProvider2.getValue(index, 'qty'),
            Su: 0,
          });
        }
      } else if (value === '220003') {
        Util.Grid.fSetMultiDataProvider(dataProvider2, index, {
          Delvqty: dataProvider2.getValue(index, 'qty'),
          Weight: dataProvider2.getValue(index, 'qty'),
          Su: 0,
        });
      }
    }
  };

  function UpdateheaderSum() {
    // if (!dataProvider2) return;
    let sumAmount = 0;
    let sumTax = 0;
    let sumOkAmt = 0;
    const gridData = dataProvider2.getJsonRows();
    gridData.map(function (row) {
      if (!isNaN(row.Amount) && !isNaN(row.Tax) && !isNaN(row.OkAmt)) {
        sumAmount += row.Amount;
        sumTax += row.Tax;
        sumOkAmt += row.OkAmt;
      }
    });
    Util.Common.fMultiFieldChange(setHeaderVO, {
      TotalPrice: sumAmount,
      TotalVat: sumTax,
      TotalAmount: sumOkAmt,
      TotalAmt: sumOkAmt,
    });

    // Util.Common.fMultiFieldChange(setHeaderVO, {
    //   TotalPrice: sumByfield(gridData, 'Amount'),
    //   TotalVat: sumByfield(gridData, 'Tax'),
    //   TotalAmount: sumByfield(gridData, 'OkAmt'),
    //   TotalAmt: sumByfield(gridData, 'OkAmt'),
    // });
  }

  // const sumByfield = (arr, field) => {
  //   let sum = 0;
  //   for (let i in arr) {
  //     let result = Object.getOwnPropertyDescriptor(arr[i], `${field}`).value;
  //     if (!isNaN(result)) {
  //       sum += result;
  //     }
  //   }
  //   return sum;
  // };

  const SetTitle = (title) => {
    refApprovalTitle.current = title;
    setSearchVO({ ...searchVO });

    setTimeout(() => {
      fSearch();
      setHeaderVO({
        ...headerVO,
        DelvNo: refDelvNo.current,
      });
      setTimeout(async () => {
        // gridView1.orderBy(['DelvNo'], ['descending'], ['insensitive']);
        const sd = dataProvider1.searchData({ fields: ['DelvNo'], value: refDelvNo.current, partialMatch: true });
        if (sd != null) gridView1.setCurrent({ dataRow: sd.dataRow, column: 0 });
        // await fSearchDetail();
      }, 500);
    }, 700);
  };

  const fCheckBox = (value) => {
    let rows = dataProvider2.getJsonRows();
    if (rows[0].GoodCD !== undefined) {
      rows.forEach((val, index) => {
        if (value === true) {
          dataProvider2.setValue(index, 'StockYn', 'Y');
        } else dataProvider2.setValue(index, 'StockYn', 'N');
      });
    }
  };

  const fShowBalJoo = async () => {
    if (refCustCd.current === undefined || refCustCd.current === '') {
      setAlert({ visible: true, desc: '거래처를 먼저 선택하세요', type: 'W' });
      return;
    }
    Util.Common.fFieldChange(setBalJooButton, 'visible', true);
  };

  const fBalJooClose = () => {
    setBalJooButton({ visible: false });
    gridView2.setFocus();
  };

  const fReceivingRows = (rows) => {
    console.log('', rows);
    if (rows.selected.length > 0) {
      const data2NewRows = dataProvider2.getAllStateRows().created;
      if (data2NewRows.length < 1) {
        rows.selected.forEach((row) => {
          const data2Length = dataProvider2.getJsonRows().length;
          let newIndex = data2Length;
          gridView2.getDataSource().addRow([]);
          fBindBaljooRows(row, newIndex, rows.SchOrdergubun);
        });
      } else {
        dataProvider2.removeRows(data2NewRows);
        rows.selected.forEach((row) => {
          gridView2.getDataSource().addRow({});
          const data2Length = dataProvider2.getJsonRows().length;
          let newIndex = data2Length - 1;
          fBindBaljooRows(row, newIndex, rows.SchOrdergubun);
        });
      }
    }
    console.log('receiving', dataProvider2.getJsonRows());
  };

  const fBindBaljooRows = (row, newIndex, gubun) => {
    // if (Util.Common.fEmptyReturn(row.Goodcd)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { GoodCD: row.Goodcd });
    // if (Util.Common.fEmptyReturn(row.Goodno)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { GoodNo: row.Goodno });
    // if (Util.Common.fEmptyReturn(row.Spec)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Spec: row.Spec });
    // if (Util.Common.fEmptyReturn(row.Goodcdnm)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { GoodCdNm: row.Goodcdnm });
    // if (Util.Common.fEmptyReturn(row.Balqty)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Delvqty: row.Balqty });
    // if (Util.Common.fEmptyReturn(row.Su)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Su: row.Su });
    // if (Util.Common.fEmptyReturn(row.Miqty)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Qty: row.Miqty });
    // if (Util.Common.fEmptyReturn(row.Unitweight)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Unitweight: row.Unitweight });
    // if (Util.Common.fEmptyReturn(row.Weight)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Weight: row.Weight });
    // if (Util.Common.fEmptyReturn(row.Priceunit)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Priceunit: row.Priceunit });
    // if (Util.Common.fEmptyReturn(row.Priceunitnm)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Priceunitnm: row.Priceunitnm });
    // if (Util.Common.fEmptyReturn(row.Price)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Price: row.Price });
    // if (Util.Common.fEmptyReturn(row.Jukyocd)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { jukyocd: row.Jukyocd });
    // if (Util.Common.fEmptyReturn(row.Jukyonm)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { jukyonm: row.Jukyonm });
    // if (Util.Common.fEmptyReturn(row.Wrhnm)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { WhCdNm: row.Wrhnm });
    // if (Util.Common.fEmptyReturn(row.Wrhcd)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Whcd: row.Wrhcd });
    // if (Util.Common.fEmptyReturn(row.Stockyn)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { StockYn: row.Stockyn });
    // if (Util.Common.fEmptyReturn(row.Actno)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Actno: row.Actno });
    // if (Util.Common.fEmptyReturn(row.Actgoodcd)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Actgoodcd: row.Actgoodcd });
    // if (Util.Common.fEmptyReturn(row.Actgoodno)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Actgoodno: row.Actgoodno });
    // if (Util.Common.fEmptyReturn(row.Balno)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { BalNo: row.Balno });
    // if (Util.Common.fEmptyReturn(row.Balseq)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { BalSerl: row.Balseq });
    // if (Util.Common.fEmptyReturn(row.Inunit)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { UnitCD: row.Inunit });
    // if (Util.Common.fEmptyReturn(row.Bomchecksort)) Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, { Bomchecksort: row.Bomchecksort });
    if (gubun === 'M') {
      if (row.Priceunit === '220001' && row.Qtymi) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Weightmi,
          Weight: row.Weightmi,
          Qty: row.Qtymi,
        });
      }
      if (row.Priceunit === '220003' && row.Miqty) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Miqty,
          Qty: row.Miqty,
          Weight: row.Miqty,
        });
      }
    } else if (gubun === 'C') {
      if (row.Priceunit === '220001' && row.Unitweight !== 0) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Miqty * row.Unitweight,
          Weight: row.Miqty * row.Unitweight,
          Qty: row.Miqty,
        });
      }
      if (row.Priceunit === '220003' && row.Miqty) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Miqty,
          Weight: row.Miqty,
          Qty: row.Miqty,
        });
      }
    } else {
      if (row.Priceunit === '220001' && row.Unitweight !== 0) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Miqty * row.Unitweight,
          Weight: row.Miqty * row.Unitweight,
          Qty: row.Miqty,
        });
      } else if (row.Priceunit === '220003' && row.Qty) {
        Util.Grid.fSetMultiDataProvider(dataProvider2, newIndex, {
          Delvqty: row.Miqty,
          Weight: row.Miqty,
          Qty: row.Miqty,
        });
      } else {
        if (row.Balqty || row.Balqty === '') dataProvider2.setValue(newIndex, 'Delvqty', Util.Common.fTrim(row.Miqty));
        if (row.Miqty || row.Miqty === '') dataProvider2.setValue(newIndex, 'Qty', Util.Common.fTrim(row.Miqty));
        if (row.Miqty || row.Miqty === '') dataProvider2.setValue(newIndex, 'Weight', Util.Common.fTrim(row.Miqty));
      }
    }
    if (row.Goodcd || row.Goodcd === '') dataProvider2.setValue(newIndex, 'GoodCD', Util.Common.fTrim(row.Goodcd));
    if (row.Goodno || row.Goodno === '') dataProvider2.setValue(newIndex, 'GoodNo', Util.Common.fTrim(row.Goodno));
    if (row.Spec || row.Spec === '') dataProvider2.setValue(newIndex, 'Spec', Util.Common.fTrim(row.Spec));
    if (row.Goodcdnm || row.Goodcdnm === '') dataProvider2.setValue(newIndex, 'GoodCdNm', Util.Common.fTrim(row.Goodcdnm));
    if (row.Su || row.Su === '') dataProvider2.setValue(newIndex, 'Su', Util.Common.fTrim(row.Su));
    if (row.Unitweight || row.Unitweight === '') dataProvider2.setValue(newIndex, 'Unitweight', Util.Common.fTrim(row.Unitweight));
    if (row.Priceunit || row.Priceunit === '') dataProvider2.setValue(newIndex, 'Priceunit', Util.Common.fTrim(row.Priceunit));
    if (row.Priceunitnm || row.Priceunitnm === '') dataProvider2.setValue(newIndex, 'Priceunitnm', Util.Common.fTrim(row.Priceunitnm));
    if (row.Price || row.Price === '') dataProvider2.setValue(newIndex, 'Price', Util.Common.fTrim(row.Price));
    if (row.Jukyocd || row.Jukyocd === '') dataProvider2.setValue(newIndex, 'jukyocd', Util.Common.fTrim(row.Jukyocd));
    if (row.Jukyonm || row.Jukyonm === '') dataProvider2.setValue(newIndex, 'jukyonm', Util.Common.fTrim(row.Jukyonm));
    if (row.Wrhnm || row.Wrhnm === '') dataProvider2.setValue(newIndex, 'WhCdNm', Util.Common.fTrim(row.Wrhnm));
    if (row.Wrhcd || row.Wrhcd === '') dataProvider2.setValue(newIndex, 'Whcd', Util.Common.fTrim(row.Wrhcd));
    if (row.Stockyn || row.Stockyn === '') dataProvider2.setValue(newIndex, 'StockYn', Util.Common.fTrim(row.Stockyn));
    if (row.Actno || row.Actno === '') dataProvider2.setValue(newIndex, 'Actno', Util.Common.fTrim(row.Actno));
    if (row.Actgoodcd || row.Actgoodcd === '') dataProvider2.setValue(newIndex, 'Actgoodcd', Util.Common.fTrim(row.Actgoodcd));
    if (row.Actgoodno || row.Actgoodno === '') dataProvider2.setValue(newIndex, 'Actgoodno', Util.Common.fTrim(row.Actgoodno));
    if (row.Balno || row.Balno === '') dataProvider2.setValue(newIndex, 'BalNo', Util.Common.fTrim(row.Balno));
    if (row.Balseq || row.Balseq === '') dataProvider2.setValue(newIndex, 'BalSerl', Util.Common.fTrim(row.Balseq));
    if (row.Inunit || row.Inunit === '') dataProvider2.setValue(newIndex, 'UnitCD', Util.Common.fTrim(row.Inunit));
    if (row.Bomchecksort || row.Bomchecksort === '') dataProvider2.setValue(newIndex, 'Bomchecksort', Util.Common.fTrim(row.Bomchecksort));

    updateAmountOkamt(newIndex);
    UpdateheaderSum();
  };

  const fBalJooDetailClose = () => {
    // if (e.target === Util.Common.fMakeId('balJooDetailClose')) {
    //   setBalJooDetail({ visible: false });
    // }
    setBalJooDetail({ visible: false });
  };

  const fSearchPrice = async (dataRow) => {
    if (refCustCd.current === '' || refGoodcd.current === '' || refJukyocd.current === '') return;
    try {
      const result = await axios.get('/@api/purchase/purchaseStorage/searchPrice', {
        params: { SchAccunit: $UserStore.user.accunit, SchCustcd: refCustCd.current, SchGoodcd: refGoodcd.current, SchJukyocd: refJukyocd.current },
      });
      const priceResult = result.data;
      Util.Grid.fSetMultiDataProvider(dataProvider2, dataRow, { Price: priceResult.Price });
    } catch (e) {
      setAlert({ visible: true, desc: '단가 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fUpdatePrices = async () => {
    if (!dataProvider2) return;
    gridView2.commit();
    const rows = dataProvider2.getJsonRows();
    const smallRows = [];
    rows.forEach((row) => {
      const aRow = [];
      aRow.push(row.jukyocd);
      aRow.push(row.GoodCD);
      smallRows.push(aRow);
    });
    let smallRowsObj = { arr: smallRows };
    try {
      const result = await axios.get('/@api/purchase/purchaseStorage/updatePrices', {
        params: {
          items: smallRowsObj,
          SchAccunit: $UserStore.user.accunit,
          SchCustcd: refCustCd.current,
        },
      });
      if (!result.data) return;
      result.data.forEach((row, i) => {
        dataProvider2.setValue(i, 'Price', row.price);
        updateAmountOkamt(i);
      });
      UpdateheaderSum();
    } catch (e) {
      setAlert({ visible: true, desc: e.response });
    }
  };

  const fSearchType = (value, checked) => {
    if (checked) setSearchVO({ ...searchVO, SchWriting: value });
  };

  const fRdoDateTap = (e) => {
    const radioValue = searchVO.SchWriting;
    if (e.key === 'ArrowRight') {
      if (radioValue === 'Y') setSearchVO({ ...searchVO, SchWriting: 'N' });
      if (radioValue === 'N') setSearchVO({ ...searchVO, SchWriting: 'Y' });
    } else if (e.key === 'ArrowLeft') {
      if (radioValue === 'N') setSearchVO({ ...searchVO, SchWriting: 'Y' });
      if (radioValue === 'Y') setSearchVO({ ...searchVO, SchWriting: 'N' });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('SchFrDate')).focus();
    }
  };

  // --------------------- SIDE 끝 ------------------------------------------------------------- //
  // --------------------- CRUD 시작 ------------------------------------------------------------- //
  // 저장, 삭제 팝업 확인
  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });

    if (confirm.id === 'SAVE') {
      fSaveProc();
    } else if (confirm.id === 'DELETE') {
      fDeleteProc();
    } else if (confirm.id === 'DELETE_ITEM') {
      fItemDeleteProc();
      // .then(() => {
      //   UpdateheaderSum();
      //   fSaveProc().then(() => {
      //     fSearchDetail();
      //   });
      // });
    }
  };

  // 상세내역 조회
  const fSearchDetail = async () => {
    dataProvider2.clearRows();
    try {
      const result = await axios.get('/@api/purchase/purchaseStorage/selectByDetailList', {
        params: { SchDelvNo: refDelvNo.current, SchAccunit: $UserStore.user.accunit, SchFactory: $UserStore.user.factory, UserId: $UserStore.user.userid, SchExportYn: refExportYn.current },
      });
      const rdata = result.data;

      rdata.dList.forEach((items) => {
        for (const [key, value] of Object.entries(items)) {
          if (typeof items[key] === 'string') {
            items[key] = value.trim();
          }
        }
      });
      if (rdata.dList === undefined || rdata.dList.length < 1) {
        Util.Grid.fNewRow(dataProvider2, { No: '001' });
      } else {
        dataProvider2.setRows(rdata.dList);
        // gridView2.orderBy(['No']);
      }
      gridView2.clearCurrent();
    } catch (error) {
      setAlert({ visible: true, desc: '상세내역 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fSaveProc = async () => {
    const restVO = { ...headerVO };
    restVO.DelvDate = moment(headerVO.DelvDate).format('YYYYMMDD');
    restVO.Billdate = moment(headerVO.Billdate).format('YYYYMMDD');
    restVO.Gendate = moment(headerVO.Gendate).format('YYYYMMDD');
    restVO.TaxDate = moment(headerVO.TaxDate).format('YYYYMMDD');
    restVO.UserId = $UserStore.user.userid;
    if (restVO.Currdate === null || restVO.Currdate === 'Invalid Date' || restVO.Currdate === 'Invalid date' || restVO.Currdate === '') {
      restVO.Currdate = '';
    } else {
      restVO.Currdate = moment(headerVO.Currdate).format('YYYYMMDD');
    }
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    if (restVO.LNKCOD === null) {
      restVO.LNKCOD = '';
    }

    let paramDetail = [];
    const checkResult = Util.Grid.fCheckGridData(dataProvider2, paramDetail, validationGrid, '구매입고 상세');
    paramDetail = modifyGuid(paramDetail);

    if (checkResult !== undefined) {
      return;
    }

    try {
      const result = await axios.post('/@api/purchase/purchaseStorage/updateByList', {
        header: restVO,
        detail: paramDetail,
      });

      const rdata = result.data;
      if (rdata.errmess !== '') {
        setAlert({ visible: true, desc: rdata.errmess, type: 'E' });
        return;
      }

      const refDelvNo = rdata.DelvNo ? rdata.DelvNo.trim() : headerVO.DelvNo.trim();
      setAlert({ visible: true, desc: '문서 저장이 완료되었습니다.' });

      // setTimeout(() => {
      //   fSearch();
      //   setHeaderVO({
      //     ...headerVO,
      //     DelvNo: refDelvNo,
      //   });
      //   setTimeout(async () => {
      //     gridView1.orderBy(['DelvNo'], ['descending'], ['insensitive']);
      //     const sd = dataProvider1.searchData({ fields: ['DelvNo'], value: refDelvNo, partialMatch: true });
      //     if (sd != null) gridView1.setCurrent({ dataRow: sd.dataRow, column: 0 });
      //     await fSearchDetail();
      //   }, 500);
      // }, 700);
      if (refDelvNo) {
        fSearch().then(() => {
          Util.Common.fMultiFieldChange(setSearchVO, { SchType: '1', SchText: refDelvNo });
          Util.Common.fSearchMatch(
            gridView1,
            dataProvider1,
            searchVO.SchType,
            {
              0: 'DelvDate',
              1: 'DelvNo',
              2: 'CustCdNm',
              3: 'Truncnm',
            },
            refDelvNo,
          );
          Util.Common.fFieldChange(setHeaderVO, 'DelvNo', refDelvNo);
          // gridView1.orderBy(['DelvNo'], ['descending'], ['insensitive']);
        });
      }
    } catch (error) {
      setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다.${error}` });
    }
  };

  const fDeleteProc = async () => {
    const restVO = { ...headerVO };
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    restVO.DelvDate = moment(headerVO.DelvDate).format('YYYYMMDD');
    // if (await Util.Command.fDelete('/@api/purchase/purchaseStorage/deleteByList', restVO, '구매입고 문서')) {
    //   setTimeout(() => {
    //     fNew();
    //     fSearch();
    //   }, 100);
    // }
    // let jDeletedDatas = [];
    // const deleted = dataProvider2.getJsonRows();

    // deleted.forEach((row, itemIndex) => {
    //   const rowData = dataProvider2.getJsonRow(itemIndex);
    //   jDeletedDatas.push(rowData);
    // });

    try {
      let result = await axios.post('/@api/purchase/purchaseStorage/deleteByList', {
        data: restVO,
        // item: jDeletedDatas,
      });

      const data = result.data;

      if (data.errmess !== '') {
        setAlert({ visible: true, desc: data.errmess, type: 'E' });
        return;
      } else {
        await Util.Command.fDeleteFiles('delv', data.List);
        setAlert({ visible: true, desc: Util.Common.fEmptyReturn('구매입고 문서') + '가 삭제되었습니다.' });
      }
    } catch (error) {
      setAlert({ visible: true, desc: Util.Common.fEmptyReturn('구매입고 문서') + ' 삭제 중 오류가 발생하였습니다.', type: 'E' });
    }
    setTimeout(() => {
      fNew();
      fSearch();
    }, 100);
  };

  const fItemDeleteProc = async () => {
    const restVO = { ...headerVO };
    restVO.Accunit = $UserStore.user.accunit;
    restVO.Factory = $UserStore.user.factory;
    restVO.DelvDate = moment(headerVO.DelvDate).format('YYYYMMDD');

    await Util.Command.fDeleteCheckItem(gridView2, dataProvider2, '/@api/purchase/purchaseStorage/deleteByItem', restVO, '구매입고 상세내역');

    fSearch().then(() => {
      const sd = dataProvider1.searchData({ fields: ['DelvNo'], value: refDelvNo.current, partialMatch: true });
      if (sd != null) gridView1.setCurrent({ dataRow: sd.dataRow, column: 0 });
    });
    setTimeout(async () => {
      await fSearchDetail();
    }, 100);
  };

  const fAttachment = () => {
    if (Util.Common.fValidate(Util.Common.fEmptyReturn(refDelvNo.current) === '', '구매입고번호가 선택되지 않았습니다. \n확인해 주십시오.')) return;
    setAttachView(true);
  };

  const fAttachClose = () => {
    setAttachView(false);
  };
  // --------------------- CRUD 끝 ------------------------------------------------------------- //
  // --------------------- CommonButton 시작 ------------------------------------------------------------- //
  const fNew = async () => {
    fInit();
    fInitDataProvider();
    refApprovalTitle.current = '결재 · 미상신';
    setTimeout(() => {
      document.getElementById(Util.Common.fMakeId('DelvDate')).focus();
    }, 100);
  };

  const fSearch = async () => {
    gridView2.commit();
    if (Util.Common.fValidate(!moment(searchVO.SchFrDate, 'YYYY-MM-DD').isValid() || !moment(searchVO.SchToDate, 'YYYY-MM-DD').isValid(), '조회기간을 바르게 입력해 주세요.')) {
      return;
    }

    if (Util.Common.fValidate(searchVO.SchFrDate > searchVO.SchToDate, '조회기간을 확인해 주세요.')) {
      return;
    }
    const restVO = { ...searchVO };
    restVO.SchFrDate = moment(restVO.SchFrDate).format('YYYYMMDD');
    restVO.SchToDate = moment(restVO.SchToDate).format('YYYYMMDD');
    // restVO.SchWriting = restVO.SchWriting ? 'Y' : 'N';
    restVO.SchAccunit = $UserStore.user.accunit;
    restVO.SchFactory = $UserStore.user.factory;

    await Util.Command.fSearch(dataProvider1, '/@api/purchase/purchaseStorage/selectByList', restVO, '구매입고 목록');
    document.getElementById(Util.Common.fMakeId('SchText')).focus();
  };

  const fSave = () => {
    const rows = dataProvider2.getJsonRows();
    let qtySum = 0;
    let qtyWeight = 0;
    rows.forEach((val) => {
      qtySum += val.Qty;
      qtyWeight += val.Weight;
    });
    Util.Common.fMultiFieldChange(setHeaderVO, {
      Qty: qtySum,
      Totalweight: qtyWeight,
    });

    if (Util.Common.fValidate(!headerVO.Vatcd, '계산서구분이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.CustCd, '거래처명이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.DeptCD, '부서명이 제대로 입력되지 않았습니다')) return;
    if (Util.Common.fValidate(!headerVO.Pno, '사원명이 제대로 입력되지 않았습니다')) return;
    gridView2.commit();
    setConfirm({
      visible: true,
      desc: '저장하시겠습니까?',
      id: 'SAVE',
    });
  };

  const fDelete = async () => {
    if (Util.Common.fValidate(!headerVO.DelvNo, '구매입고 목록이 선택되지 않았습니다.')) {
      return;
    }

    gridView2.commit(true);

    if (gridFocus === 'H') {
      setConfirm({
        visible: true,
        desc: '주의) 구매입고 문서를 삭제 하시겠습니까?',
        id: 'DELETE',
      });
    } else if (gridFocus === 'D') {
      if (Util.Common.fValidate(gridView2.getCheckedItems(true).length < 1, '삭제할 입고내역을 선택하세요.')) {
        return;
      }

      setConfirm({
        visible: true,
        desc: '선택한 입고내역을 삭제 하시겠습니까?',
        id: 'DELETE_ITEM',
      });
    }
  };
  const fPrint1 = async () => {
    const restVO = { ...searchVO };
    restVO.SchFrDate = moment(restVO.SchFrDate).format('YYYYMMDD');
    restVO.SchToDate = moment(refPrintingDate1.current).format('YYYYMMDD');
    restVO.SchAccunit = $UserStore.user.accunit;
    restVO.SchFactory = $UserStore.user.factory;
    restVO.Gubun = 'D';

    setPrintList(false);
    setPrintTitle('일일구매현황(입고일자기준)');
    try {
      const result = await Util.Command.fSearchByReturn('/@api/purchase/purchaseStorage/selectByPrint1', restVO);
      for (const row of result) {
        if (row.Amount5.includes('\\')) {
          row.Amount5 = row.Amount5.replace('\\', '₩');
        }
      }
      if (!result) {
        setAlert({ visible: true, desc: '출력자료 조회 결과가 없습니다.' });
      } else {
        setPrintView(true);
        const rdata = '{ "DATA" : ' + JSON.stringify(result) + ' }';
        UtilReport.fReport(rdata, `/일일구매현황(입고일).mrd`, process.env.VITE_APP_RD_SERVER_URL, process.env.VITE_APP_RD_CLIENT_URL);
      }
    } catch (e) {
      setAlert({ visible: true, desc: '자료 조회중 오류가 발생하였습니다.', type: 'W' });
    }
  };

  const fPrint2 = async () => {
    const restVO = { ...searchVO };
    restVO.SchFrDate = moment(restVO.SchFrDate).format('YYYYMMDD');
    restVO.SchToDate = moment(refPrintingDate2.current).format('YYYYMMDD');
    restVO.SchAccunit = $UserStore.user.accunit;
    restVO.SchFactory = $UserStore.user.factory;
    restVO.Gubun = 'G';

    setPrintList(false);
    setPrintTitle('일일구매현황(작성일자기준)');
    try {
      const result = await Util.Command.fSearchByReturn('/@api/purchase/purchaseStorage/selectByPrint2', restVO);
      for (const row of result) {
        if (row.Amount5.includes('\\')) {
          row.Amount5 = row.Amount5.replace('\\', '₩');
        }
      }
      if (!result) {
        setAlert({ visible: true, desc: '출력자료 조회 결과가 없습니다.' });
      } else {
        setPrintView(true);
        const rdata = '{ "DATA" : ' + JSON.stringify(result) + ' }';
        UtilReport.fReport(rdata, `/일일구매현황(작성일).mrd`, process.env.VITE_APP_RD_SERVER_URL, process.env.VITE_APP_RD_CLIENT_URL);
      }
    } catch (e) {
      setAlert({ visible: true, desc: '자료 조회중 오류가 발생하였습니다.', type: 'W' });
    }
  };

  const fPrintList = () => {
    setPrintList(true);
  };
  // --------------------- CommonButton 끝 ------------------------------------------------------------- //

  // --------------------- useEffect 시작---------------------------------------------------------------//

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch, fSave, fDelete, fPrintList);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();
    fInitGrid1();
    fInitGrid2();

    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);

  return (
    <>
      <CommonButton pgmid={PGMID} onNew={fNew} onSearch={fSearch} onSave={fSave} onDelete={fDelete} onPrint={fPrintList} onAttachment={fAttachment} />
      <PerfectScrollbar className="mainCon">
        <Layout style={{ width: '100%', height: '100%' }}>
          <LayoutPanel region="west" split style={{ minWidth: 350, width: 500, maxWidth: 905, height: 775 }}>
            <PerfectScrollbar>
              <Box style={{ marginTop: 5, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>결재상태</Box>
                </Box>
                <Box
                  id={Util.Common.fMakeId('radioBox')}
                  onKeyDown={(e) => fRdoDateTap(e)}
                  className="inputCls"
                  style={{ display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, height: 25, width: 235.82, alignItems: 'center', marginLeft: 6 }}
                >
                  <Box style={{ marginLeft: 5 }}>
                    <RadioButton
                      style={{ width: 15, height: 15 }}
                      inputId={Util.Common.fMakeId('notcomplated')}
                      value="Y"
                      groupValue={searchVO.SchWriting}
                      onChange={(checked) => fSearchType('Y', checked)}
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
                      onChange={(checked) => fSearchType('N', checked)}
                      inputCls="inputCls"
                    />
                    <Label htmlFor={Util.Common.fMakeId('all')} style={{ marginLeft: 5, fontSize: 12 }}>
                      전체
                    </Label>
                  </Box>
                </Box>
              </Box>
              <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>기간</Box>
                </Box>
                <Box style={{ display: 'flex', alignItems: 'center', marginLeft: 7 }}>
                  <Box
                    onKeyDown={(e) => {
                      if (e.shiftKey && e.keyCode === 9) {
                        e.preventDefault();
                        document.getElementById(Util.Common.fMakeId('radioBox')).focus();
                      }
                    }}
                  >
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
                {/* <Box style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}> */}
                {/* <Box style={{ paddingLeft: 10, display: 'flex', alignItems: 'center' }}>
                    <CheckBox
                      inputId={Util.Common.fMakeId('SchWriting')}
                      checked={searchVO.SchWriting}
                      value={searchVO.SchWriting}
                      onChange={(value) => {
                        Util.Common.fFieldChange(setSearchVO, 'SchWriting', value);
                      }}
                      className={classes.SA3}
                    />
                    <Label htmlFor={Util.Common.fMakeId('SchWriting')} style={{ marginLeft: 5, width: '100%', fontSize: 12 }}>
                      작성중+반려문서만 조회
                    </Label>
                  </Box> */}
                {/* </Box> */}
              </Box>
              <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
                <CodeHelperPopup
                  title="입력자"
                  inputCls="inputCls"
                  pgmid={PGMID}
                  inputType="Pno"
                  id="schCrePnoNm"
                  helper={Util.CodeHelper.helperPnoNm}
                  ComponentCode={searchVO.SchPno}
                  ComponentValue={searchVO.SchPnoNm}
                  SetValue={fSetValue}
                  labelStyles={{ width: 70, height: 25, margin: '0px 3px 5px 3px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                  inputStyles={{ width: 235, margin: '0px 0px 5px 7px' }}
                />
              </Box>
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
              <Box style={{ marginTop: 2, marginLeft: 5, display: 'flex', alignItems: 'center' }}>
                <Box className={classes.SA1}>
                  <Box className={classes.SA2}>검색</Box>
                </Box>
                <ComboBox
                  inputCls="inputCls"
                  inputId={Util.Common.fMakeId('SchType')}
                  data={cboSchType}
                  value={searchVO.SchType}
                  editable={false}
                  onChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchType', value)}
                  onSelectionChange={(item) => {
                    Util.Common.fGridSort(gridView1, item.value, { 0: 'DelvDate', 1: 'DelvNo', 2: 'CustCdNm', 3: 'Truncnm' });
                  }}
                  panelStyle={{ height: 130 }}
                  className={classes.SA4}
                  style={{ marginLeft: 7 }}
                />
                <Box
                  onKeyDown={(e) => {
                    if (e.shiftKey && e.keyCode === 9) {
                      e.preventDefault();
                      document.getElementById(Util.Common.fMakeId('SchType')).focus();
                    } else if (e.key === 'Tab') {
                      e.preventDefault();
                      setTimeout(() => {
                        gridView1.setFocus();
                      }, 0);
                    }
                  }}
                >
                  <TextBox
                    inputCls="inputCls"
                    inputId={Util.Common.fMakeId('SchText')}
                    className={classes.SA5}
                    styleheaderRules={{ width: 135 }}
                    onChange={(value) => {
                      gridView1.commit();
                      Util.Common.fFieldChange(setSearchVO, 'SchText', value);
                      Util.Common.fSearchMatch(gridView1, dataProvider1, searchVO.SchType, { 0: 'DelvDate', 1: 'DelvNo', 2: 'CustCdNm', 3: 'Truncnm' }, value);
                    }}
                    value={searchVO.SchText}
                  />
                </Box>
              </Box>
              <Box ref={refGrid1} id={Util.Common.fMakeId('Grid1')} style={{ width: '100%', height: 596, marginTop: 5 }} />
            </PerfectScrollbar>
          </LayoutPanel>

          <LayoutPanel region="center" style={{ height: 775 }}>
            <Box style={{ display: 'flex' }}>
              <Form style={{ maxWidth: '100%', marginBottom: 1 }} model={headerVO} rules={headerRules}>
                <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
                  <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: 5, paddingRight: 15, paddingTop: 5 }}>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>공장명</Box>
                      <Box
                        onKeyDown={(e) => {
                          if (e.shiftKey && e.keyCode === 9) {
                            e.preventDefault();
                            gridView2.setFocus();
                          }
                        }}
                      >
                        <TextBox inputId={Util.Common.fMakeId('Factorynm')} inputCls="inputCls" name="Factorynm" value={$UserStore.user.factorynm} editable={false} className={classes.SC3} />
                      </Box>
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>입고번호</Box>
                      <TextBox
                        name="DelvNo"
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('DelvNo')}
                        value={headerVO.DelvNo}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'DelvNo', value)}
                        editable={false}
                        className={classes.SC3}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>입고일자</Box>
                        <FaStar style={{ color: '#ffa8a8' }} size={10} />
                      </Box>
                      <CommonDatePicker
                        inputId={Util.Common.fMakeId('DelvDate')}
                        inputCls="inputCls"
                        selected={headerVO.DelvDate}
                        disabled={refDelvNo.current ? true : false}
                        onHandleDateChange={(value) => {
                          Util.Common.fFieldChange(setHeaderVO, 'DelvDate', value);
                          Util.Common.fFieldChange(setHeaderVO, 'Currdate', value);
                        }}
                        style={{ width: 160 }}
                        inputRequired
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>작성일자</Box>
                        <FaStar style={{ color: '#ffa8a8' }} size={10} />
                      </Box>
                      <CommonDatePicker
                        inputId={Util.Common.fMakeId('Gendate')}
                        inputCls="inputCls"
                        selected={headerVO.Gendate}
                        // disabled={refDelvNo.current ? true : false}
                        onHandleDateChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'Gendate', value)}
                        style={{ width: 160 }}
                        inputRequired
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>내외자구분</Box>
                        <FaStar style={{ color: '#ffa8a8' }} size={10} />
                      </Box>
                      <ComboBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('ExportYn')}
                        data={ExportYnType}
                        value={headerVO.ExportYn}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'ExportYn', value)}
                        panelStyle={{ height: 100 }}
                        className={classes.SC3}
                        inputRequired
                      />
                    </Box>
                    <CodeHelperPopup
                      title="거래처명"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Cust"
                      id="CustCdNm"
                      helper={UtilCodeHelper.helperCust}
                      ComponentCode={headerVO.CustCd}
                      ComponentValue={headerVO.CustCdNm}
                      SetValue={fSetValue}
                      labelStyles={{ width: 90, height: 25, margin: '3px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                      inputRequired
                    />

                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>사업자번호</Box>
                      </Box>
                      <TextBox
                        name="Taxno"
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('Taxno')}
                        value={headerVO.Taxno}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'Taxno', value)}
                        editable
                        className={classes.SC3}
                      />
                    </Box>
                    <CodeHelperPopup
                      title="부서명"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Dept"
                      id="DeptCDNm"
                      helper={Util.CodeHelper.helperDeptNm}
                      ComponentCode={headerVO.DeptCD}
                      ComponentValue={headerVO.DeptCDNm}
                      SetValue={fSetValue}
                      labelStyles={{ width: 90, height: 25, margin: '3px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                      inputRequired
                    />
                    <CodeHelperPopup
                      title="사원명"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Pno"
                      id="PnoNm"
                      helper={Util.CodeHelper.helperPnoNm2}
                      ComponentCode={headerVO.Pno}
                      ComponentValue={headerVO.PnoNm}
                      SetValue={fSetValue}
                      labelStyles={{ width: 90, height: 25, margin: '3px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                      inputRequired
                    />
                    <CodeHelperPopup
                      title="화폐코드"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType=""
                      id="CurrCdNm"
                      helper={Util.CodeHelper.helperCurrNm}
                      ComponentCode={headerVO.CurrCd}
                      ComponentValue={headerVO.CurrCdNm}
                      SetValue={fSetValue}
                      labelStyles={{ width: 90, height: 25, margin: '3px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                    />

                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>환율적용기준일</Box>
                      </Box>
                      <CommonDatePicker
                        inputCls="inputCls"
                        selected={headerVO.Currdate}
                        inputId={Util.Common.fMakeId('Currdate')}
                        // disabled={refDelvNo.current ? true : false}
                        onHandleDateChange={(value) => {
                          Util.Common.fFieldChange(setHeaderVO, 'Currdate', value);
                          setTimeout(() => {
                            if (headerVO.CurrCd !== '057001') fGetExchange(headerVO.CurrCd, value);
                          }, 100);
                        }}
                        style={{ width: 160 }}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>결제환율</Box>
                      </Box>
                      <NumberBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('Exchang')}
                        name="Exchang"
                        value={headerVO.Exchang}
                        groupSeparator=","
                        precision={1}
                        spinners={false}
                        className={classes.SC3}
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </Box>
                  </Box>

                  <Box style={{ marginTop: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>공급가액</Box>
                      </Box>
                      <NumberBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('TotalPrice')}
                        name="TotalPrice"
                        value={headerVO.TotalPrice}
                        groupSeparator=","
                        // precision={1}
                        spinners={false}
                        editable={false}
                        className={classes.SC3}
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>부가세</Box>
                      </Box>
                      <NumberBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('TotalVat')}
                        name="TotalVat"
                        value={headerVO.TotalVat}
                        groupSeparator=","
                        // precision={1}
                        spinners={false}
                        editable={false}
                        className={classes.SC3}
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>입고총액</Box>
                      </Box>
                      <NumberBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('TotalAmount')}
                        name="TotalAmount"
                        value={headerVO.TotalAmount}
                        groupSeparator=","
                        // precision={1}
                        spinners={false}
                        editable={false}
                        className={classes.SC3}
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>외화총액</Box>
                      </Box>
                      <NumberBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('TotalForeign')}
                        name="TotalForeign"
                        value={headerVO.TotalForeign}
                        groupSeparator=","
                        // precision={1}
                        spinners={false}
                        editable={false}
                        className={classes.SC3}
                        inputStyle={{ textAlign: 'right' }}
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box style={{ fontSize: 10.8 }}>세금계산서일자</Box>
                        <FaStar style={{ color: '#ffa8a8' }} size={10} />
                      </Box>
                      <CommonDatePicker
                        inputCls="inputCls"
                        selected={headerVO.TaxDate}
                        inputId={Util.Common.fMakeId('TaxDate')}
                        // disabled={refDelvNo.current ? true : false}
                        onHandleDateChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'TaxDate', value)}
                        style={{ width: 160 }}
                        inputRequired
                      />
                    </Box>
                    <CodeHelperPopup
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="VatNm"
                      id="VatNm"
                      title="계산서구분"
                      helper={Util.CodeHelper.helperExpenseVatNm}
                      ComponentCode={headerVO.Vatcd}
                      ComponentValue={headerVO.VatNm}
                      SetValue={fSetValue}
                      labelStyles={{ width: 90, height: 25, margin: '0px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                      inputRequired
                    />
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>전표처리구분</Box>
                        <FaStar style={{ color: '#ffa8a8' }} size={10} />
                      </Box>
                      <ComboBox
                        inputCls="inputCls"
                        inputId={Util.Common.fMakeId('Sliptyp')}
                        data={Sliptype}
                        value={headerVO.Sliptyp}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'Sliptyp', value)}
                        panelStyle={{ height: 100 }}
                        className={classes.SC3}
                        inputRequired
                      />
                    </Box>
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>PJT</Box>
                      </Box>
                      <TextBox
                        inputCls="inputCls"
                        name="ProjectNo"
                        inputId={Util.Common.fMakeId('ProjectNo')}
                        value={headerVO.ProjectNo}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'ProjectNo', value)}
                        editable
                        className={classes.SC3}
                      />
                    </Box>
                    <CodeHelperPopup
                      title="발주처"
                      inputCls="inputCls"
                      pgmid={PGMID}
                      inputType="Cust"
                      id="ProjectCustNm"
                      helper={Util.CodeHelper.helperExpenseCust}
                      ComponentCode={headerVO.ProjectCustCd}
                      ComponentValue={headerVO.ProjectCustNm}
                      SetValue={fSetValue}
                      // InitValue={{ CompValue: '055004', CompName: '제품' }}
                      labelStyles={{ width: 90, height: 25, margin: '3px 10px 5px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
                      inputStyles={{ width: 200, margin: '0px 0px 5px 0px' }}
                    />
                    <Box style={{ marginTop: 3, display: 'flex', alignItems: 'center' }}>
                      <Box className={classes.SC1}>
                        <Box className={classes.SC2}>ActNo</Box>
                      </Box>
                      <TextBox
                        inputCls="inputCls"
                        name="ActNo"
                        inputId={Util.Common.fMakeId('ActNo')}
                        value={headerVO.ActNo}
                        onChange={(value) => Util.Common.fFieldChange(setHeaderVO, 'ActNo', value)}
                        // editable
                        className={classes.SC3}
                      />
                    </Box>
                    <Box
                      style={{ marginTop: 3, display: 'flex', margin: 'center' }}
                      onKeyDown={(e) => {
                        if (e.shiftKey && e.key === 'Tab') {
                          setTimeout(() => {
                            document.getElementById(Util.Common.fMakeId('ActNo')).focus();
                          }, 10);
                        } else if (e.key === 'Tab') {
                          setTimeout(() => {
                            refBalJoobutton.current.focus();
                          }, 100);
                        }
                      }}
                    >
                      <Box className={classes.SC1} style={{ alignItems: 'top' }}>
                        <Box className={classes.SC2}>비고</Box>
                      </Box>
                      <Box>
                        <TextBox
                          inputCls="inputCls"
                          name="Remark"
                          inputId={Util.Common.fMakeId('Remark')}
                          value={headerVO.Remark}
                          style={{ width: 320, height: 68 }}
                          multiline
                          placeholder="최대 50자"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Form>
            </Box>
            <Box style={{ height: 40, backgroundColor: '#fff3d3', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Box style={{ paddingLeft: 10, display: 'flex', alignItems: 'center' }}>
                <CheckBox
                  onChange={(value) => {
                    fCheckBox(value);
                  }}
                  className={classes.SA3}
                />
                <Label style={{ marginLeft: 5, width: '100%', fontSize: 12 }}>전체선택(재고)</Label>
              </Box>
              <Box
                style={{ marginLeft: 20 }}
                id={Util.Common.fMakeId('balJooButton')}
                onKeyDown={(e) => {
                  if (e.shiftKey && e.key === 'Tab') {
                    setTimeout(() => {
                      document.getElementById(Util.Common.fMakeId('Remark')).focus();
                    }, 10);
                  } else if (e.key === 'Tab') {
                    setTimeout(() => {
                      gridView2.setFocus();
                    }, 10);
                  }
                }}
              >
                <LinkButton ref={refBalJoobutton} style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} onClick={fShowBalJoo}>
                  <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AiOutlineFileSearch size={18} />
                    <Box style={{ marginLeft: 5, fontSize: 14, paddingBottom: 2, fontWeight: 500 }}>발주품번조회</Box>
                  </Box>
                </LinkButton>
              </Box>
            </Box>
            <Box
              onKeyDown={(e) => {
                if (e.shiftKey && e.key === 'Tab') {
                  setTimeout(() => {
                    refBalJoobutton.current.focus();
                  }, 10);
                } else if (e.key === 'Tab') {
                  document.getElementById(Util.Common.fMakeId('Factorynm')).focus();
                }
              }}
            >
              <Box ref={refGrid2} id={Util.Common.fMakeId('Grid2')} style={{ width: '100%', height: 306 }} />
            </Box>
          </LayoutPanel>
          <LayoutPanel region="east" title={refApprovalTitle.current} collapsible collapsed expander style={{ width: 400 }}>
            <Accordion animate style={{ border: 0 }}>
              <AccordionPanel style={{ width: '100%', height: 741 }}>
                <Box style={{ marginTop: 10 }}>
                  <Approval
                    PGMID={PGMID}
                    ApprovalType="A"
                    ApprovalDocNo={headerVO.DocNo}
                    ApprovalDocSource={headerVO.DocSource}
                    ApprovalDocFlag="A"
                    AttachmentsKeyName="구매입고번호"
                    MaxRevNo={0}
                    RevNo={0}
                    SetTitle={SetTitle}
                    isImageComponent
                    isAttachments
                    filepath="delv"
                  />
                </Box>
              </AccordionPanel>
            </Accordion>
          </LayoutPanel>
        </Layout>
      </PerfectScrollbar>
      {printList && (
        <Dialog
          title={
            <Box style={{ display: 'flex' }}>
              <img src={imgKsMark} alt="logo" style={{ width: '27px' }} /> <Box style={{ marginLeft: 15 }}>프린트 목록</Box>
            </Box>
          }
          style={{ width: '400px', height: '140px' }}
          bodyCls="f-column"
          closable
          modal
          onClose={() => setPrintList(false)}
        >
          <LinkButton id="1" style={{ width: 360, height: 32, color: '#424242', borderRadius: 3, marginLeft: 12, marginTop: 10 }} onClick={fPrint1}>
            <Box style={{ marginLeft: 15 }}>일일구매현황(입고일자기준)</Box>
          </LinkButton>
          <LinkButton id="1" style={{ width: 360, height: 32, color: '#424242', borderRadius: 3, marginLeft: 12, marginTop: 10 }} onClick={fPrint2}>
            <Box style={{ marginLeft: 15 }}>일일구매현황(작성일자기준)</Box>
          </LinkButton>
        </Dialog>
      )}

      {printView && (
        <Dialog
          title={
            <Box style={{ display: 'flex' }}>
              <img src={imgKsMark} alt="logo" style={{ width: '27px' }} /> <Box style={{ marginLeft: 15 }}>{printTitle}</Box>
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
        onConfirm={fCodeClaseConfirm}
        onCancel={() => fCodeClassConfirmCancel({ target: codeClassInputs.id })}
      />
      <PurchaseStorageBalSearch
        visible={balJooButton.visible}
        // onConfirm={fSelectBalJoo}
        onCancel={() => fBalJooClose()}
        custCd={refCustCd.current}
        sendRows={fReceivingRows}
      />
      <BaljooDetail visible={balJooDetail.visible} onClose={() => fBalJooDetailClose()} balNo={refBalNo.current} balSerl={refBalSerl.current} />
      {attachView && <Attachments PGMID={PGMID} FileTitle="구매입고번호" FileType={headerVO.DocSource} FileNo={headerVO.DocNo} FilePath="delv" setClose={fAttachClose} />}
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      <SearchGoods visible={searchGoods.visible} selectedData={searchGoods.selectedData} id={searchGoods.id} onConfirm={() => fSearchGoodsConfirm()} onClose={() => fClose()} pgmid={PGMID} />
    </>
  );
});

let dataProvider1, dataProvider2;
let gridView1, gridView2;

const Styles = createUseStyles(StylesMain);

export default PurchaseStorage;
