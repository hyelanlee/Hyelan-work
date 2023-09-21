import React, { useState, useEffect, useRef } from 'react';
import { LinkButton, Dialog, RadioButton, Label, TextBox } from 'rc-easyui';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { MdOutlineFormatListNumbered } from 'react-icons/md/';
import { Box } from '@material-ui/core';
import { BiWindowClose } from 'react-icons/bi';
import { createUseStyles } from 'react-jss';
import { Utility } from '@components/common/Utility/Utility';
import { ValueType, GridView, LocalDataProvider } from 'realgrid';
import useStores from '@stores/useStores';
import Alert from '@components/common/Alert';

const PurchaseStorageBalSearch = ({ visible, onCancel, custCd, sendRows }) => {
  const PGMID = '_IMPORTEXPENSES';
  const { $UserStore } = useStores();
  const classes = Styles();

  const refGrid1 = useRef(null);
  const refGrid2 = useRef(null);
  const refIndex = useRef(null);
  const refByOrder = useRef(null);
  const refFooterList = useRef([]);
  const refQtySumList = useRef([]);

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);

  const [searchVO, setSearchVO] = useState({});
  const fInit = () => {
    setSearchVO(
      {
        SchAccunit: '',
        SchFactory: '',
        SchOrdergubun: 'C',
        SchCustcd: custCd,
        SchClass3: '',
        SchClass4: '',
        SchFileno: '',
        SchClass3nm: '',
      },
      50,
    );
    Util.Common.fSetTabIndex();
    // document.getElementById(Util.Common.fMakeId('orderNo')).focus();
    document.getElementById(Util.Common.fMakeId('orderNo')).focus();
    refFooterList.current = [];
    refQtySumList.current = [];
  };
  // --------------------- Init Grid1 Start ------------------------------------------------------------- //
  const fInitGrid1 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid1'));
    dataProvider1 = new LocalDataProvider(false);
    gridView1 = new GridView(refGrid1.current);
    Util.Grid.fInitGridHeader(gridView1, dataProvider1, GridFields1, GridColumns1, 30, fOnCurrentRowChanged1, fOnCellClicked1, fKeyConfig1);

    gridView1.onCellDblClicked = function (grid, clickData) {
      const clickedRow = dataProvider1.getJsonRow(clickData.dataRow);
      // fAddGrid3(clickData);
      dataProvider2.addRow(clickedRow);
      makeFooters(clickData);

      // let isInFooter = false;
      // let foundInIndex;
      // let qtyValue = dataProvider1.getValue(clickData.dataRow, 'Qty');

      // refFooterList.current.forEach((e, i) => {
      //   if (e.text == clickedRow.Class5nm) {
      //     isInFooter = true;
      //     foundInIndex = i;
      //   }
      // });
      // if (!isInFooter) {
      //   refFooterList.current.push({ text: clickedRow.Class5nm });
      //   refQtySumList.current.push({ text: qtyValue });
      //   let footerSize = [];
      //   refFooterList.current.forEach(() => {
      //     footerSize.push({});
      //   });
      //   gridView2.setFooters(footerSize);
      // } else {
      //   refQtySumList.current[foundInIndex].text += qtyValue;
      // }

      // gridView2.columnByName('Class5nm').setFooters(refFooterList.current);
      // gridView2.columnByName('Qty').setFooters(refQtySumList.current);

      dataProvider1.removeRow(clickData.dataRow);
      gridView2.commit();
      gridView2.validateCells();
    };
  };

  const makeFooters = (clickData) => {
    const clickedRow = dataProvider1.getJsonRow(clickData.dataRow);
    let isInFooter = false;
    let foundInIndex;
    let qtyValue = dataProvider1.getValue(clickData.dataRow, 'Qty');

    refFooterList.current.forEach((e, i) => {
      if (e.text == clickedRow.Class5nm) {
        isInFooter = true;
        foundInIndex = i;
      }
    });
    if (!isInFooter) {
      refFooterList.current.push({ text: clickedRow.Class5nm });
      refQtySumList.current.push({ text: qtyValue });
      let footerSize = [];
      refFooterList.current.forEach(() => {
        footerSize.push([]);
      });
      gridView2.setFooters(footerSize);
    } else {
      refQtySumList.current[foundInIndex].text += qtyValue;
    }

    gridView2.columnByName('Class5nm').setFooters(refFooterList.current);
    gridView2.columnByName('Qty').setFooters(refQtySumList.current);
  };

  // const fAddGrid3 = (clickData) => {
  //   const newQty = dataProvider1.getValue(clickData.dataRow, 'Qty');
  //   const data3 = dataProvider3.getJsonRows();
  //   const ClickedData1 = dataProvider1.getJsonRow(clickData.dataRow);
  //   let isExists = false;
  //   data3.forEach((row, i) => {
  //     if (row.Class5nm === ClickedData1.Class5nm) {
  //       const qty = dataProvider3.getValue(i, 'Qty');
  //       dataProvider3.setValue(i, 'Qty', qty + newQty);
  //       isExists = true;
  //     }
  //   });
  //   if (!isExists) {
  //     dataProvider3.addRow(ClickedData1);
  //   }
  // };

  const fOnCurrentRowChanged1 = async (grid, oldRow, newRow) => {
    if (newRow >= 0) {
      refIndex.current = newRow;
    }
  };
  const fOnCellClicked1 = async () => {};

  const fKeyConfig1 = async (grid, event) => {
    const clickData = gridView1.getCurrent();
    const clickedRow = dataProvider1.getJsonRow(clickData.dataRow);
    switch (event.key) {
      case 'Enter':
        // onCellEntered(clickedRow);
        dataProvider2.addRow(clickedRow);
        makeFooters(clickData);
        dataProvider1.removeRow(clickData.dataRow);
        break;
      case event.shiftKey && 'Tab':
        refByOrder.current.focus();
        break;
      case 'Tab':
        gridView2.setFocus();
        break;
      default:
        break;
    }
  };
  // const onCellEntered = (clickData) => {
  //   const clickedRow = dataProvider1.getJsonRow(clickData.dataRow);
  //   dataProvider2.addRow(clickedRow);
  //   const newQty = dataProvider1.getValue(clickData.dataRow, 'Qty');
  //   const data3 = dataProvider3.getJsonRows();
  //   let isExists = false;
  //   data3.forEach((row, i) => {
  //     if (row.Class5nm === clickedRow.Class5nm) {
  //       const qty = dataProvider3.getValue(i, 'Qty');
  //       dataProvider3.setValue(i, 'Qty', qty + newQty);
  //       isExists = true;
  //     }
  //   });
  //   if (!isExists) {
  //     dataProvider3.addRow(clickedRow);
  //   }
  // };
  // --------------------- Init Grid1 End ------------------------------------------------------------- //
  // --------------------- Init Grid2 Start ------------------------------------------------------------- //
  const fInitGrid2 = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid2'));
    dataProvider2 = new LocalDataProvider(false);
    gridView2 = new GridView(refGrid2.current);
    Util.Grid.fInitGridHeader(gridView2, dataProvider2, GridFields1, GridColumns2, 30, fOnCurrentRowChanged2, fOnCellClicked2, fKeyConfig2);
    gridView2.setFooters({ visible: true });
    // let group = gridView2.getGroupModel(1);
    // gridView2.setRowGroup({
    //   expendedAdornments: 'footer',
    //   createFooterCallback: function (grid, group) {
    //     console.log('happy');
    //   },
    // });

    // const rows = dataProvider2.getJsonRows();
    // rows.forEach((item, index) => {
    //   console.log('item.Class5nm', item.Class5nm);
    //   gridView2.columnByName('Class5nm').setFooters([{ text: item.Class5nm }, {}]);
    // });
  };

  const fOnCurrentRowChanged2 = async () => {};
  const fOnCellClicked2 = async () => {};
  const fKeyConfig2 = async (grid, e) => {
    switch (e.key) {
      case e.shiftKey && 'Tab':
        gridView1.setFocus();
        break;
    }
  };
  // --------------------- Init Grid2 End ------------------------------------------------------------- //
  // --------------------- Init Grid3 Start ------------------------------------------------------------- //
  // const fInitGrid3 = () => {
  //   Util.Grid.fContainerInit(Util.Common.fMakeId('Grid3'));
  //   dataProvider3 = new LocalDataProvider(false);
  //   gridView3 = new GridView(refGrid3.current);
  //   Util.Grid.fInitGridHeader(gridView3, dataProvider3, GridFields1, GridColumns3, 30);
  //   gridView3.setRowIndicator({ visible: false });
  //   gridView3.setHeader({ visible: false });
  // };
  // --------------------- Init Grid3 End ------------------------------------------------------------- //
  // --------------------- Buttons Start ------------------------------------------------------------- //

  const fSearch = async () => {
    const restVO = { ...searchVO };
    restVO.SchAccunit = $UserStore.user.accunit;
    restVO.SchFactory = $UserStore.user.factory;

    await Util.Command.fSearch(dataProvider1, '/@api/purchase/purchaseStorage/searchBalJoo', restVO, '발주품번');
    gridView1.orderBy(['Fileno']);
    gridView1.setCurrent({ itemIndex: 0, column: 'Fileno' });
  };

  const fSelect = () => {
    const selected = dataProvider2.getJsonRows();

    if (selected.length < 1) {
      setAlert({ visible: true, desc: '발주요청자료를 선택하세요.', type: 'W' });
      return;
    }
    sendRows({ selected: selected, SchOrdergubun: searchVO.SchOrdergubun });
    console.log('selected', selected);
    onCancel();
  };

  const fRemoveRow = () => {
    const item = gridView2.getCurrent();

    if (item.itemIndex === -1) {
      setAlert({ visible: true, desc: '삭제할 구매입고내역을 선택해 주세요.', type: 'W' });
      return;
    }
    const material = dataProvider2.getValue(item.itemIndex, 'Class5nm');
    const removedQty = dataProvider2.getValue(item.itemIndex, 'Qty');
    const clickedRow = dataProvider2.getJsonRow(item.itemIndex);

    let foundInIndex;

    refFooterList.current.forEach((e, i) => {
      if (e.text == material) {
        foundInIndex = i;
      }
    });

    refQtySumList.current[foundInIndex].text -= removedQty;

    gridView2.columnByName('Class5nm').setFooters(refFooterList.current);
    gridView2.columnByName('Qty').setFooters(refQtySumList.current);

    dataProvider1.addRow(clickedRow);
    dataProvider2.removeRow(item.itemIndex);
    const data = dataProvider2.getJsonRows();
    let isClass5nmInRef = false;

    data.forEach((e) => {
      if (e.Class5nm == material) {
        isClass5nmInRef = true;
      }
    });
    if (!isClass5nmInRef) {
      refQtySumList.current.splice(foundInIndex, 1);
      refFooterList.current.splice(foundInIndex, 1);
      let footerSize = [];
      refFooterList.current.forEach(() => {
        footerSize.push({});
      });
      gridView2.setFooters(footerSize);
      gridView2.columnByName('Class5nm').setFooters(refFooterList.current);
      gridView2.columnByName('Qty').setFooters(refQtySumList.current);
    }
  };

  const fClose = () => {
    onCancel();
  };

  const fSeceltByOrderNo = () => {
    if (dataProvider1.getJsonRows().length < 1) {
      setAlert({ visible: true, desc: '처리할 주문서 번호가 없습니다.', type: 'W' });
      return;
    }

    const selectedFileno = dataProvider1.getValue(refIndex.current, 'Fileno');
    const rows = dataProvider1.getJsonRows();
    const rowsIndex = [];
    rows.forEach((row, index) => {
      const fileno = dataProvider1.getValue(index, 'Fileno');
      if (selectedFileno === fileno) {
        dataProvider2.addRow(dataProvider1.getJsonRow(index));
        rowsIndex.push(index);

        const newQty = dataProvider1.getValue(index, 'Qty');
        let isInFooter = false;
        let foundInIndex;
        refFooterList.current.forEach((e, i) => {
          if (e.text == row.Class5nm) {
            isInFooter = true;
            foundInIndex = i;
          }
        });
        if (!isInFooter) {
          refFooterList.current.push({ text: row.Class5nm });
          refQtySumList.current.push({ text: newQty });
          let footerSize = [];
          refFooterList.current.forEach(() => {
            footerSize.push([]);
          });
          gridView2.setFooters(footerSize);
        } else {
          refQtySumList.current[foundInIndex].text += newQty;
        }
        gridView2.columnByName('Class5nm').setFooters(refFooterList.current);
        gridView2.columnByName('Qty').setFooters(refQtySumList.current);

        // addGrid3 From Here
        // const newQty = dataProvider1.getValue(index, 'Qty');
        // const data3 = dataProvider3.getJsonRows();
        // let isExists = false;
        // data3.forEach((row3, i3) => {
        //   if (row.Class5nm === row3.Class5nm) {
        //     const qty = dataProvider3.getValue(i3, 'Qty');
        //     dataProvider3.setValue(i3, 'Qty', qty + newQty);
        //     isExists = true;
        //   }
        // });
        // if (!isExists) {
        //   dataProvider3.addRow(dataProvider1.getJsonRow(index));
        // }
      }
    });
    dataProvider1.removeRows(rowsIndex);
  };
  // --------------------- Buttons End ------------------------------------------------------------- //
  // --------------------- Functions Start ------------------------------------------------------------- //

  const fChangeImpExp = (value, checked) => {
    if (checked) {
      Util.Common.fFieldChange(setSearchVO, 'SchOrdergubun', value);
    }
  };

  const fRdoDateTap = (e) => {
    const radioValue = searchVO.SchOrdergubun;
    if (e.key === 'ArrowRight') {
      if (radioValue === 'C') setSearchVO({ ...searchVO, SchOrdergubun: 'M' });
      if (radioValue === 'M') setSearchVO({ ...searchVO, SchOrdergubun: 'P' });
      if (radioValue === 'P') setSearchVO({ ...searchVO, SchOrdergubun: 'C' });
    } else if (e.key === 'ArrowLeft') {
      if (radioValue === 'C') setSearchVO({ ...searchVO, SchOrdergubun: 'P' });
      if (radioValue === 'M') setSearchVO({ ...searchVO, SchOrdergubun: 'C' });
      if (radioValue === 'P') setSearchVO({ ...searchVO, SchOrdergubun: 'M' });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      document.getElementById(Util.Common.fMakeId('orderNo')).focus();
    }
  };

  window.onkeydown = function (e) {
    if (visible) {
      if (e.key === 'F3') {
        e.preventDefault();
        fSearch();
      } else if (e.key === 'F4') {
        e.preventDefault();
        fSelect();
      } else if (e.key === 'F5') {
        e.preventDefault();
        fRemoveRow();
      } else if (e.key === 'F6') {
        e.preventDefault();
        fClose();
      }
    }
  };

  // --------------------- Functions End ------------------------------------------------------------- //

  useEffect(() => {
    if (visible) {
      fInit();
      fInitGrid1();
      fInitGrid2();
      // fInitGrid3();
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <>
      <Dialog style={{ width: '90%', height: '90%' }} title={<Box style={{ display: 'flex', justifyContent: 'center' }}>발주품번조회</Box>} onClose={fClose} draggable modal>
        <Box style={{ marginLeft: '5px', marginTop: '5px' }}>
          <LinkButton className={classes.Linkbutton} style={{ backgroundColor: '#C8F9FA' }} onClick={fSearch} inputCls="inputCls">
            <Box className={classes.LinkFontBox} id={Util.Common.fMakeId('search')}>
              <AiOutlineFileSearch size={18} />
              <Box className={classes.ButtonFont}>조회 F3</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.Linkbutton} style={{ backgroundColor: '#a4e9c1' }} onClick={fSelect} inputCls="inputCls">
            <Box className={classes.LinkFontBox}>
              <Box className={classes.ButtonFont}>발주자료검색처리 F4</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.Linkbutton} style={{ backgroundColor: '#ffd5d5' }} onClick={fRemoveRow}>
            <Box className={classes.LinkFontBox}>
              <Box className={classes.ButtonFont}>발주자료검색삭제(건별) F5</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.Linkbutton} style={{ backgroundColor: '#D9D9D9' }} onClick={fClose}>
            <Box className={classes.LinkFontBox}>
              <BiWindowClose size={18} />
              <Box className={classes.ButtonFont}>&nbsp;종료 F6</Box>
            </Box>
          </LinkButton>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '3px', marginTop: 3 }}>
          <Box className={classes.Label}>
            <Box>자산 구분</Box>
          </Box>
          <Box
            style={{ height: 25, border: '1px solid #bed7ff', color: '#434343', width: '220px', display: 'flex', padding: 5, marginLeft: 5, borderRadius: 3 }}
            id={Util.Common.fMakeId('radioBox')}
            className="inputCls"
            onKeyDown={(e) => fRdoDateTap(e)}
          >
            <Box className={classes.RadioBox}>
              <RadioButton
                className={classes.Radio}
                inputId={Util.Common.fMakeId('joomul')}
                value="C"
                groupValue={searchVO.SchOrdergubun}
                onChange={(checked) => fChangeImpExp('C', checked)}
                inputCls="inputCls"
              />
              <Label htmlFor={Util.Common.fMakeId('joomul')} className={classes.RadioLabel}>
                주물
              </Label>
            </Box>
            <Box className={classes.RadioBox}>
              <RadioButton
                className={classes.Radio}
                inputId={Util.Common.fMakeId('bar')}
                value="M"
                groupValue={searchVO.SchOrdergubun}
                onChange={(checked) => fChangeImpExp('M', checked)}
                inputCls="inputCls"
              />
              <Label htmlFor={Util.Common.fMakeId('bar')} className={classes.RadioLabel} style={{ width: 70 }}>
                원재료(BAR)
              </Label>
            </Box>
            <Box className={classes.RadioBox}>
              <RadioButton
                className={classes.Radio}
                inputId={Util.Common.fMakeId('etc')}
                value="P"
                groupValue={searchVO.SchOrdergubun}
                onChange={(checked) => fChangeImpExp('P', checked)}
                inputCls="inputCls"
              />
              <Label htmlFor={Util.Common.fMakeId('etc')} className={classes.RadioLabel}>
                ETC
              </Label>
            </Box>
          </Box>
          <Box className={classes.Label} style={{ marginLeft: 30 }}>
            <Box>주문서번호</Box>
          </Box>
          <Box
            onKeyDown={(e) => {
              if (e.shiftKey && e.keyCode === 9) {
                //
                setTimeout(() => {
                  document.getElementById(Util.Common.fMakeId('radioBox')).focus();
                }, 0);
              } else if (e.key === 'Tab') {
                setTimeout(() => {
                  refByOrder.current.focus();
                }, 0);
              }
            }}
          >
            <TextBox
              inputCls="inputCls"
              inputId={Util.Common.fMakeId('orderNo')}
              onChange={(value) => {
                Util.Common.fFieldChange(setSearchVO, 'SchFileno', value);
              }}
              style={{ height: 25, color: '#434343', width: '220px', display: 'flex', padding: 5, marginLeft: 5 }}
            />
          </Box>
          <Box
            onKeyDown={(e) => {
              if (e.shiftKey && e.keyCode === 9) {
                e.preventDefault();
                document.getElementById(Util.Common.fMakeId('orderNo')).focus();
              } else if (e.keyCode === 9) {
                e.preventDefault();
                gridView1.setFocus();
              }
            }}
          >
            <LinkButton ref={refByOrder} style={{ marginLeft: 900 }} className="c9" onClick={fSeceltByOrderNo} inputCls="inputCls">
              <Box className={classes.LinkFontBox} id={Util.Common.fMakeId('search')}>
                <MdOutlineFormatListNumbered size={18} />
                <Box className={classes.ButtonFont}>주문서 번호별 처리</Box>
              </Box>
            </LinkButton>
          </Box>
        </Box>
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '3px' }}>
          <Box className={classes.Label} style={{ backgroundColor: '#e0ecff' }}>
            <Box>발주요청자료</Box>
          </Box>
        </Box>
        <Box ref={refGrid1} id={Util.Common.fMakeId('Grid1')} style={{ width: '100%', height: 355 }} />
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: '3px', marginTop: '3px' }}>
          <Box className={classes.Label} style={{ backgroundColor: '#e0ecff' }}>
            <Box>구매입고내역</Box>
          </Box>
        </Box>
        <Box ref={refGrid2} id={Util.Common.fMakeId('Grid2')} style={{ width: '100%', height: 310 }} />
        {/* <Box ref={refGrid3} id={Util.Common.fMakeId('Grid3')} style={{ width: '100%', height: 85 }} /> */}
      </Dialog>

      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
};

