import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { GridView, LocalDataProvider } from 'realgrid';
import injectSheet from 'react-jss';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { GridColumns, GridFields } from '@components/common/Approval/ApprovalLineGrid';
import Alert from '@components/common/Alert';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import { Utility } from '@components/common/Utility/Utility';

const ApprovalLine = observer(({ classes, PGMID, Init, ApprovalType, ApprovalDocNo, ApprovalDocSource, Retrieve, GetDataSource }) => {
  const { $CommonStore, $UserStore } = useStores();

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);

  const refGrid1 = useRef(null);

  const validationFields = ['ApprNm', 'ApprPosNm'];
  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    description: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });

  const fInitGrid = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid1'));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid1.current);
    Util.Grid.fInitGridDetail(gridView, dataProvider, GridFields, GridColumns, gridViewonCellButtonClicked, onCellEdited2, fKeyConfig2);
    gridView.setRowIndicator({ visible: false });
    gridView.setCheckBar({ visible: false });
    dataProvider.onRowInserted = (provider, rownumber) => {
      Util.Grid.fSetMultiDataProvider(provider, rownumber, { ApprGubun: 'A', ApprSeq: rownumber + 1, CloseFlag: 'N' });
    };
  };

  const gridViewonCellButtonClicked = async (grid, index) => {
    grid.commit();
    const value = grid.getValue(grid.getCurrent().itemIndex, index.fieldName);
    let codeClassValue = {};

    if (index.fieldName === 'ApprNm') {
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), Util.CodeHelper.helperPnoNm2, PGMID, value, true);
      setCodeClassInputs(codeClassValue);
    } else if (index.fieldName === 'ApprPosNm') {
      codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), Util.CodeHelper.helperApprPosNm, PGMID, value, true);
      setCodeClassInputs(codeClassValue);
    }
  };

  const onCellEdited2 = (grid) => {
    let closeCount = 0;
    const item = grid.getCurrent();
    const value = grid.getValue(item.itemIndex, item.column);

    grid.commit();

    if (item.column === 'ApprNm') {
      if (value === null || value === '') {
        Util.Grid.fSetMultiDataProvider(dataProvider, item.dataRow, {
          ApprId: undefined,
          ApprNm: undefined,
        });
      }
    } else if (item.column === 'ApprPosNm') {
      if (value === null || value === '') {
        Util.Grid.fSetMultiDataProvider(dataProvider, item.dataRow, {
          ApprPos: undefined,
          ApprPosNm: undefined,
        });
      }
    } else if (item.column === 'CloseFlag') {
      const source = grid.getDataSource().getJsonRows();

      source.forEach((row) => {
        if (row.CloseFlag === 'Y') {
          closeCount += 1;
        }
      });

      if (closeCount > 1) {
        source.forEach((row, index) => {
          Util.Grid.fSetMultiDataProvider(dataProvider, index, { CloseFlag: 'N' });
        });

        Util.Grid.fSetMultiDataProvider(dataProvider, item.dataRow, { CloseFlag: 'Y' });
        return;
      }
    }
    gridView.validateCells();
  };

  const fKeyConfig2 = async (grid, event) => {
    const lastFieldName = 'ProcessYmd';
    const rowCount = grid.getDataSource().getRowCount();
    const { fieldName } = grid.getCurrent();
    const { itemIndex } = grid.getCurrent();

    switch (event.key) {
      case 'Enter':
        setAlert({ visible: false, desc: '' });
        grid.commit(true);

        if (fieldName === lastFieldName) {
          Util.Grid.fEnterLastField(grid, itemIndex, rowCount, fNewRowChk() === 0);
        } else if (grid.getDataSource().getValue(itemIndex, fieldName) || validationFields.includes(fieldName)) {
          if (fieldName === 'ApprNm' || fieldName === 'ApprPosNm') {
            grid.setCurrent({ itemIndex, fieldName });
            const value = grid.getValue(itemIndex, fieldName);
            let codeClassValue = {};

            if (value !== '' || validationFields.includes(fieldName)) {
              if (fieldName === 'ApprNm') {
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), Util.CodeHelper.helperPnoNm2, PGMID, value, false);
                if (!codeClassValue.visible) {
                  Util.Grid.fSetMultiDataProvider(dataProvider, itemIndex, { ApprId: codeClassValue.res.pno, ApprNm: codeClassValue.res.name });
                }
              } else if (fieldName === 'ApprPosNm') {
                codeClassValue = await Util.Grid.gridCodeClass(grid.getCurrent(), Util.CodeHelper.helperApprPosNm, PGMID, value, false);
                if (!codeClassValue.visible) {
                  Util.Grid.fSetDataProvider(dataProvider, itemIndex, ['ApprPos', 'ApprPosNm'], codeClassValue.res);
                }
              }
              setCodeClassInputs(codeClassValue);
            }
          }
        }
        grid.setFocus();
        break;
      case 'Escape':
        Util.Grid.fEscape(grid, itemIndex, rowCount, 'ApprSeq', false);
        break;
      case 'Insert':
        Util.Grid.fKeyInsert(grid, itemIndex, fNewRowChk() === 0, 'ApprSeq', false);
        break;
      case 'ArrowDown':
        Util.Grid.fArrowDown(grid, itemIndex, rowCount, fNewRowChk() === 0, 'ApprSeq', false);
        break;
      case 'ArrowUp':
        Util.Grid.fArrowUp(grid, itemIndex, rowCount, fNewRowChk(itemIndex) > 0);
        break;
      default:
        break;
    }
  };

  const fNewRowChk = (itemIndex) => {
    const rows = dataProvider.getAllStateRows().created;
    if (rows.length > 0) {
      let emptyCnt = 0;
      rows.map((item) => {
        if (itemIndex === undefined || item >= itemIndex) {
          const datas = gridView.getValues(item);
          if (!datas.ApprId || datas.ApprId === undefined) {
            emptyCnt += 1;
          }
        }
      });
      return emptyCnt;
    }
    return 0;
  };

  const fCodeClaseConfirm = async () => {
    gridView.commit(true);
    const clickData = codeClassInputs.selectedData;

    if (clickData.column === 'ApprNm') {
      Util.Grid.fSetMultiDataProvider(dataProvider, clickData.dataRow, {
        ApprId: Util.Common.fTrim($CommonStore.Codeclass.selData.pno),
        ApprNm: Util.Common.fTrim($CommonStore.Codeclass.selData.name),
      });
    } else if (clickData.column === 'ApprPosNm') {
      Util.Grid.fSetMultiDataProvider(dataProvider, clickData.dataRow, {
        ApprPos: Util.Common.fTrim($CommonStore.Codeclass.selData.minorcd),
        ApprPosNm: Util.Common.fTrim($CommonStore.Codeclass.selData.minornm),
      });
    }

    setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
    gridView.commit(true);
    gridView.setFocus();
    gridView.validateCells();
  };

  const fCodeClassConfirmCancel = (e) => {
    const Index = gridView.getCurrent().itemIndex;

    if (e.target === 'ApprNm') {
      Util.Grid.fSetDataProvider(dataProvider, Index, ['ApprId', 'ApprNm'], undefined);
    } else if (e.target === 'ApprPosNm') {
      Util.Grid.fSetDataProvider(dataProvider, Index, ['ApprPos', 'ApprPosNm'], undefined);
    }
    gridView.setCurrent({ itemIndex: Index, fieldName: gridView.getCurrent().fieldName });
    gridView.setFocus();
    setCodeClassInputs({ visible: false });
  };

  const fGetApplovalLine = async () => {
    const paramVO = {};
    paramVO.ApprovalType = ApprovalType;
    paramVO.ApprovalDocNo = ApprovalDocNo;
    paramVO.ApprovalDocSource = ApprovalDocSource;
    paramVO.UserPno = $UserStore.user.userid;
    paramVO.Factory = $UserStore.user.factory;

    try {
      const result = await Util.Command.fSearchByReturnTrim('/@api/common/appr/selectByApprovalLine', paramVO);

      if (!result) {
        Util.Grid.fNewRow(dataProvider, { ApprSeq: '1' });
        GetDataSource(dataProvider);
        return;
      }

      dataProvider.setRows(result);
      GetDataSource(dataProvider);

      if (result[0].isNewFlag === 'Y') {
        const rows = dataProvider.getRows();
        rows.forEach((row, index) => {
          dataProvider.setRowState(index, 'created', false, false);
        });
      }
    } catch (error) {
      setAlert({ visible: true, desc: `조회 중 오류가 발생하였습니다..${error}` });
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

  useEffect(() => {
    if (Util.Common.fEmptyReturn(ApprovalDocNo) === '') {
      dataProvider.clearRows();
      return;
    }
    fGetApplovalLine();
  }, [ApprovalDocNo]);

  useEffect(() => {
    if (Util.Common.fEmptyReturn(ApprovalDocNo) === '') {
      dataProvider.clearRows();
      return;
    }
    fGetApplovalLine();
  }, [Init]);

  useEffect(() => {
    if (Util.Common.fEmptyReturn(ApprovalDocNo) === '') {
      return;
    }
    fGetApplovalLine();
  }, [Retrieve]);

  return (
    <>
      <Box style={{ marginTop: 10, marginLeft: 10, width: '95%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Box style={{ width: '100%' }}>
          <Box className={classes.BoxTitle}>결재라인</Box>
          <Box ref={refGrid1} id={Util.Common.fMakeId('Grid1')} style={{ width: '100%', height: 110 }} />
        </Box>
      </Box>
      <CodeclassConfirm
        visible={codeClassInputs.visible}
        description={codeClassInputs.desc}
        value={codeClassInputs.value}
        datas={codeClassInputs.datas}
        id={codeClassInputs.id}
        viewId={codeClassInputs.viewId}
        selectedData={codeClassInputs.selectedData}
        onConfirm={fCodeClaseConfirm}
        onCancel={() => fCodeClassConfirmCancel({ target: codeClassInputs.id })}
      />
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

let dataProvider;
let gridView;

const Styles = {
  BoxTitle: {
    backgroundColor: '#fccf76',
    color: '#163971',
    fontWeight: 600,
    fontSize: '12px',
    width: '100%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
};

export default injectSheet(Styles)(ApprovalLine);
