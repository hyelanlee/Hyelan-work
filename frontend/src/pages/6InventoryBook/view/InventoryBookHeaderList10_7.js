import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

// 재고장 - 상품, 제품, 반제품 - 출고요청내역 // 원재료, 단조 - 외주발주내역
const InventoryBookHeaderList107 = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridHeader(gridView, dataProvider, props.GridFields, props.GridColumns, '', '', '', fKeyConfig, props.GridTitle);
    gridView.displayOptions.rowHeight = 25;
    gridView.setCheckBar({ visible: false });
    gridView.setDisplayOptions({ fitStyle: 'none' });
    gridView.setRowIndicator({ visible: true });

    props.DataProviderBinder(dataProvider, '10_7');
    props.GridViewBind(gridView, '10_7');
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

export default InventoryBookHeaderList107;
