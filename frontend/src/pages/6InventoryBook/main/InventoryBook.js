import React, { useState, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { observer } from 'mobx-react-lite';
import useStores from '@stores/useStores';
import { RadioButton, TextBox, Label, CheckBox, Tabs, TabPanel } from 'rc-easyui';
import { Box } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import moment from 'moment';
import { Utility } from '@components/common/Utility/Utility';
import CommonButton from '@components/common/CommonButton';
import CommonDatePicker from '@components/common/CommonDatePicker';
import CodeHelperPopup from '@components/common/helper/CodeHelperPopup';
import Alert from '@components/common/Alert';
import Toast from '@pages/stock/inventoryBook/main/Toast';

import { StylesMain } from '../view/InventoryBookStyle';
import {
  GridColumns1_1,
  GridFields1_1,
  GridFields1_2,
  GridColumns1_2,
  GridFields2,
  GridColumns2,
  GridFields3,
  GridColumns3,
  GridFields4,
  GridColumns4,
  GridFields6,
  GridColumns6,
  GridFields8_1,
  GridColumns8_1,
  GridFields8_2,
  GridColumns8_2,
  GridFields10_1,
  GridColumns10_1,
  GridFields10_3,
  GridColumns10_3,
  GridFields10_4,
  GridColumns10_4,
  GridFields10_5,
  GridColumns10_5,
  GridFields10_6,
  GridColumns10_6,
  GridFields10_7,
  GridColumns10_7,
  GridFields11_3,
  GridColumns11_3,
} from '../view/InventoryBookGrid';
import InventoryBookHeaderList11 from '../view/InventoryBookHeaderList1_1';
import InventoryBookHeaderList12 from '../view/InventoryBookHeaderList1_2';
import InventoryBookHeaderList2 from '../view/InventoryBookHeaderList2';
import InventoryBookHeaderList3 from '../view/InventoryBookHeaderList3';
import InventoryBookHeaderList4 from '../view/InventoryBookHeaderList4';
import InventoryBookHeaderList6 from '../view/InventoryBookHeaderList6';
import InventoryBookHeaderList81 from '../view/InventoryBookHeaderList8_1';
import InventoryBookHeaderList82 from '../view/InventoryBookHeaderList8_2';
import InventoryBookHeaderList101 from '../view/InventoryBookHeaderList10_1';
import InventoryBookHeaderList102 from '../view/InventoryBookHeaderList10_2';
import InventoryBookHeaderList103 from '../view/InventoryBookHeaderList10_3';
import InventoryBookHeaderList104 from '../view/InventoryBookHeaderList10_4';
import InventoryBookHeaderList105 from '../view/InventoryBookHeaderList10_5';
import InventoryBookHeaderList106 from '../view/InventoryBookHeaderList10_6';
import InventoryBookHeaderList107 from '../view/InventoryBookHeaderList10_7';
import InventoryBookHeaderList113 from '../view/InventoryBookHeaderList11_3';
import * as Presenter from '../presenter/InventoryBookPresenter';
import InventoryBookState from '../view/InventoryBookState';

const InventoryBook = observer(() => {
  const PGMID = 'INVENTORYBOOK';
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();

  const { searchVO, setSearchVO, alert, setAlert, toast, setToast } = InventoryBookState();
  const Util = new Utility(PGMID, setAlert, true, true, true, true, true);

  const headerTabs = ['재고장', '구매발주내역(전체)', '외주발주내역(전체)', '생산입고대장(전체)', '발주/외주입고내역(전체)', '반제품입고내역(보고용)'];
  const detailTabs = ['수주동향', '출고동향', '작업지시서발행내역', '구매발주내역', '외주발주내역', '미결수주내역', '출고요청내역(상품, 제품, 반제품)'];
  const detailTabs2 = ['출고동향', '외주발주내역', '출고요청내역(원재료, 단조)'];
  const radioCategory = ['상품', '제품', '반제품', '원재료', '단조'];
  const radioBoxingYn = ['포장제외', '포장포함'];

  const [tabHeaderSelect, setTabHeaderSelect] = useState(0);
  const [tabSubHeaderSelect, setTabSubHeaderSelect] = useState(0);
  const refHeaderTab = useRef(null);
  const refSubHeaderTab = useRef(null);
  const refSubHeaderTab8 = useRef(null);
  const refDetailTab1 = useRef(null);
  const refHeaderIndex = useRef({ 상품: 0, 원재료: 0 });
  const refDetailIndex = useRef(0);
  const refSearchVO = useRef({});
  const refsubTabSelect = useRef(0);
  const refGoodcd = useRef(0);
  const refGoodcd2 = useRef(0);

  // 검색 관련 필터
  const refHelperSearchClass3 = useRef(Util.Common.fCreateHelper('A0004WEB', '061'));
  const refHelperSearchClass4 = useRef(Util.Common.fCreateHelper('A0004WEB', '062'));

  const fInit = async () => {
    Util.Common.fSetTabIndex();
    Presenter.fInit(setSearchVO, $UserStore);
    refSearchVO.current = {
      ReferenceDate: moment().format('YYYY-MM-DD'),
      NapDate: moment().format('YYYY-MM-DD'),
      BoxingYn: 0,
    };
    setTimeout(() => {
      Util.Common.fSetTabIndex();
      document.getElementById(Util.Common.fMakeId('ReferenceDate')).focus();
    });
  };

  const [MenuStore] = useState({
    Util: Util,
    User: $UserStore,
    fInit: fInit,
    setAlert: setAlert,
    setToast: setToast,
  });

  //--------------------------------------- Binding Start-------------------------------------------//
  const dataProviderBindHeader = (provider, no) => {
    if (no == '1_1') dataProvider1_1 = provider;
    else if (no == '1_2') dataProvider1_2 = provider;
    else if (no == '2') dataProvider2 = provider;
    else if (no == '3') dataProvider3 = provider;
    else if (no == '4') dataProvider4 = provider;
    else if (no == '6') dataProvider6 = provider;
    else if (no == '8_1') dataProvider8_1 = provider;
    else if (no == '8_2') dataProvider8_2 = provider;
    else if (no == '10_1') dataProvider10_1 = provider;
    else if (no == '10_2') dataProvider10_2 = provider;
    else if (no == '10_3') dataProvider10_3 = provider;
    else if (no == '10_4') dataProvider10_4 = provider;
    else if (no == '10_5') dataProvider10_5 = provider;
    else if (no == '10_6') dataProvider10_6 = provider;
    else if (no == '10_7') dataProvider10_7 = provider;
    else if (no == '11_3') dataProvider11_3 = provider;
  };

  const GridViewBindHeader = (view, no) => {
    if (no == '1_1') gridView1_1 = view;
    else if (no == '1_2') gridView1_2 = view;
    else if (no == '2') gridView2 = view;
    else if (no == '3') gridView3 = view;
    else if (no == '4') gridView4 = view;
    else if (no == '6') gridView6 = view;
    else if (no == '8_1') gridView8_1 = view;
    else if (no == '8_2') gridView8_2 = view;
    else if (no == '10_1') gridView10_1 = view;
    else if (no == '10_2') gridView10_2 = view;
    else if (no == '10_3') gridView10_3 = view;
    else if (no == '10_4') gridView10_4 = view;
    else if (no == '10_5') gridView10_5 = view;
    else if (no == '10_6') gridView10_6 = view;
    else if (no == '10_7') gridView10_7 = view;
    else if (no == '11_3') gridView11_3 = view;
  };

  // 재고장 - 상품, 제품, 반제품 HeaderListChanged
  const HeaderListChanged = (grid, index) => {
    const dataProviders = [dataProvider10_1, dataProvider10_2, dataProvider10_3];
    const views = [gridView10_1, gridView10_2, gridView10_3];
    refGoodcd.current = dataProvider1_1.getValue(index, 'GoodCd');
    // gridView10_1.commit(true);
    // 수주동향, 출고동향, 작업지시서발행내역
    if (refsubTabSelect.current === 0 || refsubTabSelect.current === 1 || refsubTabSelect.current === 2) {
      Presenter.fSearchDetail10(MenuStore, refSearchVO, dataProviders, views, refGoodcd.current);
      // 구매발주내역
    } else if (refsubTabSelect.current === 3) {
      Presenter.fSearchDetail104(MenuStore, refSearchVO, dataProvider10_4, refGoodcd.current);
      // 외주발주내역
    } else if (refsubTabSelect.current === 4) {
      Presenter.fSearchDetail105(MenuStore, refSearchVO, dataProvider10_5, refGoodcd.current);
      // 미결수주내역
    } else if (refsubTabSelect.current === 5) {
      Presenter.fSearchDetail106(MenuStore, refSearchVO, dataProvider10_6, refGoodcd.current);
      // 출고요청내역
    } else if (refsubTabSelect.current === 6) {
      Presenter.fSearchDetail107(MenuStore, refSearchVO, dataProvider10_7, refGoodcd.current);
    }
    setTimeout(() => {
      refHeaderIndex.current = { ...refHeaderIndex.current, 상품: index };
    }, 100);
  };

  // 재고장 - 원재료, 단조 HeaderListChanged
  const HeaderListChanged2 = (grid, index) => {
    const dataProviders2 = [dataProvider10_2, dataProvider10_5, dataProvider11_3];
    const views2 = [gridView10_2, gridView10_5, gridView11_3];
    refGoodcd2.current = dataProvider1_2.getValue(index, 'GoodCd');
    Presenter.fSearchDetail11(MenuStore, refSearchVO, dataProviders2, views2, refGoodcd2.current);
    setTimeout(() => {
      refHeaderIndex.current = { ...refHeaderIndex.current, 원재료: index };
    }, 100);
  };
  //--------------------------------------- Binding End-------------------------------------------//
  //--------------------------------------- Functions Start-------------------------------------------//

  const fSetValue = (id, value, name) => {
    if ($CommonStore.fGetBinding()) return;
    switch (id) {
      case 'Class2':
        Util.Common.fMultiFieldChange(setSearchVO, {
          Class2Nm: name,
          Class2: value,
          Class3Nm: '',
          Class3: '',
        });
        refHelperSearchClass3.current.iInCode2 = value;
        break;
      case 'Class3':
        Util.Common.fMultiFieldChange(setSearchVO, {
          Class3Nm: name,
          Class3: value,
          Class4Nm: '',
          Class4: '',
        });
        refHelperSearchClass4.current.iInCode2 = value;
        break;
      case 'Class4':
        Util.Common.fMultiFieldChange(setSearchVO, {
          Class4Nm: name,
          Class4: value,
        });
        break;
      case 'Class5':
        Util.Common.fMultiFieldChange(setSearchVO, {
          Class5Nm: name,
          Class5: value,
        });
        break;
      case 'CustCd':
        Util.Common.fMultiFieldChange(setSearchVO, {
          CustCdNm: name,
          CustCd: value,
        });
        break;
    }
  };

  // Header 탭 선택 함수
  const fTabSelect = (e) => {
    switch (e.props.title) {
      case '구매발주내역(전체)':
        setTabHeaderSelect(1);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('FrDate')).focus();
        }, 10);
        break;
      case '재고장':
        setTabHeaderSelect(0);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('ReferenceDate')).focus();
        }, 10);
        break;
      case '외주발주내역(전체)':
        setTabHeaderSelect(2);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('ReferenceDate')).focus();
        }, 10);
        break;
      case '생산입고대장(전체)':
        setTabHeaderSelect(3);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('FrDate')).focus();
        }, 10);
        break;
      case '발주/외주입고내역(전체)':
        setTabHeaderSelect(5);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('FrDate')).focus();
        }, 10);
        break;
      case '반제품입고내역(보고용)':
        setTabHeaderSelect(7);
        setTimeout(() => {
          Util.Common.fSetTabIndex();
          document.getElementById(Util.Common.fMakeId('FrDate')).focus();
        }, 10);
        break;
    }
  };

  // 재고장 - 상품,제품,반제품 - Detail 탭 선택 함수
  const fSubTabSelect = (e) => {
    switch (e.props.title) {
      case '수주동향':
        refsubTabSelect.current = 0;
        break;
      case '출고동향':
        refsubTabSelect.current = 1;
        break;
      case '작업지시서발행내역':
        refsubTabSelect.current = 2;
        break;
      case '구매발주내역':
        refsubTabSelect.current = 3;
        if (refGoodcd.current) Presenter.fSearchDetail104(MenuStore, refSearchVO, dataProvider10_4, refGoodcd.current);
        break;
      case '외주발주내역':
        refsubTabSelect.current = 4;
        if (refGoodcd.current) Presenter.fSearchDetail105(MenuStore, refSearchVO, dataProvider10_5, refGoodcd.current);
        break;
      case '미결수주내역':
        refsubTabSelect.current = 5;
        if (refGoodcd.current) Presenter.fSearchDetail106(MenuStore, refSearchVO, dataProvider10_6, refGoodcd.current);
        break;
      case '출고요청내역(상품, 제품, 반제품)':
        refsubTabSelect.current = 6;
        if (refGoodcd.current) Presenter.fSearchDetail107(MenuStore, refSearchVO, dataProvider10_7, refGoodcd.current);
        break;
    }
  };

  // 재고장 탭 선택 함수
  const fTabSubHeaderSelect = (e) => {
    if (e.props.title == '상품, 제품, 반제품') setTabSubHeaderSelect(0);
    else if (e.props.title == '원재료, 단조') setTabSubHeaderSelect(1);
  };

  // 라디오버튼, 체크박스 클릭 선택 함수
  const handleChkOnClick = (value, checked, name) => {
    if (checked && name == 'Category') setSearchVO({ ...searchVO, Category: value });
    else if (name == 'SaftyStock') setSearchVO({ ...searchVO, SaftyStock: value });
    else if (checked && name == 'BoxingYn') {
      setSearchVO({ ...searchVO, BoxingYn: value });
      refSearchVO.current.BoxingYn = value;
    } else if (checked && name == 'Clastype') setSearchVO({ ...searchVO, Clastype: value });
    else if (checked && name == 'Supply') setSearchVO({ ...searchVO, Supply: value });
  };

  //라디오버튼, 체크박스 KeyDown 함수
  const handleChkOnKeyDown = (e, category, arr) => {
    if (category === 'SaftyStock') {
      if (e.key === ' ') {
        setSearchVO({ ...searchVO, SaftyStock: !searchVO.SaftyStock });
      }
    } else {
      if (e.key === 'ArrowRight') {
        let nextIdx;
        const currentIdx = arr.indexOf(searchVO[`${category}`]);
        currentIdx === arr.length - 1 ? (nextIdx = 0) : (nextIdx = currentIdx + 1);
        setSearchVO({ ...searchVO, [`${category}`]: arr[nextIdx] });
      } else if (e.key === 'ArrowLeft') {
        let nextIdx;
        const currentIdx = arr.indexOf(searchVO[`${category}`]);
        currentIdx === 0 ? (nextIdx = arr.length - 1) : (nextIdx = currentIdx - 1);
        setSearchVO({ ...searchVO, [`${category}`]: arr[nextIdx] });
      }
    }
  };

  //--------------------------------------- Functions End-------------------------------------------//
  //--------------------------------------- CRUD Start-------------------------------------------//
  const fNew = async () => {
    Presenter.fInit(setSearchVO, $UserStore);
    setTimeout(() => {
      document.getElementById(Util.Common.fMakeId('ReferenceDate')).focus();
    }, 50);
  };

  // Header 탭 선택에 따른 Search 함수
  const fSearch = async () => {
    gridView1_1.commit();
    gridView1_2.commit();
    gridView2.commit();
    gridView3.commit();
    gridView4.commit();
    gridView6.commit();
    gridView8_1.commit();
    gridView8_2.commit();
    if (tabHeaderSelect === 0) {
      let title;
      const arr = ['0', '1', '2'];
      if (arr.includes(searchVO.Category)) {
        refSubHeaderTab.current.panels[0].state.selected = true;
        refSubHeaderTab.current.panels[1].state.selected = false;
        if (searchVO.Category === '0') title = '재고장 상품목록';
        else if (searchVO.Category === '1') title = '재고장 제품목록';
        else if (searchVO.Category === '2') title = '재고장 반제품 목록';

        await Presenter.fSearchProc0(MenuStore, searchVO, dataProvider1_1, title);
        gridView1_1.setFocus();
      } else {
        refSubHeaderTab.current.panels[0].state.selected = false;
        refSubHeaderTab.current.panels[1].state.selected = true;
        setTabSubHeaderSelect(1);
        if (searchVO.Category === '3') title = '재고장 원재료 목록';
        else if (searchVO.Category === '4') title = '재고장 단조목록';

        await Presenter.fSearchProc0_1(MenuStore, searchVO, dataProvider1_2, title);
        gridView1_2.setFocus();
      }
    } else if (tabHeaderSelect === 1) {
      await Presenter.fSearchProc1(MenuStore, searchVO, dataProvider2, '구매발주 전체 내역');
      gridView2.setFocus();
    } else if (tabHeaderSelect === 2) {
      await Presenter.fSearchProc2(MenuStore, searchVO, dataProvider3, '외주발주 전체 내역');
      gridView3.setFocus();
    } else if (tabHeaderSelect === 3) {
      await Presenter.fSearchProc3(MenuStore, searchVO, dataProvider4, gridView4, '생산입고 전체 대장');
      gridView4.setFocus();
    } else if (tabHeaderSelect === 5) {
      await Presenter.fSearchProc5(MenuStore, searchVO, dataProvider6, '발주/외주 전체 입고내역');
      gridView6.setFocus();
    } else if (tabHeaderSelect === 7) {
      await Presenter.fSearchProc7(MenuStore, searchVO, dataProvider8_1, dataProvider8_2, '반제품 입고내역');
      gridView8_1.setFocus();
    }
  };

  const fSave = async () => {};
  const fDelete = async () => {};
  const fPrint = async () => {};
  const fAttachment = async () => {};
  //--------------------------------------- CRUD End-------------------------------------------//

  // Header Grids
  const grids = [
    <Tabs ref={refSubHeaderTab} plain headerHeight={30} key={100} onTabSelect={fTabSubHeaderSelect}>
      <TabPanel key={10} title="상품, 제품, 반제품" selected>
        <InventoryBookHeaderList11
          Util={Util}
          id="Grid1_1"
          Height={300}
          currentIndex={refHeaderIndex}
          GridFields={GridFields1_1}
          GridColumns={GridColumns1_1}
          RowChanged={HeaderListChanged}
          DataProviderBinder={dataProviderBindHeader}
          GridViewBind={GridViewBindHeader}
          key={101}
        />
      </TabPanel>
      <TabPanel key={11} title="원재료, 단조">
        <InventoryBookHeaderList12
          Util={Util}
          id="Grid1_2"
          Height={300}
          currentIndex={refHeaderIndex}
          GridFields={GridFields1_2}
          GridColumns={GridColumns1_2}
          RowChanged={HeaderListChanged2}
          DataProviderBinder={dataProviderBindHeader}
          GridViewBind={GridViewBindHeader}
          key={102}
        />
      </TabPanel>
    </Tabs>,
    <InventoryBookHeaderList2
      title="구매발주내역(전체)"
      Util={Util}
      id="Grid2"
      Height={600}
      currentIndex={refHeaderIndex}
      GridFields={GridFields2}
      GridColumns={GridColumns2}
      RowChanged={HeaderListChanged}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={2}
    />,
    <InventoryBookHeaderList3
      title="외주발주내역(전체)"
      Util={Util}
      id="Grid3"
      Height={570}
      currentIndex={refHeaderIndex}
      GridFields={GridFields3}
      GridColumns={GridColumns3}
      RowChanged={HeaderListChanged}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={3}
    />,
    <InventoryBookHeaderList4
      title="생산입고대장(전체)"
      Util={Util}
      id="Grid4"
      Height={600}
      currentIndex={refHeaderIndex}
      GridFields={GridFields4}
      GridColumns={GridColumns4}
      RowChanged={HeaderListChanged}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={4}
    />,
    <InventoryBookHeaderList6
      title="발주/외주입고내역(전체)"
      Util={Util}
      id="Grid6"
      Height={600}
      currentIndex={refHeaderIndex}
      GridFields={GridFields6}
      GridColumns={GridColumns6}
      RowChanged={HeaderListChanged}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={6}
    />,
    <Tabs ref={refSubHeaderTab8} plain headerHeight={30} key={800}>
      <TabPanel key={81} title="품번별입고내역" selected>
        <InventoryBookHeaderList81
          Util={Util}
          id="Grid8_1"
          Height={570}
          currentIndex={refHeaderIndex}
          GridFields={GridFields8_1}
          GridColumns={GridColumns8_1}
          RowChanged={HeaderListChanged}
          DataProviderBinder={dataProviderBindHeader}
          GridViewBind={GridViewBindHeader}
          key={81}
        />
      </TabPanel>
      <TabPanel key={82} title="기간별집계자료">
        <InventoryBookHeaderList82
          Util={Util}
          id="Grid8_2"
          Height={570}
          currentIndex={refHeaderIndex}
          GridFields={GridFields8_2}
          GridColumns={GridColumns8_2}
          RowChanged={HeaderListChanged}
          DataProviderBinder={dataProviderBindHeader}
          GridViewBind={GridViewBindHeader}
          key={82}
        />
      </TabPanel>
    </Tabs>,
  ];

  // 재고장 - 상품, 제품, 반제품 - Detail Grids
  const detailGrids = [
    <InventoryBookHeaderList101
      title="상품제품반제품_수주동향"
      Util={Util}
      id="Grid10_1"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_1}
      GridColumns={GridColumns10_1}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={201}
    />,
    <InventoryBookHeaderList102
      title="상품제품반제품_출고동향"
      Util={Util}
      id="Grid10_2"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_1}
      GridColumns={GridColumns10_1}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={202}
    />,
    <InventoryBookHeaderList103
      title="상품제품반제품_작업지시서발행내역"
      Util={Util}
      id="Grid10_3"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_3}
      GridColumns={GridColumns10_3}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
    <InventoryBookHeaderList104
      title="상품제품반제품_구매발주내역"
      Util={Util}
      id="Grid10_4"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_4}
      GridColumns={GridColumns10_4}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
    <InventoryBookHeaderList105
      title="상품제품반제품_외주발주내역"
      Util={Util}
      id="Grid10_5"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_5}
      GridColumns={GridColumns10_5}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
    <InventoryBookHeaderList106
      title="상품제품반제품_미결수주내역"
      Util={Util}
      id="Grid10_6"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_6}
      GridColumns={GridColumns10_6}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
    <InventoryBookHeaderList107
      title="상품제품반제품_출고요청내역"
      Util={Util}
      id="Grid10_7"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_7}
      GridColumns={GridColumns10_7}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
  ];

  // 재고장 - 원재료, 단조 - Detail Grids
  const detailGrids2 = [
    <InventoryBookHeaderList102
      title="원재료단조_출고동향"
      Util={Util}
      id="Grid20_1"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_1}
      GridColumns={GridColumns10_1}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={202}
    />,
    <InventoryBookHeaderList105
      title="원재료단조_외주발주내역"
      Util={Util}
      id="Grid20_2"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields10_5}
      GridColumns={GridColumns10_5}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
    <InventoryBookHeaderList113
      title="원재료단조_출고요청내역"
      Util={Util}
      id="Grid20_3"
      Height={244}
      currentIndex={refDetailIndex}
      GridFields={GridFields11_3}
      GridColumns={GridColumns11_3}
      DataProviderBinder={dataProviderBindHeader}
      GridViewBind={GridViewBindHeader}
      key={203}
    />,
  ];

  const fStyleLabel = (i, Category) => {
    let result = {
      transition: 'font-size 0.3s ease',
    };
    if (Category !== 'SaftyStock') {
      if (i === searchVO[`${Category}`]) {
        result.color = 'blue';
        result.fontSize = '14px';
      } else {
        result.fontSize = '12px';
      }
    } else {
      if (searchVO.SaftyStock) {
        result.color = 'blue';
        result.fontSize = '14px';
      }
    }
    return result;
  };

  useEffect(() => {
    Util.Common.fHotKey($CommonStore, $CommonStore.isPopup, fNew, fSearch, fSave, fDelete, fPrint);
  }, [$CommonStore.HotKey]);

  useEffect(() => {
    fInit();
    return () => {
      $CommonStore.fSetHotKey();
    };
  }, []);
  return (
    <>
      <CommonButton pgmid={PGMID} visible="010000" onNew={fNew} onSearch={fSearch} onSave={fSave} onDelete={fDelete} onPrint={fPrint} onAttachment={fAttachment} />
      <PerfectScrollbar className="mainCon">
        <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ padding: 1, border: '1px solid #e2e2e2', borderRadius: 5 }}>
          {(tabHeaderSelect === 0 || tabHeaderSelect === 2) && (
            <ReferenceDate searchVO={searchVO} setSearchVO={setSearchVO} classes={classes} Util={Util} refSearchVO={refSearchVO} key="ReferenceDatehd1" />
          )}
          {(tabHeaderSelect === 1 || tabHeaderSelect === 2 || tabHeaderSelect === 3 || tabHeaderSelect === 5 || tabHeaderSelect === 7) && (
            <FrDate
              searchVO={searchVO}
              setSearchVO={setSearchVO}
              classes={classes}
              Util={Util}
              handleChkOnClick={handleChkOnClick}
              PGMID={PGMID}
              fSetValue={fSetValue}
              handleChkOnKeyDown={handleChkOnKeyDown}
              tabHeaderSelect={tabHeaderSelect}
              fStyleLabel={fStyleLabel}
              key="frDate1"
            />
          )}

          <Box style={{ display: 'flex', alignItems: 'center ' }}>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>공장명</Box>
              <TextBox inputId={Util.Common.fMakeId('Factorynm')} inputCls="inputCls" name="Factorynm" value={$UserStore.user.factorynm} editable={false} className={classes.SC3} />
            </Box>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>구분</Box>
            </Box>
            <Box
              id={Util.Common.fMakeId('radioBox')}
              className="inputCls"
              style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
              onKeyDown={(e) => {
                const arr = ['0', '1', '2', '3', '4'];
                handleChkOnKeyDown(e, 'Category', arr);
              }}
            >
              {radioCategory.map((radio, i) => (
                <React.Fragment key={`inventoryBookCaterogy${i}`}>
                  <RadioButton
                    className={classes.Radio}
                    inputId={Util.Common.fMakeId(`radioCategory${i}`)}
                    inputCls="inputCls"
                    value={String(i)}
                    groupValue={searchVO.Category}
                    onChange={(checked) => handleChkOnClick(String(i), checked, 'Category')}
                    style={{ marginLeft: 5 }}
                  />
                  <Label htmlFor={Util.Common.fMakeId(`radioCategory${i}`)} className={classes.RadioLabel} style={fStyleLabel(String(i), 'Category')}>
                    {radio}
                  </Label>
                </React.Fragment>
              ))}
            </Box>
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>구분</Box>
            </Box>
            <Box
              id={Util.Common.fMakeId('checkBox')}
              className="inputCls"
              style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
              onKeyDown={(e) => handleChkOnKeyDown(e, 'SaftyStock')}
            >
              <CheckBox
                inputCls="inputCls"
                inputId={Util.Common.fMakeId('SaftyStock')}
                checked={searchVO.SaftyStock}
                value={searchVO.SaftyStock}
                style={{ marginLeft: 5 }}
                onChange={(value) => handleChkOnClick(value, '', 'SaftyStock')}
                className={classes.Radio}
              />
              <Label htmlFor={Util.Common.fMakeId('SaftyStock')} className={classes.RadioLabel} style={{ ...fStyleLabel('', 'SaftyStock'), width: 60 }}>
                안전재고
              </Label>
            </Box>
            <Box className={classes.SC4}>
              <Box className={classes.SC1} style={{ width: 80 }}>
                미결포장여부
              </Box>
            </Box>
            <Box
              id={Util.Common.fMakeId('BoxingYn')}
              className="inputCls"
              style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
              onKeyDown={(e) => {
                const arr = [0, 1];
                handleChkOnKeyDown(e, 'BoxingYn', arr);
              }}
            >
              {radioBoxingYn.map((radio, i) => (
                <React.Fragment key={`inventoryBookBoxingYn${i}`}>
                  <RadioButton
                    className={classes.Radio}
                    inputId={Util.Common.fMakeId(`radioBoxingYn${i}`)}
                    inputCls="inputCls"
                    value={i}
                    groupValue={searchVO.BoxingYn}
                    onChange={(checked) => handleChkOnClick(i, checked, 'BoxingYn')}
                    style={{ marginLeft: 5 }}
                  />
                  <Label htmlFor={Util.Common.fMakeId(`radioBoxingYn${i}`)} className={classes.RadioLabel} style={{ ...fStyleLabel(i, 'BoxingYn'), width: 60 }}>
                    {radio}
                  </Label>
                </React.Fragment>
              ))}
            </Box>
          </Box>

          <Box style={{ display: 'flex', alignItems: 'center ' }}>
            <CodeHelperPopup
              inputCls="inputCls"
              pgmid={PGMID}
              inputType=""
              id="Class2"
              title="대분류"
              helper={Util.CodeHelper.helperClass2}
              ComponentCode={searchVO.Class2}
              ComponentValue={searchVO.Class2Nm}
              SetValue={fSetValue}
              labelStyles={{ width: 60, height: 25, margin: '1px 10px 4px 10px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 150, height: 25, margin: '1px 10px 4px 0px' }}
            />
            <CodeHelperPopup
              inputCls="inputCls"
              pgmid={PGMID}
              inputType=""
              id="Class3"
              title="중분류"
              helper={refHelperSearchClass3.current}
              ComponentCode={searchVO.Class3}
              ComponentValue={searchVO.Class3Nm}
              SetValue={fSetValue}
              labelStyles={{ width: 60, height: 25, margin: '1px 10px 4px 0px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 140, height: 25, margin: '1px 10px 4px 0px' }}
            />
            <CodeHelperPopup
              inputCls="inputCls"
              pgmid={PGMID}
              inputType=""
              id="Class4"
              title="소분류"
              helper={refHelperSearchClass4.current}
              ComponentCode={searchVO.Class4}
              ComponentValue={searchVO.Class4Nm}
              SetValue={fSetValue}
              labelStyles={{ width: 60, height: 25, margin: '1px 10px 4px 0px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 141, height: 25, margin: '1px 10px 4px 0px' }}
            />
            <CodeHelperPopup
              inputCls="inputCls"
              pgmid={PGMID}
              inputType=""
              id="Class5"
              title="재질"
              helper={Util.CodeHelper.helperClass5}
              ComponentCode={searchVO.Class5}
              ComponentValue={searchVO.Class5Nm}
              SetValue={fSetValue}
              labelStyles={{ width: 60, height: 25, margin: '1px 10px 4px 0px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
              inputStyles={{ width: 150, height: 25, margin: '1px 10px 4px 0px' }}
            />
          </Box>

          <Box
            style={{ display: 'flex', alignItems: 'center' }}
            onKeyDown={(e) => {
              if (e.shiftKey && e.keyCode === 9) {
                e.preventDefault();
                document.getElementById(Util.Common.fMakeId('Class5')).focus();
              } else if (e.key === 'Tab' && (tabHeaderSelect === 0 || tabHeaderSelect === 2)) {
                e.preventDefault();
                document.getElementById(Util.Common.fMakeId('ReferenceDate')).focus();
              } else if (e.key === 'Tab' && (tabHeaderSelect === 1 || tabHeaderSelect === 3 || tabHeaderSelect === 5 || tabHeaderSelect === 7)) {
                e.preventDefault();
                document.getElementById(Util.Common.fMakeId('FrDate')).focus();
              }
            }}
          >
            <Box className={classes.SC4}>
              <Box className={classes.SC1}>품목명</Box>
            </Box>
            <TextBox
              inputId={Util.Common.fMakeId('GoodNo')}
              inputCls="inputCls"
              name="GoodNo"
              value={searchVO.GoodNo}
              className={classes.SC3}
              style={{ width: 220 }}
              onChange={(value) => Util.Common.fFieldChange(setSearchVO, 'GoodNo', value.toUpperCase())}
            />
          </Box>
        </Box>

        <Tabs ref={refHeaderTab} onTabSelect={fTabSelect} id="tabMaster" headerHeight={30} style={{ marginTop: 5 }}>
          {headerTabs.map((tab, i) => {
            return (
              <TabPanel key={200 + i} title={tab}>
                {grids[i]}
              </TabPanel>
            );
          })}
        </Tabs>

        {tabHeaderSelect === 0 && tabSubHeaderSelect === 0 && (
          <Tabs ref={refDetailTab1} onTabSelect={fSubTabSelect} headerHeight={30} id="subTab" style={{ height: 275 }}>
            {detailTabs.map((tab, i) => {
              return (
                <TabPanel key={1000 + i} title={tab}>
                  {detailGrids[i]}
                </TabPanel>
              );
            })}
          </Tabs>
        )}
        {tabHeaderSelect === 0 && tabSubHeaderSelect === 1 && (
          <Tabs ref={refDetailTab1} onTabSelect={fSubTabSelect} headerHeight={30} id="subTab" style={{ height: 275 }}>
            {detailTabs2.map((tab, i) => {
              return (
                <TabPanel key={2000 + i} title={tab}>
                  {detailGrids2[i]}
                </TabPanel>
              );
            })}
          </Tabs>
        )}
      </PerfectScrollbar>
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Toast visible={toast.visible} description={toast.desc} type={toast.type} onConfirm={() => setToast({ visible: false })} duration={toast.duration} />
    </>
  );
});

let gridView1_1,
  gridView1_2,
  gridView2,
  gridView3,
  gridView4,
  gridView6,
  gridView8_1,
  gridView8_2,
  gridView10_1,
  gridView10_2,
  gridView10_3,
  gridView10_4,
  gridView10_5,
  gridView10_6,
  gridView10_7,
  gridView11_3;
let dataProvider1_1,
  dataProvider1_2,
  dataProvider2,
  dataProvider3,
  dataProvider4,
  dataProvider6,
  dataProvider8_1,
  dataProvider8_2,
  dataProvider10_1,
  dataProvider10_2,
  dataProvider10_3,
  dataProvider10_4,
  dataProvider10_5,
  dataProvider10_6,
  dataProvider10_7,
  dataProvider11_3;

const Styles = createUseStyles(StylesMain);
export default InventoryBook;

// 기준일, 납기일 Component
function ReferenceDate({ searchVO, setSearchVO, classes, Util, refSearchVO }) {
  return (
    <Box style={{ display: 'flex', alignItems: 'center ' }}>
      <Box
        className={classes.SC4}
        onKeyDown={(e) => {
          if (e.shiftKey && e.keyCode === 9) {
            e.preventDefault();
            document.getElementById(Util.Common.fMakeId('GoodNo')).focus();
          }
        }}
      >
        <Box className={classes.SC1}>기준일자</Box>
        <CommonDatePicker
          inputCls="inputCls"
          selected={searchVO.ReferenceDate}
          inputId={Util.Common.fMakeId('ReferenceDate')}
          onHandleDateChange={(value) => {
            Util.Common.fFieldChange(setSearchVO, 'ReferenceDate', value);
            refSearchVO.current.ReferenceDate = value;
          }}
          style={{ width: 110 }}
        />
      </Box>
      <Box className={classes.SC4}>
        <Box className={classes.SC1}>납기일자</Box>
        <CommonDatePicker
          inputCls="inputCls"
          selected={searchVO.NapDate}
          inputId={Util.Common.fMakeId('NapDate')}
          onHandleDateChange={(value) => {
            Util.Common.fFieldChange(setSearchVO, 'NapDate', value);
            refSearchVO.current.NapDate = value;
          }}
          style={{ width: 110 }}
        />
      </Box>
    </Box>
  );
}

// 기간, 거래처, 마감구분, 외주/발주 Component
function FrDate({ searchVO, setSearchVO, classes, Util, handleChkOnClick, PGMID, fSetValue, handleChkOnKeyDown, tabHeaderSelect, fStyleLabel }) {
  const radioClstype = ['전체', '미결', '완료', '보류'];
  const radioSupply = ['외주', '발주'];
  return (
    <Box style={{ display: 'flex', alignItems: 'center ' }}>
      <Box className={classes.SC4}>
        <Box className={classes.SC1}>기간</Box>
        <Box
          onKeyDown={(e) => {
            if (e.shiftKey && e.keyCode === 9 && tabHeaderSelect !== 2) {
              e.preventDefault();
              document.getElementById(Util.Common.fMakeId('GoodNo')).focus();
            } else if (e.shiftKey && e.keyCode === 9 && tabHeaderSelect === 2) {
              e.preventDefault();
              document.getElementById(Util.Common.fMakeId('NapDate')).focus();
            }
          }}
        >
          <CommonDatePicker
            inputCls="inputCls"
            selected={searchVO.FrDate}
            inputId={Util.Common.fMakeId('FrDate')}
            onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'FrDate', value)}
            style={{ width: 110 }}
          />
        </Box>
        <Box style={{ margin: '0 5px', fontWeight: 500, fontSize: 20 }}>~</Box>
        <CommonDatePicker
          inputCls="inputCls"
          selected={searchVO.ToDate}
          inputId={Util.Common.fMakeId('ToDate')}
          onHandleDateChange={(value) => Util.Common.fFieldChange(setSearchVO, 'ToDate', value)}
          style={{ width: 110 }}
        />
      </Box>
      <CodeHelperPopup
        title="거래처"
        inputCls="inputCls"
        pgmid={PGMID}
        inputType="Cust"
        id="CustCd"
        helper={Util.CodeHelper.helperCust}
        ComponentCode={searchVO.CustCd}
        ComponentValue={searchVO.CustCdNm}
        SetValue={fSetValue}
        labelStyles={{ width: 60, height: 25, margin: '1px 10px 4px 15px', padding: 5, fontSize: 12, display: 'flex', alignItems: 'center', fontWeight: 600 }}
        inputStyles={{ width: 185, margin: '1px 0px 4px 0px' }}
      />
      <Box className={classes.SC4}>
        <Box className={classes.SC1}>마감구분</Box>
      </Box>
      <Box
        id={Util.Common.fMakeId('Clastype')}
        className="inputCls"
        style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
        onKeyDown={(e) => {
          const arr = ['0', '1', '2', '3'];
          handleChkOnKeyDown(e, 'Clastype', arr);
        }}
      >
        {radioClstype.map((radio, i) => (
          <React.Fragment key={`inventoryBookClstype${i}`}>
            <RadioButton
              className={classes.Radio}
              inputId={Util.Common.fMakeId(`inventoryBookClstype${i}`)}
              value={String(i)}
              groupValue={searchVO.Clastype}
              onChange={(checked) => handleChkOnClick(String(i), checked, 'Clastype')}
              style={{ marginLeft: 5 }}
              key={`inventoryBookClstype${i}`}
            />
            <Label htmlFor={Util.Common.fMakeId(`inventoryBookClstype${i}`)} className={classes.RadioLabel} key={`inventoryBookClstypeL${i}`} style={fStyleLabel(String(i), 'Clastype')}>
              {radio}
            </Label>
          </React.Fragment>
        ))}
      </Box>
      <Box className={classes.SC4}>
        <Box className={classes.SC1}>외주/발주</Box>
      </Box>
      <Box
        id={Util.Common.fMakeId('Supply')}
        className="inputCls"
        style={{ height: 27, display: 'flex', flexDirection: 'row', border: '1px solid #9ac9ed', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
        onKeyDown={(e) => {
          const arr = ['0', '1'];
          handleChkOnKeyDown(e, 'Supply', arr);
        }}
      >
        {radioSupply.map((radio, i) => (
          <React.Fragment key={`inventoryBookSupply${i}`}>
            <RadioButton
              className={classes.Radio}
              inputId={Util.Common.fMakeId(`inventoryBookSupply${i}`)}
              value={String(i)}
              groupValue={searchVO.Supply}
              onChange={(checked) => handleChkOnClick(String(i), checked, 'Supply')}
              style={{ marginLeft: 5 }}
            />
            <Label htmlFor={Util.Common.fMakeId(`inventoryBookSupply${i}`)} className={classes.RadioLabel} key={`inventoryBookClstypeL${i}`} style={fStyleLabel(String(i), 'Supply')}>
              {radio}
            </Label>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
