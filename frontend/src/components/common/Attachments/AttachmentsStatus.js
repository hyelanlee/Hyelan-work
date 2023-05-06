import React from 'react';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { LinkButton, TextBox, FileButton } from 'rc-easyui';
import { ImUpload, ImDownload2 } from 'react-icons/im';
import { Box } from '@material-ui/core';

const AttachmentsStatus = observer(({ FileTitle, FileType, FileNo, RevNo, IsRevision, onUploadFile, onDownloadFile }) => {
  const classes = Styles();

  return (
    <>
      <Box style={{ display: 'flex', alignItems: 'center' }}>
        <Box style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Box style={{ width: '100%', height: 40, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1efea' }}>
            <Box className={classes.DateTitleBox} style={{ marginLeft: 5 }}>
              파일구분
            </Box>
            <TextBox value={FileType} className={classes.TextBox3} disabled />
            <Box className={classes.DateTitleBox2} style={{ marginLeft: 5 }}>
              {FileTitle}
            </Box>
            <TextBox value={FileNo} className={classes.TextBox4} disabled />
            {IsRevision && (
              <Box style={{ display: 'flex' }}>
                <Box className={classes.DateTitleBox} style={{ marginLeft: 5 }}>
                  리비전 번호
                </Box>
                <TextBox value={RevNo} className={classes.TextBox3} disabled />
              </Box>
            )}
            <FileButton
              style={{ width: 110, height: 23, borderRadius: 3, marginLeft: IsRevision === true ? 20 : 150 }}
              onSelect={(file) => onUploadFile(file)}
              multiple
              onClick={(event) => {
                event.target.value = null;
              }}
            >
              <Box style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImUpload size={18} />
                <Box style={{ marginLeft: 5, fontSize: 12, paddingBottom: 2, fontWeight: 500 }}> 파일 업로드</Box>
              </Box>
            </FileButton>
            <LinkButton style={{ width: 110, height: 23, color: '#424242', borderRadius: 3, marginLeft: 10 }} onClick={onDownloadFile}>
              <Box style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ImDownload2 size={18} />
                <Box style={{ marginLeft: 5, fontSize: 12, paddingBottom: 2, fontWeight: 500 }}> 전체 다운로드</Box>
              </Box>
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </>
  );
});

const StylesMain = {
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
  Box: {
    marginLeft: 10,
    marginTop: 10,
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  TextArea: {
    width: '95%',
    height: 100,
    marginLeft: 10,
    display: 'flex',
    '& .textbox-text ': {
      fontSize: '12px !important',
      backgroundColor: '#e0ffff',
    },
  },
  ButtonText: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
  },
  TextBox1: {
    width: 200,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
  TextBox2: {
    width: 200,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      backgroundColor: '#e0ffff',
    },
  },
  TextBox3: {
    height: 25,
    width: 40,
    marginRight: 5,
    '& input': {
      fontSize: '12px !important',
    },
  },
  TextBox4: {
    height: 25,
    width: 130,
    marginRight: 5,
    '& input': {
      fontSize: '12px !important',
    },
  },
  DateTitleBox: {
    margin: '0px 5px 0px 15px',
    backgroundColor: '#e0ecff',
    padding: 5,
    color: '#163971',
    height: 25,
    fontSize: '12px',
    display: 'flex',
    width: 75,
    alignItems: 'center',
    fontWeight: 600,
  },
  DateTitleBox2: {
    margin: '0px 5px 0px 15px',
    backgroundColor: '#e0ecff',
    padding: 5,
    color: '#163971',
    height: 25,
    fontSize: '12px',
    display: 'flex',
    width: 120,
    alignItems: 'center',
    fontWeight: 600,
  },
};

const Styles = createUseStyles(StylesMain);

export default AttachmentsStatus;
