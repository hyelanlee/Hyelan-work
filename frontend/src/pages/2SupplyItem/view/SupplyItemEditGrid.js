import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';
import axios from 'axios';
import * as Presenter from '../presenter/SupplyItemPresenter';
import SupplyItemState from './SupplyItemState';

const SupplyItemEditGrid = observer((props) => {
  const { setAlert } = SupplyItemState();
  const refGrid = useRef(null);

  const [MenuStore] = useState({
    setAlert: setAlert,
  });

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    provider = new LocalDataProvider(false);
    view = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(view, provider, props.GridFields, props.GridColumns, onCellButtonClicked, onCellEdited, fKeyConfig);
    view.setRowIndicator({ visible: false });
    view.setFooters({ visible: true });
    view.setDisplayOptions({ fitStyle: 'fill', rowHeight: 25 });
    view.setCheckBar({ visible: true });
    view.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'DelvGuid') !== '' && grid.getValue(item.index, 'DelvGuid') !== undefined) return 'rg-column-color-1';
    });

    props.DataProviderBind(provider);
    props.GridViewBind(view);

    view.onShowEditor = function (grid, index) {
      if (index.column === 'RealWeight' && provider.getValue(index.dataRow, 'UnitNm') !== 'M') return false;
    };

    view.onCellDblClicked = function () {
      fCellDblClicked();
    };

    // view.columnByField('Su').styleCallback = CellStyleCallback1;
    // view.columnByField('Qty').styleCallback = CellStyleCallback2;

    view.setCheckableExpression("values['DelvGuid'] = ''", true);
  };

  const fCellDblClicked = () => {
    const { dataRow: i } = view.getCurrent();
    if (i === -1) return;
    const clickedRow = provider.getJsonRow(i);
    props.DoubleClicked(clickedRow, i);
    if (provider.getRowState(i) === 'created') {
      provider.removeRow(i);
      const Grid2Data = provider.getJsonRows();
      for (let i = 1; i < Grid2Data.length + 1; i++) {
        provider.setValue(i - 1, 'No', i.toString().padStart(3, '0'));
      }
    }
  };

  const onCellButtonClicked = async () => {};

  const onCellEdited = async (grid) => {
    grid.commit();
    const { column, dataRow: i } = grid.getCurrent();
    const value = grid.getValue(i, column);
    const price = provider.getValue(i, 'Price');

    if (value) {
      if (column === 'NapQty') {
        if (provider.getValue(i, 'UnitNm') === 'M') {
          const goodCd = provider.getValue(i, 'GoodCd');
          const returnValue = await Presenter.fConvert(MenuStore, value, 'Kg', goodCd);
          provider.setValue(i, 'Qty', returnValue);
          provider.setValue(i, 'Su', value);
          provider.setValue(i, 'Amount', Math.round(price * returnValue));
          const returnMiNap = await fCalculateMiNap(i, value, returnValue);
          provider.setValue(i, 'MiNapQty', returnMiNap[0].CurrentMiSu);
        } else {
          provider.setValue(i, 'Amount', Math.round(value * price));
          provider.setValue(i, 'Qty', value);
          provider.setValue(i, 'Su', 0);
          const returnMiNap = await fCalculateMiNap(i, 0, value);
          provider.setValue(i, 'MiNapQty', returnMiNap[0].CurrentMiQty);
        }
      }
    }
  };

  const fCalculateMiNap = async (index, SuValue, QtyValue) => {
    const BalNo = provider.getValue(index, 'BalNo');
    const BalSeq = provider.getValue(index, 'BalSeq');
    const SupNo = provider.getValue(index, 'SupNo');
    try {
      const result = await axios.get('@api/supply/supplyItem/calculateMiNap', {
        params: { CustCd: props.CustCd, BalNo: BalNo, BalSeq: BalSeq, SupNo: SupNo, SuValue: SuValue, QtyValue: QtyValue },
      });
      return result.data;
    } catch (e) {
      props.Util.setAlert({ visible: true, desc: '미납량 계산 중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fKeyConfig = async (grid, e) => {
    switch (e.key) {
      case 'Escape':
        fCellDblClicked();
        break;
      case 'Tab':
        e.preventDefault();
        props.TabKey();
        break;
    }
  };

  // const CellStyleCallback1 = (grid, dataCell) => {
  //   if (grid.getValue(dataCell.index.itemIndex, 'UnitNm') === 'M') {
  //     return 'rg-text-red-color right-column';
  //   }
  // };

  // function CellStyleCallback2(grid, dataCell) {
  //   if (grid.getValue(dataCell.index.itemIndex, 'UnitNm') !== 'M') {
  //     return 'rg-text-red-color right-column';
  //   }
  // }

  useEffect(() => {
    fInitGrid();
  }, []);

  return (
    <>
      <Box ref={refGrid} key={props.Util.Common.fMakeId(props.Id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '99.99999%', height: 336 }} />
    </>
  );
});

let provider, view;

export default SupplyItemEditGrid;
