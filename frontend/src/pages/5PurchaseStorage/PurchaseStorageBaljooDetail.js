import React, { useState, useEffect, useRef } from 'react';
import { LinkButton, Dialog, TextBox, ComboBox } from 'rc-easyui';
import { Box } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import { Utility } from '@components/common/Utility/Utility';
import { ValueType, GridView, LocalDataProvider } from 'realgrid';
import Alert from '@components/common/Alert';

export const BaljooDetail = ({ visible, onClose, balNo, balSerl }) => {
  const PGMID = 'PURCHASESTORAGE_';
  const classes = Styles();

  const refGrid1 = useRef(null);
  const refTextValue = useRef(null);
  const [next, setNext] = useState(1);

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);
  const [cboSchtype] = useState([
    { value: '0', text: '제품품번[ACTGOODNO]' },
    { value: '1', text: '제품품명[ACTGOODNM]' },
    { value: '2', text: '제품규격[ACTGOODSPEC]' },
    { value: '3', text: '반제품품번[HALFGOODNO]' },
    { value: '4', text: '반제품품명[HALPGOODNM]' },
    { value: '5', text: '반제품규격[HELFGOODSPEC]' },
    { value: '6', text: '발주수량[ORDERSU]' },
    { value: '7', text: '입고수량[DELVQTY]' },
  ]);
  const [searchVO, setSearchVO] = useState({
    SchType: '1',
    balNo: '',
    balSerl: '',
  });
  const fInit = () => {
    Util.Common.fSetTabIndex();
    setNext(0);
  };
  const fInitGrid1 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid01'));
    dataProvider1 = new LocalDataProvider(false);
    gridView1 = new GridView(refGrid1.current);
    Util.Grid.fInitGridHeader(gridView1, dataProvider1, GridFields1, GridColumns1, 30, fOnCurrentRowChanged1);
    gridView1.setRowIndicator({ visible: false });
  };
  const fOnCurrentRowChanged1 = async () => {};

  const fSearch = async () => {
    const restVO = { ...searchVO };
    restVO.balNo = balNo;
    restVO.balSerl = balSerl;

    await Util.Command.fSearch(dataProvider1, '/@api/purchase/purchaseStorage/searchBalJooDetail', restVO, '발주내역조회');
  };

  const fClose = () => {
    onClose();
  };

  const fNext = () => {
    const getCurr = gridView1.getCurrent().itemIndex;
    if (getCurr < 0) return;

    const rows = dataProvider1.getJsonRows();
    let all = [];
    let indexes = [];
    let searchType = searchVO.SchType;
    if (searchType === '0') {
      searchType = 'ActGoodno';
    } else if (searchType === '1') {
      searchType = 'ActGoodnm';
    } else if (searchType === '2') {
      searchType = 'Actgoodspec';
    } else if (searchType === '3') {
      searchType = 'HalfGoodno';
    } else if (searchType === '4') {
      searchType = 'HalfGoodnm';
    } else if (searchType === '5') {
      searchType = 'HalfGoodSpec';
    } else if (searchType === '6') {
      searchType = 'OrderSu';
    } else searchType = 'DelvQty';

    rows.forEach((row, index) => {
      all.push(
        gridView1.getValue(index, searchType).toUpperCase(),
        // .split(/[^A-Za-z]/),
      );
    });
    // let reAll = all.filter((e) => e.includes(refTextValue.current));
    all.forEach((row, i) => {
      row.includes(refTextValue.current.toUpperCase()) ? indexes.push(i) : indexes;
    });
    console.log('indexes', indexes);
    gridView1.setCurrent({ itemIndex: indexes[next], fieldName: 1 });
    setNext((prevNum) => prevNum + 1);
    console.log('next', next);
    console.log('indexes.length', indexes.length);
    if (next === indexes.length - 1) setNext(next);
  };

  const fPrev = () => {
    const getCurr = gridView1.getCurrent().itemIndex;
    if (getCurr < 0) return;
    let searchType = searchVO.SchType;
    const rows = dataProvider1.getJsonRows();
    if (searchType === '0') {
      searchType = 'ActGoodno';
    } else if (searchType === '1') {
      searchType = 'ActGoodnm';
    } else if (searchType === '2') {
      searchType = 'Actgoodspec';
    } else if (searchType === '3') {
      searchType = 'HalfGoodno';
    } else if (searchType === '4') {
      searchType = 'HalfGoodnm';
    } else if (searchType === '5') {
      searchType = 'HalfGoodSpec';
    } else if (searchType === '6') {
      searchType = 'OrderSu';
    } else searchType = 'DelvQty';

    let all = [];
    let indexes = [];

    const trueValue = refTextValue.current.toUpperCase();
    rows.forEach((row, index) => {
      all.push(
        gridView1.getValue(index, searchType).toUpperCase(),
        // .split(/[^A-Za-z]/),
      );
    });
    // let reAll = all.filter((e) => e.includes(refTextValue.current));
    all.forEach((row, i) => {
      row.includes(trueValue) ? indexes.push(i) : indexes;
    });
    console.log('indexes', indexes);
    gridView1.setCurrent({ itemIndex: indexes[[next] - 1], fieldName: 1 });
    setNext((prevNum) => prevNum - 1);
    if (next === 0) setNext(0);
    console.log('next', next);
  };

  useEffect(() => {
    if (visible) {
      fInit();
      fInitGrid1();
      fSearch();
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <>
      <Dialog style={{ width: '60%', height: '50%', display: 'flex' }} title={<Box style={{ display: 'flex', justifyContent: 'center' }}>코드검색</Box>} onClose={fClose} draggable modal>
        <Box className={classes.Title}>
          <Box>발주내역 - (PREORDERLIST)</Box>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}>
          <Box className={classes.Label}>검색조건</Box>
          <ComboBox
            inputCls="inputCls"
            data={cboSchtype}
            className={classes.Combo}
            value={searchVO.SchType}
            onChange={(value) => Util.Common.fFieldChange(setSearchVO, 'SchType', value)}
            // onSelectionChange={(item) => {
            //   Util.Common.fGridSort(gridView1, item.value, { 0: 'ActGoodno', 1: 'ActGoodnm', 2: 'Actgoodspec', 3: 'HalfGoodno', 4: 'HalfGoodnm', 5: 'HalfGoodSpec', 6: 'OrderSu', 7: 'DelvQty' });
            // }}
          />
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}>
          <Box className={classes.Label}>검색내용</Box>
          <TextBox
            className={classes.Textbox}
            onChange={(value) => {
              gridView1.commit();
              Util.Common.fFieldChange(setSearchVO, 'SchText', value);
              Util.Common.fSearchMatch(
                gridView1,
                dataProvider1,
                searchVO.SchType,
                {
                  0: 'ActGoodno',
                  1: 'ActGoodnm',
                  2: 'Actgoodspec',
                  3: 'HalfGoodno',
                  4: 'HalfGoodnm',
                  5: 'HalfGoodSpec',
                  6: 'OrderSu',
                  7: 'DelvQty',
                },
                value,
              );
              refTextValue.current = value;
              setNext(1);
            }}
          />
          <LinkButton className={classes.Button} onClick={fNext}>
            <Box>다음</Box>
          </LinkButton>
          <LinkButton className={classes.Button} onClick={fPrev}>
            <Box>이전</Box>
          </LinkButton>
        </Box>
        <Box ref={refGrid1} id={Util.Common.fMakeId('Grid01')} style={{ width: '100%', height: 280 }} />
        <Box style={{ display: 'flex', justifyContent: 'right' }}>
          <LinkButton className={classes.Button} onClick={fClose}>
            <Box>확인</Box>
          </LinkButton>
          <LinkButton className={classes.Button} onClick={fClose}>
            <Box>취소</Box>
          </LinkButton>
        </Box>
      </Dialog>
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
};

