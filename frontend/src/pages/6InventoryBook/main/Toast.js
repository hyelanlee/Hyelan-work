import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@material-ui/core';
import { Dialog } from 'rc-easyui';
import { createUseStyles } from 'react-jss';

const Toast = ({ visible, description, type = 'N', onConfirm, duration = 3500 }) => {
  const classes = Styles();

  const refTimeout = useRef(null);
  const [opacity, setOpacity] = useState(0);

  const fGetStyle = () => {
    let result = {};
    if (type === 'W') {
      result.background = 'linear-gradient(to bottom,#fccf76 0,#fec85b 20%)';
      result.borderColor = '#faad12';
      result.opacity = opacity;
    } else if (type === 'E') {
      result.background = 'linear-gradient(to bottom,#f5b6b6 0,#f29c9c 20%)';
      result.borderColor = '#f86868';
      result.opacity = opacity;
    } else {
      result.opacity = opacity;
    }
    return result;
  };

  const fConfirm = () => {
    setOpacity(0);
    clearTimeout(refTimeout.current);
    setTimeout(() => {
      onConfirm();
    }, 500); // 애니메이션이 완료된 후에 onConfirm 함수를 호출
  };

  useEffect(() => {
    if (visible) {
      setOpacity(1);
      refTimeout.current = setTimeout(() => {
        fConfirm();
      }, duration); // 일정 시간 후에 fConfirm 함수를 호출하여 토스트 메시지를 감춥니다.
    } else {
      clearTimeout(refTimeout.current); // 토스트 메시지가 사라지기 전에 타임아웃을 클리어합니다.
    }
  }, [visible]);

  if (!visible) return null;
  return (
    <Dialog style={fGetStyle()} bodyCls="f-column" closable={false} modal={false} className={classes.default}>
      <Box className={classes.default} onClick={fConfirm} style={{ width: 300, margin: 'auto' }}>
        <Box style={{ width: '100%', height: '100%', fontSize: '16px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <pre>{description}</pre>
        </Box>
      </Box>
    </Dialog>
  );
};

const Styles = createUseStyles({
  default: {
    width: 450,
    height: 100,
    zIndex: '99999 !important',
    transition: 'opacity 0.5s ease',
  },
});

export default Toast;
