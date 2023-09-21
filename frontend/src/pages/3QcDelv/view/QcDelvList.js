import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import useStores from '@stores/useStores';
import { GridView, LocalDataProvider } from 'realgrid';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import * as Presenter from '../presenter/QcDelvPresenter';
import QcDelvState from './QcDelvState';

const QcDelvList = observer((props) => {
  const PGMID = 'QCDELV';
  const { setAlert, codeClassInputs, setCodeClassInputs } = QcDelvState();
  const helperField = ['QcErrorDescNm'];
  const refGrid = useRef(null);

  const { $CommonStore, $UserStore } = useStores();
  const [MenuStore] = useState({
    setAlert: setAlert,
  });

  const fCodeClassConfirm = async () => {
    view.commit(true);
    const clickData = codeClassInputs.selectedData;
    const dataRow = clickData.dataRow;
    const selectedData = $CommonStore.Codeclass.selData;
    const currentRow = provider.getJsonRow(clickData.dataRow);
    if (clickData.column === 'QcErrorDescNm') {
      props.Util.Grid.fSetMultiDataProvider(provider, clickData.dataRow, { QcErrorDescNm: selectedData.minornm.trim(), QcErrorDesc: selectedData.minorcd });
    }
    setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
    view.commit(true);
    view.validateCells();
    view.setFocus();
  };

  const fCodeClassConfirmCancel = () => {
    const Index = view.getCurrent().itemIndex;
    view.setCurrent({ itemIndex: Index, fieldName: view.getCurrent().fieldName });
    view.setFocus();
    view.validateCells();

    setCodeClassInputs({ visible: false });
  };

  const fInitGrid = async () => {
    props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    provider = new LocalDataProvider(false);
    view = new GridView(refGrid.current);
    props.Util.Grid.fInitGridDetail(view, provider, props.GridFields, props.GridColumns, onCellButtonClicked, onCellEdited, fKeyConfig);
    view.setRowIndicator({ visible: true });
    view.setDisplayOptions({ fitStyle: 'fill', rowHeight: 25 });
    view.setCheckBar({ visible: false });
    view.setCheckBar({ visible: true });

    // view.onShowEditor = function (grid, index) {
    //   if (index.column === 'QcErrorQty' && provider.getValue(index.dataRow, 'Complate') === '검사완료') {
    //     return false;
    //   }
    //   if (index.column === 'QcErrorDescNm' && provider.getValue(index.dataRow, 'Complate') === '검사완료') return false;
    // };

    props.DataProviderBind(provider);
    props.GridViewBind(view);

    view.setRowStyleCallback((grid, item) => {
      if (grid.getValue(item.index, 'Complate') === '검사완료') return 'rg-column-color-1';
    });

    // view.setCheckableExpression("values['Complate'] = '미검사'", true);
  };

  const onCellButtonClicked = async (grid, index) => {
    grid.commit();
    props.setGridFocus('D');
    const value = grid.getValue(grid.getCurrent().itemIndex, index.fieldName);
    let codeClassValue = {};

    if (index.fieldName === 'QcErrorDescNm') {
      codeClassValue = await props.Util.Grid.gridCodeClass(grid.getCurrent(), props.Util.CodeHelper.helperIntype, PGMID, value, true);
    }

    setCodeClassInputs(codeClassValue);
  };

  const onCellEdited = async (grid) => {
    grid.commit();
    const { column, dataRow: i } = grid.getCurrent();
    const value = grid.getValue(i, column);

    const napQty = provider.getValue(i, 'NapQty');
    if (column === 'QcErrorQty') {
      if (value < 0) {
        view.setCurrent({ i, column: 'QcErrorQty' });
        props.setAlert({ visible: true, desc: '0보다 작을 수 없습니다.' });
        provider.setValue(i, 'QcErrorQty', napQty);
        return;
      } else if (value > napQty) {
        view.setCurrent({ i, column: 'QcErrorQty' });
        props.setAlert({ visible: true, desc: '불량 수량을 확인하세요.' });
        provider.setValue(i, 'QcErrorQty', 0);
        // provider.setValue(i, 'QcErrorQty', provider.getValue(i, 'NapQty')); //불량수량을 납품량과 같이 설정
        // if (provider.getValue(i, 'UnitNm') === 'M') {
        //   const goodCd = provider.getValue(i, 'GoodCd');
        //   provider.setValue(i, 'Qty', await Presenter.fConvert(MenuStore, napQty, 'Kg', goodCd));
        // }
        // provider.setValue(i, 'Su', napQty);
        // provider.setValue(i, 'QcOkQty', napQty);
        return;
      } else if (provider.getValue(i, 'UnitNm') === 'M') {
        provider.setValue(i, 'Su', napQty - value);
        provider.setValue(i, 'QcOkQty', napQty - value);
        const goodCd = provider.getValue(i, 'GoodCd');
        const returnValue = await Presenter.fConvert(MenuStore, napQty - value, 'Kg', goodCd);
        provider.setValue(i, 'Qty', returnValue);
      } else {
        provider.setValue(i, 'Qty', napQty - value);
        provider.setValue(i, 'QcOkQty', napQty - value);
      }
    }
    if (column === 'QcErrorQty' && value === 0) {
      const goodCd = provider.getValue(i, 'GoodCd');
      const returnValue = await Presenter.fConvert(MenuStore, napQty - value, 'Kg', goodCd);
      provider.setValue(i, 'Qty', returnValue);
      provider.setValue(i, 'QcErrorDescNm', '');
      provider.setValue(i, 'QcErrorDesc', '');
    }
  };

  const fKeyConfig = async (grid, e) => {
    const { fieldName } = grid.getCurrent();
    const index = { fieldName: fieldName };
    switch (e.key) {
      case 'Enter':
        props.setAlert({ visible: false, desc: '' });
        grid.commit(true);
        if (helperField.includes(fieldName)) {
          const { fieldName, itemIndex } = grid.getCurrent();
          const value = grid.getValue(itemIndex, fieldName);
          let codeClassValue = {};
          if (value !== '' && value !== undefined) {
            if (fieldName === 'QcErrorDescNm') {
              codeClassValue = await props.Util.Grid.gridCodeClass(grid.getCurrent(), props.Util.CodeHelper.helperIntype, PGMID, value, false);
              if (!codeClassValue.visible) {
                const selectedData = codeClassValue.res;
                props.Util.Grid.fSetMultiDataProvider(provider, itemIndex, { QcErrorDescNm: selectedData.minornm.trim(), QcErrorDesc: selectedData.minorcd });
              }
            }
            setCodeClassInputs(codeClassValue);
            view.validateCells();
          }
        }
        grid.setFocus();
        break;
      case e.ctrlKey && ' ':
        onCellButtonClicked(grid, index);
        break;
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

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
        onConfirm={fCodeClassConfirm}
        onCancel={() => fCodeClassConfirmCancel({ target: codeClassInputs.id })}
      />
      <Box ref={refGrid} key={props.Util.Common.fMakeId(props.Id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '99.99999%', height: 700 }} />
    </>
  );
});

let provider, view;

export default QcDelvList;
