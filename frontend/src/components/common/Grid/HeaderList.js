import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';
import moment from 'moment';

const HeaderList = observer((props) => {
  const refGrid = useRef(null);

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    props.Util.Grid.fInitGridHeader(gridView, dataProvider, props.GridFields, props.GridColumns, 27, onCurrentRowChanged, onCellClicked, undefined, props.GridTitle);

    if (props.isCheckOption) {
      gridView.setContextMenu([
        {
          label: '엑셀 다운로드',
        },
        {
          label: '전체체크',
        },
        {
          label: '체크해제',
        },
      ]);
    } else {
      gridView.setContextMenu([
        {
          label: '엑셀 다운로드',
        },
      ]);
    }

    gridView.onContextMenuPopup = (grid, x, y, elementName) => {
      elementName.cellType === 'data';
    };

    gridView.onContextMenuItemClicked = async (grid, label, column) => {
      const labelTitle = label.label;

      if (labelTitle === '엑셀 다운로드') {
        if (dataProvider.getRowCount()) {
          gridView.exportGrid({
            compatibility: true,
            type: 'excel',
            target: 'local',
            applyDynamicStyles: true,
            fileName: `${props.excelTitle}_${moment(new Date()).format('YYYYMMDD')}.xlsx`,
          });
        }
      } else if (labelTitle === '전체체크') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'Y');
          });
        }
      } else if (labelTitle === '체크해제') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'N');
          });
        }
      }
    };

    props.DataProviderBind(dataProvider);
    props.GridViewBind(gridView);
  };

  const onCurrentRowChanged = (grid, oldrow, newrow) => {
    if (newrow >= 0) {
      if (!props.RowChanged) {
        return;
      }
      props.RowChanged(grid, newrow);
    }
  };

  const onCellClicked = (grid, index) => {
    if (props.currentIndex.current === index.dataRow && index.dataRow >= 0) {
      if (!props.RowChanged) {
        return;
      }
      props.RowChanged(grid, index.dataRow);
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

  return (
    <>
      <Box ref={refGrid} key={props.Util.Common.fMakeId(props.Id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '100%', height: props.Height }} />
    </>
  );
});

let dataProvider, gridView;

export default HeaderList;
