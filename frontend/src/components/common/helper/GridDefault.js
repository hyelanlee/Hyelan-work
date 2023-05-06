import React, { useEffect, useState } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { GridView, LocalDataProvider } from 'realgrid';
import CodeclassConfirm from '@components/common/CodeclassConfirm';

const GridDefault = observer(({ inputId, iGridOpions, iFields, iColumns, iGridRows, onConfirmEvent, onCancelEvent, gridStyle }) => {
  const { $CommonStore } = useStores();
  // const [commonVO, setCommonVO] = useState(null);

  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    description: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });

  const fConfirm = () => {
    const selData = $CommonStore.Codeclass.selData;
    let obj = {};
    for (const [key, value] of Object.entries(selData)) {
      const chkCd = ['custoutcd', 'minorcd', 'deptcd', 'pno'];
      const chkNm = ['custnm', 'minornm', 'deptnm', 'name'];
      if (chkCd.indexOf(key) > -1) {
        obj = { ...obj, ...{ ['minorcd']: value.trim() } };
      }

      if (chkNm.indexOf(key) > -1) {
        obj = { ...obj, ...{ ['minornm']: value.trim() } };
      }
    }
    // setCommonVO(obj);
    setCodeClassInputs({ visible: false });
  };

  const fCancel = () => {
    document.getElementById(codeClassInputs.id).focus();

    setCodeClassInputs({ visible: false });
  };

  const fInitGrid = () => {
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(inputId);
    gridView.setDataSource(dataProvider);
    dataProvider.setFields(iFields);
    gridView.setColumns(iColumns);

    if (iGridOpions) {
      gridView.setCheckBar({
        visible: iGridOpions.checkBar,
      });

      gridView.setStateBar({
        visible: iGridOpions.stateBar,
      });

      gridView.setRowIndicator({
        visible: iGridOpions.rowIndicator,
      });

      if (iGridOpions.selOptions) {
        gridView.setSelection({ style: iGridOpions.selOptions.setStyle }); // row
        gridView.displayOptions.selectionStyle = iGridOpions.selOptions.selectionStyle; //singleRow
        gridView.setEditOptions({
          editable: iGridOpions.selOptions.editable, // editable: false
          appendable: iGridOpions.selOptions.appendable, // appendable: false
        });
      }
    }
    gridView.footers.visible = iGridOpions.footersVisible;
    gridView.displayOptions.columnMovable = iGridOpions.columnMovable;

    //   gridView.setRowStyleCallback((grid, item) => {
    //     const data = dataProvider.getJsonRow(item.index);
    //     let PmsOrderProgressYN = data.PmsOrderProgressYN;
    //     if (PmsOrderProgressYN === iGridOpions.setRowColor.PmsOrderProgressYN) {
    //       return iGridOpions.setRowColor.returnValue;
    //     }
    //   });
  };

  useEffect(() => {
    fInitGrid();
  }, [inputId]);

  useEffect(() => {
    if (dataProvider) {
      dataProvider.setRows(iGridRows);
    }
  }, [iGridRows]);

  return (
    <>
      <CodeclassConfirm
        visible={codeClassInputs.visible}
        description={codeClassInputs.desc}
        value={codeClassInputs.value}
        datas={codeClassInputs.datas}
        id={codeClassInputs.id}
        viewId={codeClassInputs.viewId}
        selectedData={codeClassInputs.selectedData}
        onConfirm={onConfirmEvent}
        onCancel={onCancelEvent}
        setVisibleData={fConfirm}
        setVisibleCancel={fCancel}
      />
      <Box id={inputId} style={gridStyle} />
    </>
  );
});

let dataProvider;
let gridView;

export default GridDefault;
