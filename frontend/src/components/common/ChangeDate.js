import React, { useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton, DateBox } from 'rc-easyui';
import { createUseStyles } from 'react-jss';
import useStores from '@stores/useStores';
import imgKsMark from '@assets/images/img_ks_mark.png';
import imgCalendar from '@assets/images/img_calendar.png';

const ChangeDate = ({ visible, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }) => {
  const { $CommonStore } = useStores();
  const classes = Styles();
  const refCancel = useRef(null);
  const refConfirm = useRef(null);

  useEffect(() => {
    if (visible) {
      refCancel.current.focus();
    }
  }, [visible]);

  const keyEvent = (e, field) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (field === 'confirm') refCancel.current.focus();
      else if (field === 'cancel') refConfirm.current.focus();
    }
  };

  const fHandleChangeDate = (value) => {
    $CommonStore.fSetChangeDate(value);
  };

  const fraDateProps = {
    panelStyle: { width: 250, height: 250 },
    value: $CommonStore.ChangeDate,
    onChange: fHandleChangeDate.bind(this),
    currentText: '오늘',
    closeText: '닫기',
    okText: '확인',
  };

  const header = () => {
    return (
      <Box key="title" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ marginLeft: 5, width: 27 }} />
        <pre disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          자료복사
        </pre>
      </Box>
    );
  };

  if (!visible) return null;
  return (
    <Dialog header={header} style={{ width: '300px', height: '160px' }} bodyCls="f-column" closable={false} modal>
      <Box className="f-full" style={{ display: 'flex', alignItems: 'center' }}>
        <Box style={{ margin: '10px', fontSize: '16px' }}>
          <Box style={{ display: 'flex' }}>
            <Box className={classes.TitleBox}>
              <span className={classes.TitleText}>변경일자</span>
            </Box>
            <Box>
              <DateBox className={classes.DateFont} inputId="ChangeDate" lo="ko" format="yyyy-MM-dd" {...fraDateProps} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="dialog-button" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
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
  TitleBox: {
    margin: '3px 15px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    width: 110,
    fontWeight: 600,
  },
  TitleText: {
    width: 100,
  },
  DateFont: {
    width: 110,
    height: 25,
    '& .textbox-text': {
      fontSize: '12px',
    },
    '& .textbox': {
      fontSize: '12px',
    },
    '& .combo-arrow': {
      backgroundImage: `url(${imgCalendar})`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#ffffff!important',
      height: 12,
    },
    BoxAlignStyle: {
      marginTop: 3,
      display: 'flex',
      alignItems: 'center',
    },
  },
});

export default ChangeDate;
