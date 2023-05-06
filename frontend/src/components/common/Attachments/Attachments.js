import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog, LinkButton } from 'rc-easyui';
import axios from 'axios';
import { Box } from '@material-ui/core';
import imgKsMark from '@assets/images/img_ks_mark.png';
import useStores from '@stores/useStores';
import AttachmentsStatus from '@components/common/Attachments/AttachmentsStatus';
import Alert from '@components/common/Alert';
import { Utility } from '@components/common/Utility/Utility';
import AttachmentsList from './AttachmentsList';

const Attachments = observer(({ PGMID, FileTitle, FileType, FileNo, RevNo, FilePath, IsRevision, setClose }) => {
  const PGMID_ATTACHMENTS = PGMID + '_ATTACHMENTS';
  const { $UserStore } = useStores();
  const refDataSource = useRef(null);

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);

  const [attachVO, setAttachVO] = useState({
    Retrieve: false,
  });

  const header = () => {
    return (
      <Box key="Attach" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ marginLeft: 5, width: 27 }} />
        <pre disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          첨부파일
        </pre>
      </Box>
    );
  };

  const fUploadFile = async (files) => {
    if (!files) {
      return;
    }

    files.forEach(async (file) => {
      if (Util.Common.fValidate(!FileNo, '신규 자료는 저장 후 첨부파일을 등록해 주세요.')) {
        return;
      }

      if (file.name.length > 76) {
        setAlert({ visible: true, desc: '파일명이 너무 깁니다. 파일명을 변경하여 주세요.', type: 'W' });
        return;
      }

      let formData = new FormData();

      if (files.length > 0) {
        formData.append('file', file);
      }

      try {
        const result = await axios.post('/@api/common/attachments/insertByFile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { upath: FilePath },
        });
        const rdata = result.data;

        const fileName = rdata.find((item) => {
          return item.originalname === file.name;
        }).filename;

        const paramVO = {};
        paramVO.FileType = FileType;
        paramVO.FileNo = FileNo;
        paramVO.RevNo = IsRevision ? RevNo : 0;
        paramVO.FilePath = FilePath;
        paramVO.FileName = fileName;
        paramVO.OriginalName = file.name;
        paramVO.FileSize = file.size;
        paramVO.UserPno = $UserStore.user.userid;
        paramVO.Factory = $UserStore.user.factory;

        const result2 = await axios.post('/@api/common/attachments/insertByAttachments', {
          data: paramVO,
        });
        const rdata2 = result2.data;

        if (rdata2.errmess === '') {
          setTimeout(() => {
            Util.Common.fFieldChange(setAttachVO, 'Retrieve', !attachVO.Retrieve);
          }, 50);
        } else {
          setAlert({ visible: true, desc: rdata2.errmess, type: 'W' });
        }
      } catch (error) {
        setAlert({ visible: true, desc: '첨부파일 등록중 오류가 발생하였습니다.', type: 'E' });
      }
    });
  };

  const fDownloadAllFile = () => {
    if (!refDataSource.current) {
      return;
    }

    refDataSource.current.getJsonRows().forEach((item) => {
      var downElement = document.createElement('a');
      downElement.download = item.OriginalFileName;
      downElement.href = Util.Common.fGetFilePath(item.FilePath) + '/' + item.FileName;
      downElement.click();
    });
  };

  const fGetDataSource = (provider) => {
    if (provider != undefined && provider != null) {
      refDataSource.current = provider;
    }
  };

  const fClose = () => {
    setClose();
  };

  return (
    <>
      <Dialog header={header} style={{ width: 800, height: 400 }} closable={false} modal>
        <Box style={{ height: 309 }}>
          <AttachmentsStatus
            PGMID={PGMID_ATTACHMENTS}
            FileTitle={FileTitle}
            FileType={FileType}
            FileNo={FileNo}
            IsRevision={IsRevision}
            RevNo={IsRevision ? RevNo : 0}
            onUploadFile={fUploadFile}
            onDownloadFile={fDownloadAllFile}
          />
          <AttachmentsList PGMID={PGMID_ATTACHMENTS} FileType={FileType} FileNo={FileNo} RevNo={IsRevision ? RevNo : 0} Retrieve={attachVO.Retrieve} GetDataSource={fGetDataSource} />
        </Box>
        <Box className="dialog-button">
          <LinkButton style={{ width: 80 }} onClick={fClose}>
            닫기
          </LinkButton>
        </Box>
      </Dialog>
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

export default Attachments;
