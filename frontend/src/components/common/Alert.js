import React, { useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton } from 'rc-easyui';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { MdError } from 'react-icons/md';
import { createUseStyles } from 'react-jss';
import PerfectScrollbar from 'react-perfect-scrollbar';
import imgKsMark from '@assets/images/img_ks_mark.png';

const Alert = ({ visible, description, type = 'N', confirmText = '확인', onConfirm }) => {
  const classes = Styles();
  const refConfirm = useRef(null);

  const Title = () => {
    if (type === 'W') {
      return (
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
          <MdError size="24" color="#4b4b4b" style={{ paddingBottom: 3 }} />
          <Box style={{ fontSize: 15, fontWeight: 500, marginLeft: 5 }}>경고</Box>
        </Box>
      );
    } else if (type === 'E') {
      return (
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
          <RiAlarmWarningFill size="24" color="#4b4b4b" style={{ paddingBottom: 3 }} />
          <Box style={{ fontSize: 15, fontWeight: 500, marginLeft: 5 }}>오류</Box>
        </Box>
      );
    } else {
      return <img src={imgKsMark} alt="logo" style={{ width: '27px' }} />;
    }
  };

  const fGetStyle = () => {
    let result = {};
    if (type === 'W') {
      result = {
        width: 400,
        height: 220,
        background: 'linear-gradient(to bottom,#fccf76 0,#fec85b 20%)',
        borderColor: '#faad12',
      };
    } else if (type === 'E') {
      result = {
        width: 400,
        height: 220,
        background: 'linear-gradient(to bottom,#f5b6b6 0,#f29c9c 20%)',
        borderColor: '#f86868',
      };
    } else {
      result = {
        width: 400,
        minHeight: 220,
      };
    }
    return result;
  };

  useEffect(() => {
    if (visible) {
      refConfirm.current.focus();
      let mask = document.getElementsByClassName('window-mask');
      mask[mask.length - 1].style = 'z-index: 99998';
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Dialog title={<Title />} style={fGetStyle()} bodyCls="f-column" closable={false} modal className={classes.S1}>
      <Box className="f-full">
        <PerfectScrollbar style={{ minHeight: 130, maxHeight: 130, marginLeft: 10, marginRight: 10 }}>
          <Box style={{ fontSize: '16px' }}>
            <pre style={{ width: 350, whiteSpace: 'pre-wrap' }}>{description}</pre>
          </Box>
        </PerfectScrollbar>
      </Box>
      <Box className="dialog-button">
        <LinkButton ref={refConfirm} style={{ width: '80px' }} className="c6" onClick={onConfirm}>
          {confirmText}
        </LinkButton>
      </Box>
    </Dialog>
  );
};

const Styles = createUseStyles({
  S1: {
    zIndex: '99999 !important',
  },
});

export default Alert;
