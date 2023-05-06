import React, { useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton } from 'rc-easyui';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { createUseStyles } from 'react-jss';
import imgKsMark from '@assets/images/img_ks_mark.png';

const Confirm = ({ visible, description, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }) => {
  const classes = Styles();
  const refCancel = useRef(null);
  const refConfirm = useRef(null);

  useEffect(() => {
    if (visible) {
      refCancel.current.focus();
      let mask = document.getElementsByClassName('window-mask');
      mask[mask.length - 1].style = 'z-index: 99998';
    }
  }, [visible]);

  const keyEvent = (e, field) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (field === 'confirm') refCancel.current.focus();
      else if (field === 'cancel') refConfirm.current.focus();
    }
  };

  if (!visible) return null;
  return (
    <Dialog title={<img src={imgKsMark} alt="logo" style={{ width: '27px' }} />} style={{ minWidth: '400px' }} bodyCls="f-column" closable={false} modal className={classes.S1}>
      <Box className="f-full">
        <PerfectScrollbar style={{ minHeight: '150px', maxHeight: '200px' }}>
          <Box style={{ margin: '10px', fontSize: '16px' }}>
            <pre>{description}</pre>
          </Box>
        </PerfectScrollbar>
      </Box>
      <Box className="dialog-button" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
        <Box
          onKeyDown={(e) => {
            keyEvent(e, 'confirm');
          }}
        >
          <LinkButton ref={refConfirm} style={{ width: '80px' }} className="c6" onClick={onConfirm}>
            {confirmText}
          </LinkButton>
        </Box>
        <Box
          onKeyDown={(e) => {
            keyEvent(e, 'cancel');
          }}
        >
          <LinkButton ref={refCancel} style={{ width: '80px' }} onClick={onCancel}>
            {cancelText}
          </LinkButton>
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

export default Confirm;
