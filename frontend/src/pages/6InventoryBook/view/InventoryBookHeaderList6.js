import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

// 발주/외주입고내역(전체)
const InventoryBookHeaderList6 = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(gridView, dataProvider, props.GridFields, props.GridColumns, fOnCurrentrowChanged, fOnCellClicked, fKeyConfig);
    gridView.displayOptions.rowHeight = 25;
    gridView.setCheckBar({ visible: false });
    gridView.setRowIndicator({ visible: true, footerText: '' });
    gridView.setEditOptions({ editable: false, appendable: false });

    props.DataProviderBinder(dataProvider, '6');
    props.GridViewBind(gridView, '6');
  };

  const fOnCurrentrowChanged = async (grid, oldrow, newrow) => {
    if (newrow >= 0) {
      props.RowChanged(grid, newrow, '6');
    }
  };

  const fOnCellClicked = (grid, index) => {
    if (props.currentIndex.current === index.dataRow && index.dataRow <= 0) {
      props.RowChanged(grid, index.dataRow, '6');
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

export default InventoryBookHeaderList6;