let dataProvider1;
let gridView1;

const GridFields1 = [
  { fieldName: 'ActGoodnm', dataType: ValueType.TEXT },
  { fieldName: 'ActGoodno', dataType: ValueType.TEXT },
  { fieldName: 'Actgoodspec', dataType: ValueType.TEXT },
  { fieldName: 'DelvQty', dataType: ValueType.TEXT },
  { fieldName: 'HalfGoodnm', dataType: ValueType.TEXT },
  { fieldName: 'HalfGoodno', dataType: ValueType.TEXT },
  { fieldName: 'HalfGoodSpec', dataType: ValueType.TEXT },
  { fieldName: 'Orderguid', dataType: ValueType.TEXT },
  { fieldName: 'OrderSu', dataType: ValueType.TEXT },
  { fieldName: 'RecordGubun', dataType: ValueType.TEXT },
];
const GridColumns1 = [
  {
    name: 'ActGoodno',
    fieldName: 'ActGoodno',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'center-column',
    header: {
      text: '제품품번',
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    fieldName: 'ActGoodnm',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'left-column',
    header: {
      text: '제품품명',
      showTooltip: true,
    },
  },
  {
    fieldName: 'Actgoodspec',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'left-column',
    header: {
      text: '제품규격',
      showTooltip: true,
    },
  },
  {
    fieldName: 'HalfGoodno',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'left-column',
    header: {
      text: '반제품품번',
      showTooltip: true,
    },
  },
  {
    fieldName: 'HalfGoodnm',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'left-column',
    header: {
      text: '반제품품명',
      showTooltip: true,
    },
  },
  {
    fieldName: 'HalfGoodSpec',
    type: 'data',
    width: '70',
    editable: false,
    styleName: 'left-column',
    header: {
      text: '반제품규격',
      showTooltip: true,
    },
  },
  {
    fieldName: 'OrderSu',
    type: 'data',
    width: '35',
    editable: false,
    styleName: 'right-column',
    header: {
      text: '발주수량',
      showTooltip: true,
    },
  },
  {
    fieldName: 'DelvQty',
    type: 'data',
    width: '35',
    editable: false,
    styleName: 'right-column',
    header: {
      text: '입고수량',
      showTooltip: true,
    },
  },
];

const Styles = createUseStyles({
  Title: {
    width: 400,
    height: 30,
    backgroundColor: '#e0ecff',
    margin: 5,
    padding: 5,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  Label: {
    width: 90,
    height: 25,
    margin: '3px 3px',
    backgroundColor: '#f7f7f7',
    color: '#424242',
    padding: 5,
    fontSize: '12px',
    alignItems: 'center',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
  },
  Combo: {
    width: 210,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
  Textbox: {
    width: 210,
    height: 25,
    fontSize: '12px',
  },
  Button: {
    margin: 3,
  },
});

export default BaljooDetail;
