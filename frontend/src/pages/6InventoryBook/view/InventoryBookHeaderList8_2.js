import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

// 반제품입고내역(보고용) - 기간별집계자료
const InventoryBookHeaderList82 = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(gridView, dataProvider, props.GridFields, props.GridColumns, fOnCurrentrowChanged, fOnCellClicked, fKeyConfig);
    gridView.displayOptions.rowHeight = 25;
    gridView.setCheckBar({ visible: false });
    gridView.setFooters({ visible: true });
    gridView.setRowIndicator({ visible: true, footerText: '' });
    gridView.setEditOptions({ editable: false, appendable: false });

    props.DataProviderBinder(dataProvider, '8_2');
    props.GridViewBind(gridView, '8_2');
  };

  const fOnCurrentrowChanged = async (grid, oldrow, newrow) => {
    if (newrow >= 0) {
      props.RowChanged(grid, newrow, '8_2');
    }
  };

  const fOnCellClicked = (grid, index) => {
    if (props.currentIndex.current === index.dataRow && index.dataRow <= 0) {
      props.RowChanged(grid, index.dataRow, '8_2');
    }
  };

  const fKeyConfig = async (grid, e) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        document.getElementById(props.Util.Common.fMakeId('FrDate')).focus();
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

  return (
    <>
      <Box ref={refGrid} key={props.Util.Common.fMakeId(props.id)} id={props.Util.Common.fMakeId(props.id)} style={{ width: '100%', height: props.Height }} />
    </>
  );
});

let dataProvider, gridView;

export default InventoryBookHeaderList82;
