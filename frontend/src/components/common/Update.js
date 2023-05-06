import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton } from 'rc-easyui';
import { createUseStyles } from 'react-jss';
import imgKsMark from '@assets/images/img_ks_mark.png';

const Update = ({ data, onConfirm, onCancel }) => {
  const classes = Styles();

  useEffect(() => {
    if (data.visible) {
      let mask = document.getElementsByClassName('window-mask');
      mask[mask.length - 1].style = 'z-index: 999998';
    }
  }, [data.visible]);

  if (!data.visible) return null;
  return (
    <Dialog title={<img src={imgKsMark} alt="logo" style={{ width: '27px' }} />} style={{ width: '400px' }} bodyCls="f-column" closable={false} modal className={classes.S1}>
      <Box className="f-full" style={{ backgroundColor: '#ff5555', padding: '15px' }}>
        <Box style={{ marginTop: '3px', fontSize: '20px', color: '#fff' }}>사이트 업데이트 안내</Box>
        <Box style={{ marginTop: '10px', fontSize: '15px', color: '#fff' }}>웹사이트가 업데이트 되었습니다.</Box>
        <Box style={{ marginTop: '5px', fontSize: '15px', color: '#fff' }}>현재버전 : {data.currentVer}</Box>
        <Box style={{ marginTop: '5px', fontSize: '15px', color: '#fff' }}>신규버전 : {data.latestVer}</Box>
        <Box style={{ marginTop: '8px', fontSize: '15px', color: '#fff' }}>아래 새로고침을 눌러 사이트를 다시 로드 하세요.</Box>
        <Box style={{ marginTop: '8px', fontSize: '15px', color: '#fff' }}>주의) 새로고침 시 작업중이던 내용은 소실 됩니다.</Box>
      </Box>
      <Box className="dialog-button">
        <LinkButton style={{ width: '80px' }} className="c11" onClick={onConfirm}>
          새로고침
        </LinkButton>
        <LinkButton style={{ width: '80px' }} onClick={onCancel}>
          닫기
        </LinkButton>
      </Box>
    </Dialog>
  );
};

const Styles = createUseStyles({
  S1: {
    zIndex: '999999 !important',
  },
});

export default Update;
