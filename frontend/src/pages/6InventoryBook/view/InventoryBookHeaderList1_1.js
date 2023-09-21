import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

// 재고장 - 상품, 제품, 반제품
const InventoryBookHeaderList11 = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(gridView, dataProvider, props.GridFields, props.GridColumns, '', '', fKeyConfig);
    gridView.displayOptions.rowHeight = 25;
    gridView.setCheckBar({ visible: false });
    gridView.setFooters({ visible: true });

    props.DataProviderBinder(dataProvider, '1_1');
    props.GridViewBind(gridView, '1_1');

    gridView.onCurrentRowChanged = function (grid, oldrow, newrow) {
      if (newrow >= 0) {
        props.RowChanged(grid, newrow);
      }
    };

    gridView.onCellClicked = function (grid, index) {
      if (props.currentIndex.current.상품 === index.dataRow && index.dataRow >= 0) {
        props.RowChanged(grid, index.dataRow);
      }
    };

    gridView.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'Possqty') < 0) return 'rg-column-color-1';
      // if (grid.getValue(item.index, 'SafeStock') > 0) return 'rg-column-color-3';
    });
  };

  const fKeyConfig = async (grid, e) => {
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        document.getElementById(props.Util.Common.fMakeId('ReferenceDate')).focus();
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

export default InventoryBookHeaderList11;
