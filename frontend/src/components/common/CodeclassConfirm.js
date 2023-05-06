import React, { useState, useRef, useEffect } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { TextBox, Dialog, LinkButton } from 'rc-easyui';
import { GridView, LocalDataProvider } from 'realgrid';
import shortid from 'shortid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { createUseStyles } from 'react-jss';
import { BsSearch } from 'react-icons/bs';
import imgKsMark from '@assets/images/img_ks_mark.png';

const CodeclassConfirm = ({
  visible,
  description,
  value,
  codeValue,
  datas,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  setVisibleData = null,
  setVisibleCancel = null,
  width = 470,
}) => {
  const { $CommonStore } = useStores();
  const classes = Styles();

  const refGrid = useRef(null);
  const refTxtSearch = useRef(null);
  //gridView.keyDown에서 검색하기 위한 ref값
  const refSaveTxtSearch = useRef('');

  const [txtValveType, setTxtValveType] = useState('');
  const [txtSearch, setTxtSearch] = useState('');

  const fInitGrid = () => {
    let fields = [];
    let columns = [];
    // let data = [];

    setTxtValveType(value);
    refSaveTxtSearch.current = value;
    datas[0].map((item) => {
      fields.push({ fieldName: item.FdEName.toLowerCase(), dataType: 'text' });
      if (item.Size && item.Size > 0) {
        columns.push({
          name: item.FdEName.toLowerCase(),
          fieldName: item.FdEName.toLowerCase(),
          width: Number(item.Size),
          styleName: item.Align === '2' ? 'center-column' : item.Align === '3' ? 'right-column' : 'left-column',
          header: {
            text: item.FdKName,
          },
          editable: false,
        });
      }
    });

    const keys = ['fieldName'];
    const filtered = fields.filter(
      (
        (s) => (o) =>
          ((k) => !s.has(k) && s.add(k))(keys.map((k) => o[k]).join('|'))
      )(new Set()),
    );

    dataProvider01 = new LocalDataProvider(false);
    gridView01 = new GridView(refGrid.current);

    gridView01.setDataSource(dataProvider01);
    dataProvider01.setFields(filtered);
    gridView01.setColumns(columns);
    columns.map((item) => {
      gridView01.setColumnProperty(item.name, 'autoFilter', true);
    });

    dataProvider01.setRows(datas[1]);
    originData = datas[1];
    gridView01.setStateBar({ visible: false });

    gridView01.setEditOptions({
      insertable: false,
      editable: false,
    });

    gridView01.setRowIndicator({
      visible: false,
    });

    gridView01.setCheckBar({ visible: false });
    gridView01.setFooters({ visible: false });

    gridView01.displayOptions.selectionStyle = 'singleRow';
    gridView01.displayOptions.fitStyle = 'evenFill';
    gridView01.displayOptions.columnMovable = false;

    gridView01.setOptions({
      summaryMode: 'aggregate',
      panel: {
        visible: false,
      },
    });

    gridView01.setGroupingOptions({ enabled: false });

    gridView01.setDisplayOptions({
      heightMeasurer: 'fixed',
      rowResizable: true,
      rowHeight: 35,
    });

    gridView01.setSortingOptions({
      enabled: false,
    });

    gridView01.onCellDblClicked = function (grid, clickData) {
      if (clickData.itemIndex >= 0) {
        let selected = {};

        fields.map((item) => {
          selected = { ...selected, ...{ [item.fieldName]: grid.getDataSource().getValue(clickData.dataRow, item.fieldName) } };
        });
        $CommonStore.fSetCodeclass({
          selData: selected,
        });

        fConfirm();
      }
    };

    gridView01.onCellClicked = function (grid, clickData) {
      if (clickData.itemIndex >= 0) {
        let selected = {};

        fields.map((item) => {
          selected = { ...selected, ...{ [item.fieldName]: grid.getDataSource().getValue(clickData.dataRow, item.fieldName) } };
        });
        $CommonStore.fSetCodeclass({
          selData: selected,
        });
      }
    };
    gridView01.onKeyDown = function (grid, event) {
      let key = event.key;
      let itemIndex = grid.getCurrent().itemIndex;

      if (key === 'F9') {
        fHandleSearchBtn(refSaveTxtSearch.current);
      }
      if (key === 'Enter') {
        if (itemIndex >= 0) {
          let selected = {};

          fields.map((item) => {
            selected = { ...selected, ...{ [item.fieldName]: grid.getDataSource().getValue(itemIndex, item.fieldName) } };
          });

          $CommonStore.fSetCodeclass({
            selData: selected,
          });
        }
        fConfirm();
      }
      if (key === 'Escape') {
        fCancel();
      }
    };
  };

  const fHandleValveType = (value) => {
    setTxtSearch(value);
    refSaveTxtSearch.current = value;

    dataProvider01.clearRows();
    const text = refSaveTxtSearch.current.split(',');

    let desc = '';
    const code = datas[0][0]['FdEName'].toLowerCase();
    const name = datas[0][1]['FdEName'].toLowerCase();

    if (datas[0].length > 2) {
      desc = datas[0][2]['FdEName'].toLowerCase();
    }

    if (text.length > 1) {
      dataProvider01.setRows(
        originData.filter(
          (item) =>
            (String(item[code]).toUpperCase().includes(text[0].toUpperCase()) ||
              String(item[name]).toUpperCase().includes(text[0].toUpperCase()) ||
              String(item[desc]).toUpperCase().includes(text[0].toUpperCase())) &&
            (String(item[code]).toUpperCase().includes(text[1].toUpperCase()) ||
              String(item[name]).toUpperCase().includes(text[1].toUpperCase()) ||
              String(item[desc]).toUpperCase().includes(text[1].toUpperCase())),
        ),
      );
    } else {
      dataProvider01.setRows(
        originData.filter(
          (item) =>
            String(item[code]).toUpperCase().includes(refSaveTxtSearch.current.toUpperCase()) ||
            String(item[name]).toUpperCase().includes(refSaveTxtSearch.current.toUpperCase()) ||
            String(item[desc]).toUpperCase().includes(refSaveTxtSearch.current.toUpperCase()),
        ),
      );
    }
  };

  const fHandleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fHandleSearchBtn(e.target.value);
      gridView01.setFocus();
    } else if (e.key === 'Escape') {
      fCancel();
    } else if (e.key === 'Tab') {
      setTimeout(async () => {
        gridView01.setFocus();
      }, 0);
    }
  };

  const fHandleSearchBtn = (txtSearch) => {
    let _fields = dataProvider01.getOrgFieldNames();
    let _startFieldIndex = _fields.indexOf(gridView01.getCurrent().fieldName) + 1;
    let valueOption = {
      fields: _fields,
      value: txtSearch,
      startIndex: gridView01.getCurrent().itemIndex,
      startFieldIndex: _startFieldIndex,
      wrap: true,
      caseSensitive: false,
      partialMatch: true,
    };
    let vlaueIndex = gridView01.searchCell(valueOption);
    if (document.getElementById('btnSearch')) {
      document.getElementById('btnSearch').blur();
    }

    gridView01.setCurrent(vlaueIndex);
    gridView01.setFocus();
    if (vlaueIndex) {
      let selected = gridView01.getValues(vlaueIndex.itemIndex);
      $CommonStore.fSetCodeclass({
        selData: selected,
      });
    }
  };

  const fHandleSearch = (txtSearch) => {
    let _fields = dataProvider01.getOrgFieldNames();
    let _startFieldIndex = _fields.indexOf(gridView01.getCurrent().fieldName) + 1;
    let valueOption = {
      fields: _fields,
      value: txtSearch,
      startIndex: gridView01.getCurrent().itemIndex,
      startFieldIndex: _startFieldIndex,
      wrap: true,
      caseSensitive: false,
      partialMatch: true,
    };

    let codeOption = {
      fields: _fields,
      value: codeValue,
      startIndex: gridView01.getCurrent().itemIndex,
      startFieldIndex: _startFieldIndex,
      wrap: true,
      caseSensitive: false,
      partialMatch: true,
    };
    let vlaueIndex = gridView01.searchCell(valueOption);
    let codeIndex = gridView01.searchCell(codeOption);
    if (document.getElementById('btnSearch')) {
      document.getElementById('btnSearch').blur();
    }

    gridView01.setCurrent(codeIndex ? codeIndex : vlaueIndex);
    gridView01.setFocus();
    if (codeIndex) {
      let selected = gridView01.getValues(codeIndex.itemIndex);
      $CommonStore.fSetCodeclass({
        selData: selected,
      });
    } else if (vlaueIndex) {
      let selected = gridView01.getValues(vlaueIndex.itemIndex);
      $CommonStore.fSetCodeclass({
        selData: selected,
      });
    }
  };

  const fConfirm = () => {
    if (setVisibleData) {
      setVisibleData();
    }
    if (onConfirm) {
      onConfirm();
    }
  };

  const fCancel = () => {
    if (setVisibleCancel) {
      setVisibleCancel();
    }
    onCancel();
  };

  useEffect(() => {
    if (txtValveType) {
      setTxtSearch(txtValveType);
      setTimeout(() => {
        fHandleSearch(txtValveType);
      }, 150);
    } else {
      setTxtSearch('');
    }
  }, [txtValveType]);

  useEffect(() => {
    if (visible) {
      fInitGrid();
      refTxtSearch.current.focus();
    } else {
      setTxtValveType('');
      setTxtSearch('');
      $CommonStore.fSetCodeclass({
        selData: '',
      });
    }
    $CommonStore.fSetCodeclassPopup(visible);
  }, [visible]);

  const header = () => {
    return (
      <Box key={TitleId} style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ marginLeft: 5, width: 27 }} />
        <pre disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          {description}
        </pre>
      </Box>
    );
  };

  if (!visible) return null;
  return (
    <Dialog header={header} style={{ width: description === 'PMS 연결 코드 등록.' ? 1430 : width }} bodyCls="f-column" closable={false} modal>
      <Box className="f-full">
        <PerfectScrollbar style={{ minHeight: 200, maxHeight: 500 }}>
          <Box style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
            <Box className={classes.TitleBox}>
              <span className={classes.TitleText}>검색내용</span>
            </Box>
            <Box
              onKeyDown={(e) => {
                fHandleKeyPress(e);
              }}
            >
              <TextBox
                ref={refTxtSearch}
                className={classes.InputBox}
                onChange={fHandleValveType}
                value={txtSearch}
                name="iClass4"
                addonRight={() => (
                  <Box
                    className="textbox-icon icon-clear"
                    title="Clear value"
                    onClick={() => {
                      setTxtValveType('');
                      setTxtSearch('');
                      refSaveTxtSearch.current = '';
                      refTxtSearch.current = '';
                    }}
                  />
                )}
              />
            </Box>
            <Box id="btnSearch">
              <LinkButton
                style={{ marginLeft: '15px', height: '25px', paddingRight: '4px' }}
                onClick={() => {
                  fHandleSearchBtn(txtSearch);
                  refSaveTxtSearch.current = '';
                  //refTxtSearch.current = '';
                }}
              >
                <Box style={{ height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BsSearch size={12} />
                  <Box style={{ marginLeft: 5, fontSize: 12, fontWeight: 600 }}>검색</Box>
                </Box>
              </LinkButton>
            </Box>
          </Box>
          <Box ref={refGrid} style={{ width: '100%', height: '300px', padding: 10 }} />
        </PerfectScrollbar>
      </Box>
      <Box className="dialog-button">
        <LinkButton style={{ width: 80 }} className="c6" onClick={fConfirm}>
          {confirmText}
        </LinkButton>
        <LinkButton style={{ width: 80 }} onClick={fCancel}>
          {cancelText}
        </LinkButton>
      </Box>
    </Dialog>
  );
};

const TitleId = shortid.generate();
let gridView01;
let dataProvider01, originData;

const Styles = createUseStyles({
  S1: {
    '& .panel-header': {
      borderRightWidth: 0,
      height: 35,
    },
  },
  S2: {
    '& .panel-body': {
      borderRightWidth: 0,
    },
  },

  dialogTitle: {
    background: '#F4F4F4',
    borderColor: '#dddddd #95B8E7 #95B8E7 #95B8E7',
    borderWidth: '1px 0 0 0',
    textAlign: 'left',
    padding: '5px',
  },

  TitleBox: {
    margin: '3px 10px',
    marginRight: '20px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    width: 110,
    fontWeight: 600,
  },
  TitleText: {
    width: 100,
  },
  InputBox: {
    width: 185,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
  RB1: {
    width: '15px!important',
    height: '15px!important',
  },
  DateFont: {
    '& .textbox-text': {
      fontSize: '12px',
    },
    '& .textbox': {
      fontSize: '12px',
    },
  },
});

export default CodeclassConfirm;
