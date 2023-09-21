import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

const SupplyItemHeaderList = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridHeader(gridView, dataProvider, props.GridFields, props.GridColumns, 30, fOnCurrentrowChanged, fOnCellClicked, fKeyConfig, props.GridTitle);
    gridView.setRowIndicator({ visible: false });
    // gridView.setCheckBar({ visible: true });
    gridView.displayOptions.rowHeight = 25;
    // gridView.displayOptions.fitStyle = 'none';
    gridView.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'isSelected') === 'Y') return 'rg-column-color-2';
      if (grid.getValue(item.index, 'Clstype') === '완료') return 'rg-column-color-3';
      if (grid.getValue(item.index, 'Clstype') === '보류') return 'rg-column-color-3';
    });
    gridView.onCellDblClicked = function (grid, clickData) {
      const clickedRow = dataProvider.getJsonRow(clickData.dataRow);
      props.DoubleClicked(clickedRow, clickData.dataRow);
    };

    props.DataProviderBind(dataProvider);
    props.GridViewBind(gridView);
  };

  const fOnCurrentrowChanged = async (grid, oldrow, newrow) => {
    if (newrow >= 0) {
      props.RowChanged(grid, newrow);
    }
  };

  const fOnCellClicked = (grid, index) => {
    if (props.currentIndex.current === index.dataRow && index.dataRow >= 0) {
      props.RowChanged(grid, index.dataRow);
    }
  };

  const fKeyConfig = async (grid, event) => {
    const clickData = gridView.getCurrent();
    const clickedRow = dataProvider.getJsonRow(clickData.dataRow);
    switch (event.key) {
      case 'Enter':
        props.DoubleClicked(clickedRow, clickData.dataRow);
        break;
      case 'Tab':
        props.TabKey();
        break;
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

  return (
    <>
      <Box ref={refGrid} key={props.Util.Common.fMakeId(props.id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '100%', height: props.Height }} />
    </>
  );
});

let dataProvider, gridView;

export default SupplyItemHeaderList;