let dataProvider1, dataProvider2;
let gridView1, gridView2;

const GridFields1 = [
  { fieldName: 'Goodno', dataType: ValueType.TEXT },
  { fieldName: 'Spec', dataType: ValueType.TEXT },
  { fieldName: 'Goodcdnm', dataType: ValueType.TEXT },
  { fieldName: 'Goodtype', dataType: ValueType.TEXT },
  { fieldName: 'KgPerm', dataType: ValueType.TEXT },
  { fieldName: 'Goodcd', dataType: ValueType.TEXT },
  { fieldName: 'Inunit', dataType: ValueType.TEXT },
  { fieldName: 'Inunitnm', dataType: ValueType.TEXT },
  { fieldName: 'Priceunit', dataType: ValueType.TEXT },
  { fieldName: 'Priceunitnm', dataType: ValueType.TEXT },
  { fieldName: 'Class2', dataType: ValueType.TEXT },
  { fieldName: 'Standardweight', dataType: ValueType.TEXT },
  { fieldName: 'Stockyn', dataType: ValueType.TEXT },
  { fieldName: 'Qcyn', dataType: ValueType.TEXT },
  { fieldName: 'Wrhcd', dataType: ValueType.TEXT },
  { fieldName: 'Wrhnm', dataType: ValueType.TEXT },
  { fieldName: 'Jukyocd', dataType: ValueType.TEXT },
  { fieldName: 'Jukyonm', dataType: ValueType.TEXT },
  { fieldName: 'Remark', dataType: ValueType.TEXT },
  { fieldName: 'Bodymaterial', dataType: ValueType.TEXT },
  { fieldName: 'HalfgoodspartMaterial', dataType: ValueType.TEXT },
  { fieldName: 'Class5', dataType: ValueType.TEXT },
  { fieldName: 'Class5nm', dataType: ValueType.TEXT },
  { fieldName: 'Class4nm', dataType: ValueType.TEXT },
  { fieldName: 'Bdbttypenm', dataType: ValueType.TEXT },
  { fieldName: 'Endtypenm', dataType: ValueType.TEXT },
  { fieldName: 'Ratingtypenm', dataType: ValueType.TEXT },
  { fieldName: 'Sizetypenm', dataType: ValueType.TEXT },
  { fieldName: 'Balno', dataType: ValueType.TEXT },
  { fieldName: 'Balseq', dataType: ValueType.TEXT },
  { fieldName: 'Balqty', dataType: ValueType.NUMBER },
  { fieldName: 'Qty', dataType: ValueType.NUMBER },
  { fieldName: 'Miqty', dataType: ValueType.NUMBER },
  { fieldName: 'Qtymi', dataType: ValueType.TEXT },
  { fieldName: 'Weightmi', dataType: ValueType.TEXT },
  { fieldName: 'Weight', dataType: ValueType.NUMBER },
  { fieldName: 'Su', dataType: ValueType.NUMBER },
  { fieldName: 'Price', dataType: ValueType.NUMBER },
  { fieldName: 'OrderAmt', dataType: ValueType.TEXT },
  { fieldName: 'Topnode', dataType: ValueType.TEXT },
  { fieldName: 'Parent', dataType: ValueType.TEXT },
  { fieldName: 'Child', dataType: ValueType.TEXT },
  { fieldName: 'Actno', dataType: ValueType.TEXT },
  { fieldName: 'Actgoodcd', dataType: ValueType.TEXT },
  { fieldName: 'Actgoodno', dataType: ValueType.TEXT },
  { fieldName: 'Acceptno', dataType: ValueType.TEXT },
  { fieldName: 'Acceptseq', dataType: ValueType.TEXT },
  { fieldName: 'Acceptexptype', dataType: ValueType.TEXT },
  { fieldName: 'Delvdate', dataType: ValueType.DATE, datetimeFormat: 'yyyyMMdd' },
  { fieldName: 'Unitweight', dataType: ValueType.NUMBER },
  { fieldName: 'Pricecondition', dataType: ValueType.TEXT },
  { fieldName: 'Orderprice', dataType: ValueType.TEXT },
  { fieldName: 'Fileno', dataType: ValueType.TEXT },
  { fieldName: 'Currcd', dataType: ValueType.TEXT },
  { fieldName: 'Bomchecksort', dataType: ValueType.TEXT },
];

