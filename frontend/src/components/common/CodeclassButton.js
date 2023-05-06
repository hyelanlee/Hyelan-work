import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { LinkButton } from 'rc-easyui';
import { AiFcSearch } from 'react-icons/ai';
// import Hotkeys from 'react-hot-keys';

const CodeclassButton = observer(({ onCode }) => {
  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box display="flex" flexDirection="row">
          <Box style={{ marginLeft: 15 }}>
            {/* <LinkButton iconCls="icon-searchdata" className="c9" style={{ width: 80, height: 30, color: '#424242', borderRadius: 3 }} onClick={onCode}>
              <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2 }}>열기</Box>
            </LinkButton> */}
            <LinkButton className="c9" style={{ width: 80, height: 30, color: '#424242', borderRadius: 3 }} onClick={onCode}>
              <AiFcSearch size={18} />
              <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2 }}>열기</Box>
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default CodeclassButton;
