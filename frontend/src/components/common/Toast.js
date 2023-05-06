import React, { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { Dialog } from 'rc-easyui';
import { createUseStyles } from 'react-jss';

const Toast = ({ visible, description, type = 'N', onConfirm }) => {
  const classes = Styles();
  const refTimeout = useRef(null);

  const fGetStyle = () => {
    let result = {};
    if (type === 'W') {
      result = {
        width: 450,
        height: 100,
        background: 'linear-gradient(to bottom,#fccf76 0,#fec85b 20%)',
        borderColor: '#faad12',
      };
    } else if (type === 'E') {
      result = {
        width: 450,
        height: 100,
        background: 'linear-gradient(to bottom,#f5b6b6 0,#f29c9c 20%)',
        borderColor: '#f86868',
      };
    } else {
      result = {
        width: 450,
        height: 100,
      };
    }
    return result;
  };

  const fConfirm = () => {
    clearTimeout(refTimeout.current);
    onConfirm();
  };

  useEffect(() => {
    if (visible) {
      refTimeout.current = setTimeout(() => {
        onConfirm();
      }, 2500);
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Dialog style={fGetStyle()} bodyCls="f-column" closable={false} modal={false} className={classes.S1}>
      <Box className="f-full" onClick={fConfirm} style={{ backgroundColor: '#fff' }}>
        <Box style={{ width: '100%', height: '100%', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <pre>{description}</pre>
        </Box>
      </Box>
    </Dialog>
  );
};

const Styles = createUseStyles({
  S1: {
    zIndex: '99999 !important',
  },
});

export default Toast;
