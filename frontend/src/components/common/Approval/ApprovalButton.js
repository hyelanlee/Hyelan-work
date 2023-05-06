import React from 'react';
import { observer } from 'mobx-react-lite';
import { LinkButton } from 'rc-easyui';
import injectSheet from 'react-jss';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { Box } from '@material-ui/core';

const ApprovalButton = observer(
  ({
    classes,
    ApprovalDisabled,
    ApprovalCancelDisabled,
    ApprovalRemarkDisabled,
    ApprovalReturnDisabled,
    onClickApproval,
    onClickApprovalCancel,
    onClickApprovalRemark,
    onClickApprovalReturn,
    isReturnButton,
  }) => {
    return (
      <>
        <Box style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LinkButton style={{ width: isReturnButton ? 90 : 100, color: '#424242', borderRadius: 3, marginRight: isReturnButton ? 5 : 15 }} disabled={ApprovalDisabled} onClick={onClickApproval}>
            <Box style={{ width: isReturnButton ? 90 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAngleLeft size={18} />
              <Box className={classes.Box1}>결재상신</Box>
              <FaAngleRight size={18} />
            </Box>
          </LinkButton>
          <LinkButton
            style={{ width: isReturnButton ? 90 : 100, color: '#424242', borderRadius: 3, marginRight: isReturnButton ? 5 : 15 }}
            disabled={ApprovalCancelDisabled}
            onClick={onClickApprovalCancel}
          >
            <Box style={{ width: isReturnButton ? 90 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAngleLeft size={18} />
              <Box className={classes.Box1}>상신취소</Box>
              <FaAngleRight size={18} />
            </Box>
          </LinkButton>
          {isReturnButton && (
            <LinkButton
              style={{ width: isReturnButton ? 90 : 100, color: '#424242', borderRadius: 3, marginRight: isReturnButton ? 5 : 15 }}
              disabled={ApprovalReturnDisabled}
              onClick={onClickApprovalReturn}
            >
              <Box style={{ width: isReturnButton ? 90 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaAngleLeft size={18} />
                <Box className={classes.Box1}>반려</Box>
                <FaAngleRight size={18} />
              </Box>
            </LinkButton>
          )}
          <LinkButton style={{ width: isReturnButton ? 90 : 100, color: '#424242', borderRadius: 3 }} disabled={ApprovalRemarkDisabled} onClick={onClickApprovalRemark}>
            <Box style={{ width: isReturnButton ? 90 : 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaAngleLeft size={18} />
              <Box className={classes.Box1}>첨언보기</Box>
              <FaAngleRight size={18} />
            </Box>
          </LinkButton>
        </Box>
      </>
    );
  },
);

const Styles = {
  Box1: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
  },
};

export default injectSheet(Styles)(ApprovalButton);
