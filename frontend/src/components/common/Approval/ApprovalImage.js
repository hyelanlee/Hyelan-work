import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import injectSheet from 'react-jss';
import axios from 'axios';
import { TextBox, FileButton, LinkButton } from 'rc-easyui';
import { MdImage, MdHideImage, MdFullscreen } from 'react-icons/md';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import { Utility } from '@components/common/Utility/Utility';
import EvidenceViewer from '@components/common/EvidenceViewer';

const ApprovalImage = observer(({ classes, PGMID, ApprovalDocSource, ApprovalDocNo, filepath }) => {
  const { $UserStore } = useStores();

  const refFilePath = useRef('');
  const refImageSeq = useRef(null);

  const [imageVO, setImageVO] = useState({});
  const [popupImage, setPopupImage] = useState(false);
  const [docVO, setDocVO] = useState({});

  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });

  const Util = new Utility(PGMID, setAlert, false, false, true, false, false);

  const fInit = () => {
    refFilePath.current = Util.Common.fGetFilePath(filepath);
    setImageVO({});
  };

  const fFileUpdateChange = async (files) => {
    const fname = files[0].name;

    if (Util.Common.fValidate(!ApprovalDocNo, '신규 자료는 저장 후 이미지를 등록하여 주세요.')) {
      return;
    }

    if (files && fname.length > 76) {
      setAlert({ visible: true, desc: '파일명이 너무 깁니다. 파일명을 변경하여 주세요.', type: 'W' });
      return;
    }

    if (files && !Util.Common.fFileExtensionCheck(fname, ['gif', 'jpg', 'jpeg', 'png'])) {
      setAlert({ visible: true, desc: '허용되는 이미지 확장자 파일이 아닙니다.', type: 'W' });
      return;
    }

    if (files && !Util.Common.fFileSizeCheck(files[0].size, 'MB', 10)) {
      setAlert({ visible: true, desc: '이미지 용량이 10MB를 초과합니다. 이미지를 편집하여 올려주세요.', type: 'W' });
      return;
    }

    let formData = new FormData();

    if (files && files.length > 0) {
      formData.append('file', files[0]);
    }

    try {
      const result = await axios.post('/@api/common/appr/insertByPhotoFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { upath: filepath },
      });
      const rdata = result.data;

      const filePhoto = rdata.find((item) => {
        return item.originalname === fname;
      }).filename;

      const paramVO = {
        DocNo: ApprovalDocNo,
        DocSource: ApprovalDocSource,
        Factory: $UserStore.user.factory,
        Photo: filePhoto,
        Path: filepath,
        UserId: $UserStore.user.userid,
      };

      const result2 = await axios.post('/@api/common/appr/insertByPhoto', {
        data: paramVO,
      });
      const rdata2 = result2.data;

      if (rdata2.errmess === '') {
        setAlert({ visible: true, desc: '등록이 완료되었습니다.' });

        refImageSeq.current = rdata2.rtnSeq;

        setTimeout(() => {
          fGetImageInfo();
        }, 1500);
      } else {
        setAlert({ visible: true, desc: rdata2.errmess, type: 'W' });
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 등록중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fDeleteImage = () => {
    if (Util.Common.fValidate(!imageVO.Seq, '삭제할 이미지가 없습니다.')) {
      return;
    }

    setConfirm({
      visible: true,
      desc: '해당 이미지를 삭제 하시겠습니까?',
      id: 'DELETE_IMAGE',
    });
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });

    if (confirm.id === 'DELETE_IMAGE') {
      fDeleteImageProc();
    }
  };

  const fDeleteImageProc = async () => {
    const restVO = {
      DocSource: ApprovalDocSource,
      DocNo: ApprovalDocNo,
      Factory: $UserStore.user.factory,
      Seq: imageVO.Seq,
      Photo: imageVO.Photo,
      Path: filepath,
      UserId: $UserStore.user.userid,
    };

    try {
      const result = await axios.post('/@api/common/appr/deleteByPhoto', {
        data: restVO,
      });
      const rdata = result.data;

      if (rdata.errmess === '') {
        setAlert({ visible: true, desc: '삭제가 완료되었습니다.' });
        refImageSeq.current = rdata.rtnSeq;
        setTimeout(() => {
          fGetImageInfo();
        }, 1500);
      } else {
        setAlert({ visible: true, desc: rdata.errmess, type: 'W' });
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 삭제중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };

  const fDetailImage = () => {
    if (Util.Common.fValidate(!imageVO.Seq, '크게보기할 이미지가 없습니다.')) {
      return;
    }

    setDocVO({
      DocSource: ApprovalDocSource,
      DocNo: ApprovalDocNo,
      Factory: $UserStore.user.factory,
      Seq: imageVO.Seq,
      FilePath: refFilePath.current,
    });

    setPopupImage(true);
  };

  const fGetImageInfo = async (tag) => {
    if (!refImageSeq.current || !ApprovalDocNo) {
      return;
    }

    const paramVO = {};
    paramVO.Factory = $UserStore.user.factory;
    paramVO.DocSource = ApprovalDocSource;
    paramVO.DocNo = ApprovalDocNo;
    paramVO.Tag = tag;
    paramVO.Seq = refImageSeq.current;

    try {
      const result = await axios.get('/@api/common/appr/selectByImage', {
        params: paramVO,
      });

      const rdata = result.data;

      if (Util.Common.fTrim(rdata.errmess) !== '') {
        setAlert({ visible: true, desc: rdata.errmess });
      } else if (rdata.list === undefined || rdata.list === null) {
        setImageVO({});
      } else {
        await setImageVO(rdata.list[0]);
        if (tag === 'B') {
          refImageSeq.current = refImageSeq.current - 1;
        } else if (tag === 'N') {
          refImageSeq.current = refImageSeq.current + 1;
        }
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  useEffect(() => {
    fInit();
  }, []);

  useEffect(() => {
    fInit();
    if (Util.Common.fEmptyReturn(ApprovalDocNo) === '') {
      return;
    }
    refImageSeq.current = 1;
    fGetImageInfo();
  }, [ApprovalDocNo]);

  return (
    <>
      <Box style={{ width: '95%', height: 300, marginLeft: 10, marginTop: 10 }}>
        <Box className={classes.BoxTitle}>증빙자료</Box>
        <Box style={{ margin: 1, display: 'flex', alignItems: 'end' }}>
          <Box style={{ marginTop: 5, width: 260, height: 280, border: '1px solid #95b8e7', overflow: 'hidden' }}>
            <img src={`${refFilePath.current}/${imageVO.Photo}`} alt="첨부이미지" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Box style={{ width: 98, marginLeft: 10 }}>
            <FileButton
              style={{ width: 95, borderRadius: 3, marginLeft: 5 }}
              onSelect={(file) => fFileUpdateChange(file)}
              onClick={(event) => {
                event.target.value = null;
              }}
              accept="image/gif, image/jpg, image/jpeg, image/png"
              disabled={!ApprovalDocNo}
            >
              <Box style={{ width: 95, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdImage size={18} />
                <Box className={classes.Button1}>이미지등록</Box>
              </Box>
            </FileButton>
            <LinkButton disabled={!ApprovalDocNo} style={{ width: 95, color: '#424242', borderRadius: 3, marginLeft: 5, marginTop: 10 }} onClick={() => fDeleteImage()}>
              <Box style={{ width: 95, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdHideImage size={18} />
                <Box className={classes.Button1}>이미지삭제</Box>
              </Box>
            </LinkButton>
            <LinkButton disabled={!ApprovalDocNo} style={{ width: 95, color: '#424242', borderRadius: 3, marginLeft: 5, marginTop: 20 }} onClick={() => fDetailImage()}>
              <Box style={{ width: 95, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MdFullscreen size={18} />
                <Box className={classes.Button1} style={{ marginRight: 8 }}>
                  크게보기
                </Box>
              </Box>
            </LinkButton>
            <Box style={{ marginLeft: 5, display: 'grid' }}>
              <TextBox style={{ width: 95 }} className={classes.Box2} editable={false} value={imageVO.Seq} />
              <Box style={{ display: 'flex', marginTop: 10 }}>
                <LinkButton disabled={!ApprovalDocNo} style={{ width: 45, height: 30, color: '#424242', borderRadius: 3 }} onClick={() => fGetImageInfo('B')}>
                  <Box style={{ width: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaAngleLeft size={18} />
                  </Box>
                </LinkButton>
                <LinkButton disabled={!ApprovalDocNo} style={{ width: 45, height: 30, color: '#424242', borderRadius: 3, marginLeft: 5 }} onClick={() => fGetImageInfo('N')}>
                  <Box style={{ width: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaAngleRight size={18} />
                  </Box>
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      <EvidenceViewer
        visible={popupImage}
        docVO={docVO}
        onCancel={() => {
          setPopupImage(false);
        }}
        onUpdate={() => {
          setPopupImage(false);
          fGetImageInfo();
        }}
      />
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

export default injectSheet(Styles)(ApprovalImage);
