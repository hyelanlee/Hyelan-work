import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { GridView, LocalDataProvider } from 'realgrid';

const OrderToDelvDetailGrid = observer((props) => {
  const refGrid2 = useRef(null);

  const fInitGrid = async () => {
    // props.Util.Grid.fContainerInit(props.Util.Common.fMakeId(props.Id));
    provider = new LocalDataProvider(false);
    view = new GridView(refGrid2.current);
    props.Util.Grid.fInitGridDetail(view, provider, props.GridFields, props.GridColumns, onCellButtonClicked, onCellEdited, fKeyConfig);
    // view.setRowIndicator({ visible: fal });
    view.setStateBar({ visible: false });
    view.displayOptions.rowHeight = 25;
    view.setFooters({ visible: true });
    view.setCheckBar({ visible: false });
    view.displayOptions.fitStyle = 'none';
    props.DataProviderBind(provider);
    props.GridViewBind(view);
  };

  const onCellButtonClicked = () => {};
  const onCellEdited = () => {};
  const fKeyConfig = () => {};

  useEffect(() => {
    fInitGrid();
  }, []);

  return <Box ref={refGrid2} key={props.Util.Common.fMakeId(props.id)} id={props.Util.Common.fMakeId(props.Id)} style={{ width: '100%', height: 375 }} />;
});

let provider, view;

export default OrderToDelvDetailGrid;
