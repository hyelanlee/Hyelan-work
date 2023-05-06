import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import { Dialog } from 'rc-easyui';
import imgLoading from '@assets/images/img_loading.gif';

const LoadingSpinner = ({ isActive = false }) => {
  const classes = Styles();

  useEffect(() => {
    if (isActive) {
      let mask = document.getElementsByClassName('window-mask');
      mask[mask.length - 1].style = 'z-index: 999998';
    }
  }, [isActive]);

  return (
    <>
      {isActive && (
        <Dialog borderType="none" modal className={classes.S1}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ width: '250px', height: '250px' }}>
            <Box>
              <img src={imgLoading} alt="loading" style={{ width: '220px' }} />
            </Box>
            <Box style={{ fontSize: 18, height: 40 }}>잠시만 기다려 주세요</Box>
          </Box>
        </Dialog>
      )}
    </>
  );
};

const Styles = createUseStyles({
  S1: {
    zIndex: '999999 !important',
  },
});

export default LoadingSpinner;
