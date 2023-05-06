import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import injectSheet from 'react-jss';
import { Box } from '@material-ui/core';
import { LinkButton } from 'rc-easyui';
import { RiFileUploadLine } from 'react-icons/ri';
import Attachments from '@components/common/Attachments/Attachments';

const ApprovalAttachments = observer(({ classes, PGMID, FileType, FileNo, IsRevision, RevNo, FilePath, AttachmentsKeyName }) => {
  const [attachView, setAttachView] = useState(false);

  const fClick = () => {
    setAttachView(true);
  };

  const fAttachClose = () => {
    setAttachView(false);
  };

  return (
    <>
      <Box style={{ width: '95%', height: 50, marginLeft: 10, marginTop: 10 }}>
        <LinkButton style={{ width: '100%', color: '#424242', borderRadius: 3, background: '#a9cff9' }} onClick={fClick}>
          <Box style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RiFileUploadLine size={18} />
            <Box className={classes.Box1}>첨부파일</Box>
          </Box>
        </LinkButton>
      </Box>
      {attachView && <Attachments PGMID={PGMID} FileTitle={AttachmentsKeyName} FileType={FileType} FileNo={FileNo} IsRevision={IsRevision} RevNo={RevNo} FilePath={FilePath} setClose={fAttachClose} />}
    </>
  );
});

const Styles = {
  Box1: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
  },
  Box2: {
    width: 150,
    height: 25,
    marginTop: 20,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'center',
    },
  },
  BoxTitle: {
    backgroundColor: '#fccf76',
    color: '#163971',
    fontWeight: 600,
    fontSize: '12px',
    width: '100%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  Button1: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
    marginLeft: 5,
  },
};

export default injectSheet(Styles)(ApprovalAttachments);