const GridColumns1 = [
  {
    name: 'Fileno',
    fieldName: 'Fileno',
    type: 'data',
    width: '70',
    header: {
      text: '주문번호',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'center-column',
    editable: true,
  },
  {
    name: 'Goodno',
    fieldName: 'Goodno',
    type: 'data',
    width: '150',
    header: {
      text: '발주품번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Spec',
    fieldName: 'Spec',
    type: 'data',
    width: '100',
    header: {
      text: '규격',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Goodcdnm',
    fieldName: 'Goodcdnm',
    type: 'data',
    width: '100',
    header: {
      text: '품명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Class5nm',
    fieldName: 'Class5nm',
    type: 'data',
    width: '100',
    header: {
      text: '재질',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Class4nm',
    fieldName: 'Class4nm',
    type: 'data',
    width: '150',
    header: {
      text: '품목구분(Body Bonnet End Type)',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Ratingtypenm',
    fieldName: 'Ratingtypenm',
    type: 'data',
    width: '70',
    header: {
      text: 'Rating',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Sizetypenm',
    fieldName: 'Sizetypenm',
    type: 'data',
    width: '70',
    header: {
      text: 'Size',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Jukyonm',
    fieldName: 'Jukyonm',
    type: 'data',
    width: '80',
    header: {
      text: '회계처리코드명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Qty',
    fieldName: 'Qty',
    width: 50,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '발주량',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    editable: false,
  },
  {
    name: 'Miqty',
    fieldName: 'Miqty',
    width: 50,
    styleName: 'right-column',
    numberFormat: '#,##0.##',
    header: {
      text: '미입고량',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'Acceptno',
    fieldName: 'Acceptno',
    type: 'data',
    width: '50',
    header: {
      text: '수결번호',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Actgoodno',
    fieldName: 'Actgoodno',
    type: 'data',
    width: '50',
    header: {
      text: '수주품번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Delvdate',
    fieldName: 'Delvdate',
    width: 70,
    styleName: 'center-column',
    datetimeFormat: 'yyyy-MM-dd',
    header: {
      text: '납기일',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'Price',
    fieldName: 'Price',
    width: 70,
    numberFormat: '#,##0',
    styleName: 'right-column',
    header: {
      text: '발주단기',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    editable: false,
  },
  {
    name: 'Bomchecksort',
    fieldName: 'Bomchecksort',
    type: 'data',
    width: '50',
    header: {
      text: 'Bomchecksort',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
];

const GridColumns2 = [
  {
    name: 'Fileno',
    fieldName: 'Fileno',
    type: 'data',
    width: '70',
    header: {
      text: '주문번호',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'center-column',
    editable: false,
  },
  {
    name: 'Goodno',
    fieldName: 'Goodno',
    type: 'data',
    width: '150',
    header: {
      text: '발주품번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Spec',
    fieldName: 'Spec',
    type: 'data',
    width: '100',
    header: {
      text: '규격',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Goodcdnm',
    fieldName: 'Goodcdnm',
    type: 'data',
    width: '100',
    header: {
      text: '품명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Class5nm',
    fieldName: 'Class5nm',
    width: '100',
    header: {
      text: '재질',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: [
      // {},
      // {
      //   expression: 'Class5nm',
      // },
    ],
    styleName: 'left-column',
  },
  {
    name: 'Class4nm',
    fieldName: 'Class4nm',
    type: 'data',
    width: '150',
    header: {
      text: '품목구분(Body Bonnet End Type)',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    name: 'Ratingtypenm',
    fieldName: 'Ratingtypenm',
    type: 'data',
    width: '70',
    header: {
      text: 'Rating',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    name: 'Sizetypenm',
    fieldName: 'Sizetypenm',
    type: 'data',
    width: '70',
    header: {
      text: 'Size',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    name: 'Jukyonm',
    fieldName: 'Jukyonm',
    type: 'data',
    width: '80',
    header: {
      text: '회계처리코드명',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
  },
  {
    name: 'Qty',
    fieldName: 'Qty',
    width: 50,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '발주량',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    footer: [
      // {},
      // {
      //   numberFormat: '#,##0',
      //   // expression: 'sum',
      // },
    ],
  },
  {
    name: 'Miqty',
    fieldName: 'Miqty',
    width: 50,
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '미입고량',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'Acceptno',
    fieldName: 'Acceptno',
    type: 'data',
    width: '50',
    header: {
      text: '수결번호',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Actgoodno',
    fieldName: 'Actgoodno',
    type: 'data',
    width: '50',
    header: {
      text: '수주품번',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
  {
    name: 'Delvdate',
    fieldName: 'Delvdate',
    width: 70,
    styleName: 'center-column',
    datetimeFormat: 'yyyy-MM-dd',
    header: {
      text: '납기일',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
  },
  {
    name: 'Price',
    fieldName: 'Price',
    width: '70',
    styleName: 'right-column',
    numberFormat: '#,##0',
    header: {
      text: '발주단기',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    editable: false,
  },
  {
    name: 'Bomchecksort',
    fieldName: 'Bomchecksort',
    type: 'data',
    width: '50',
    header: {
      text: 'Bomchecksort',
      showTooltip: true,
    },
    renderer: {
      type: 'text',
      showTooltip: true,
    },
    styleName: 'left-column',
    editable: false,
  },
];

const Styles = createUseStyles({
  Label: {
    width: 90,
    height: 25,
    margin: '3px 3px',
    backgroundColor: '#f7f7f7',
    color: '#424242',
    padding: 5,
    fontSize: '12px',
    alignItems: 'center',
    fontWeight: 600,
    display: 'flex',
  },
  Linkbutton: {
    with: 80,
    height: 30,
    color: '#424242',
    borderRadius: 3,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'yellow',
    padding: 6,
  },
  LinkFontBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonFont: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
  },
  RadioLabel: {
    marginLeft: '3px',
    width: 40,
    fontSize: '12px',
  },
  RButtonStyle: {
    width: '15px',
    height: '15px',
  },
  RadioBox: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 5,
  },
  Radio: {
    width: '15px',
    height: '15px',
  },
});

export default PurchaseStorageBalSearch;
