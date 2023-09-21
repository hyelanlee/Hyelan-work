import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

const OrderToDelvHeaderGrid = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridHeader(gridView, dataProvider, props.GridFields, props.GridColumns, 30, fOnCurrentrowChanged, fOnCellClicked, fKeyConfig, props.GridTitle);
    gridView.setCheckBar({ visible: true });
    gridView.setDisplayOptions({ fitStyle: 'none', rowHeight: 25 });
    gridView.setFooters({ visible: true });

    props.DataProviderBind(dataProvider);
    props.GridViewBind(gridView);

    // gridView.setCheckableExpression("values['DelvNo'] = ''", true);
    gridView.setCheckableCallback(f);
  };

  const f = function(dataSource, item) {
    if (dataProvider.getValue(item._dataRow, 'Qcyn') === '검사완료' && dataProvider.getValue(item._dataRow, 'DelvNo') === '' )
    return true;
  }

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

  const fKeyConfig = async (grid, event) => {};

  useEffect(() => {
    fInitGrid();
  }, []);

  return <Box ref={refGrid} key={props.Util.Common.fMakeId(props.id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '100%', height: 350 }} />;
});

let dataProvider, gridView;

export default OrderToDelvHeaderGrid;
