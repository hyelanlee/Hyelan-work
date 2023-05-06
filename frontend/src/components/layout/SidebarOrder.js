import React from 'react';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import 'moment/locale/ko';
import { Box } from '@material-ui/core';
import { Panel } from 'rc-easyui';

const SidebarOrder = observer(() => {
  const classes = Styles();
  return (
    <>
      <Panel showHeader={false} bodyStyle={{ padding: 3 }} className={classes.S1}>
        <Box className={classes.S2}>거래처 사용자</Box>
      </Panel>
    </>
  );
});

const Styles = createUseStyles({
  S1: {
    '& .panel-body': {
      borderRightWidth: '0px',
    },
    height: 890,
  },
  S2: {
    width: 212,
    height: 25,
    color: '#1f1f1f',
    fontWeight: 500,
    textAlign: 'center',
    background: 'linear-gradient(to bottom,#e0ecff 0,#c1d9fe 100%)',
  },
});

export default SidebarOrder;
