import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';
import { GridLayout1_2 } from './InventoryBookGrid';

// 구매발주내역(전체)
const InventoryBookHeaderList2 = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(gridView, dataProvider, props.GridFields, props.GridColumns, fOnCurrentrowChanged, fOnCellClicked, fKeyConfig);
    gridView.displayOptions.rowHeight = 25;
    gridView.setCheckBar({ visible: false });
    gridView.setColumnLayout(GridLayout1_2);
    gridView.setFooters({ visible: true });
    gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridView.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'clstype') === '4') return 'rg-text-pink-color';
      if (grid.getValue(item.index, 'clstype') === '2') return 'rg-text-blue-color-weight600';
    });

    props.DataProviderBinder(dataProvider, '2');
    props.GridViewBind(gridView, '2');
  };

  const fOnCurrentrowChanged = async (grid, oldrow, newrow) => {
    if (newrow >= 0) {
      props.RowChanged(grid, newrow, '2');
    }
  };

  const fOnCellClicked = (grid, index) => {
    if (props.currentIndex.current === index.dataRow && index.dataRow <= 0) {
      props.RowChanged(grid, index.dataRow, '2');
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

export default InventoryBookHeaderList2;
