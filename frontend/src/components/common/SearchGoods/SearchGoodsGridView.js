import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { Utility } from '@components/common/Utility/Utility';
import { GridView, LocalDataProvider } from 'realgrid';
import injectSheet from 'react-jss';
import { GridColumns1, GridFields1 } from './SearchGoodsGrid';

const SearchGoodsGridView = observer(({ classes, PGMID, Init, dataVO }) => {
  const refGrid1 = useRef(null);
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);

  const fInitGrid = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid00'));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid1.current);
    Util.Grid.fInitGridHeader(gridView, dataProvider, GridFields1, GridColumns1, 30);
    gridView.setDisplayOptions({ fitStyle: 'none' });
  };

  const fSearch = async () => {
    const paramVO = { dataVO };

    try {
      await Util.Command.fSearch(dataProvider, '/@api/common/searchgoods/selectByList', paramVO, 'asdasd');
    } catch (error) {
      setAlert({ visible: true, desc: `조회 중 오류가 발생하였습니다..${error}` });
    }
  };

  useEffect(() => {
    fInitGrid();
  }, []);

  useEffect(() => {
    fSearch();
  }, []);

  return (
    <>
      <Box ref={refGrid1} id={Util.Common.fMakeId('Grid00')} style={{ width: '100%', height: 410 }} />
    </>
  );
});

let dataProvider;
let gridView;

const Styles = {
  BoxTitle: {
    backgroundColor: '#fccf76',
    color: '#163971',
    fontWeight: 600,
    fontSize: '12px',
    width: '100%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
  },
};

export default injectSheet(Styles)(SearchGoodsGridView);
