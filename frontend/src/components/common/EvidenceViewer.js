import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton, TextBox } from 'rc-easyui';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Alert from '@components/common/Alert';
import Confirm from '@components/common/Confirm';
import imgKsMark from '@assets/images/img_ks_mark.png';

const EvidenceViewer = ({ visible, docVO, onCancel, onUpdate }) => {
  const classes = Styles();
  const refImageSeq = useRef(null);
  const refImageTag = useRef(null);
  const refUpdate = useRef(false);

  const [imageVO, setImageVO] = useState({});
  const [rotate, setRotate] = useState(0);
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });

  const fInit = async () => {
    try {
      const result = await axios.get('/@api/common/evidenceviewer/selectByPhoto', {
        params: { DocNo: docVO.DocNo, DocSource: docVO.DocSource, Factory: docVO.Factory, Seq: docVO.Seq },
      });
      const rdata = result.data;
      if (!rdata) {
        setImageVO({});
      } else {
        setImageVO(rdata);
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fGetImageInfo = async (TAG) => {
    if (!imageVO.Seq) {
      return;
    }
    if (TAG) {
      try {
        const result = await axios.get('/@api/common/evidenceviewer/selectByPhotoTag', {
          params: { DocNo: docVO.DocNo, DocSource: docVO.DocSource, Factory: docVO.Factory, Seq: imageVO.Seq, Tag: TAG },
        });
        const rdata = result.data;
        if (rdata.errmess !== '') {
          setAlert({ visible: true, desc: rdata.errmess });
        } else if (rdata.iInfo === undefined) {
          setImageVO({});
        } else {
          setImageVO(rdata.iInfo);
        }
      } catch (error) {
        setAlert({ visible: true, desc: '이미지 조회중 오류가 발생하였습니다.', type: 'E' });
      }
    } else {
      try {
        const result = await axios.get('/@api/common/evidenceviewer/selectByPhoto', {
          params: { DocNo: docVO.DocNo, DocSource: docVO.DocSource, Factory: docVO.Factory, Seq: refImageSeq.current },
        });
        const rdata = result.data;
        if (!rdata) {
          setImageVO({});
        } else {
          setImageVO(rdata);
        }
      } catch (error) {
        setAlert({ visible: true, desc: '이미지 조회중 오류가 발생하였습니다.', type: 'E' });
      }
    }
  };

  const fRotate = (rot) => {
    if (rot === 'M') {
      const deg = rotate - 90;
      if (deg < 0) {
        setRotate(270);
      } else {
        setRotate(deg);
      }
    } else if (rot === 'P') {
      const deg = rotate + 90;
      if (deg > 360) {
        setRotate(90);
      } else {
        setRotate(deg);
      }
    }
  };

  const fUpdateSeq = (TAG) => {
    if (!imageVO.Seq) {
      return;
    }

    refImageTag.current = TAG;

    setConfirm({
      visible: true,
      desc: '해당 이미지의 증빙번호를 변경 하시겠습니까?',
      id: 'UPDATE_SEQ',
    });
  };

  const fUpdateSeqProc = async () => {
    try {
      const restVO = {
        DocNo: docVO.DocNo,
        DocSource: docVO.DocSource,
        Factory: docVO.Factory,
        Seq: imageVO.Seq,
        Tag: refImageTag.current,
      };

      const result = await axios.post('/@api/common/evidenceviewer/updateByPhotoSeq', {
        data: restVO,
      });
      const rdata = result.data;
      if (rdata.errmess === '') {
        setAlert({ visible: true, desc: '변경이 완료되었습니다.' });
        refUpdate.current = true;
        refImageSeq.current = rdata.rtnSeq;
        setTimeout(() => {
          fGetImageInfo();
        }, 1500);
      } else {
        setAlert({ visible: true, desc: rdata.errmess, type: 'W' });
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 등록중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  const fConfirmFunc = async () => {
    setConfirm({ visible: false, desc: '', id: '' });

    if (confirm.id === 'UPDATE_SEQ') {
      fUpdateSeqProc();
    }
  };

  const fConfirmCancel = () => {
    setConfirm({ visible: false, desc: '', id: '' });
  };

  const fCancel = () => {
    if (refUpdate.current) {
      onUpdate();
    } else {
      onCancel();
    }
  };

  useEffect(() => {
    if (visible) {
      refImageSeq.current = null;
      refImageTag.current = null;
      refUpdate.current = false;
      setImageVO({});
      setRotate(0);
      setAlert({ visible: false });
      fInit();
    }
  }, [visible]);

  const header = () => {
    return (
      <Box key="title" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ marginLeft: 5, width: 27 }} />
        <Box disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          증빙자료
        </Box>
      </Box>
    );
  };

  if (!visible) return null;
  return (
    <>
      <Dialog header={header} style={{ width: 650, height: 800 }} bodyCls="f-column" closable={false} modal>
        <Box className="f-full" style={{ display: 'flex', alignItems: 'center' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', paddingLeft: 3 }}>
            <Box style={{ width: '100%', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1efea' }}>
              <TextBox value={docVO.DocSource} disabled className={classes.S1} style={{ marginLeft: 5 }} />
              <TextBox value={docVO.DocNo} disabled className={classes.S1} style={{ width: 100 }} />
              <TextBox value={docVO.Factory} disabled className={classes.S1} style={{ width: 50 }} />
              <TextBox value={imageVO.No} disabled className={classes.S1} style={{ width: 40, marginLeft: 15 }} />
              <Box style={{ marginLeft: 5, marginRight: 5 }}>/</Box>
              <TextBox value={imageVO.TotCnt} disabled className={classes.S1} style={{ width: 40 }} />
              <LinkButton style={{ width: 40, height: 25, color: '#424242', borderRadius: 3, marginLeft: 7 }} onClick={() => fGetImageInfo('B')}>
                <Box style={{ width: 40, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaAngleLeft size={15} />
                </Box>
              </LinkButton>
              <LinkButton style={{ width: 40, height: 25, color: '#424242', borderRadius: 3, marginLeft: 3 }} onClick={() => fGetImageInfo('N')}>
                <Box style={{ width: 40, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaAngleRight size={15} />
                </Box>
              </LinkButton>
              <LinkButton style={{ width: 40, height: 25, color: '#424242', borderRadius: 3, marginLeft: 7 }} onClick={() => fRotate('M')}>
                <Box style={{ width: 40, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-90</Box>
              </LinkButton>
              <LinkButton style={{ width: 40, height: 25, color: '#424242', borderRadius: 3, marginLeft: 3 }} onClick={() => fRotate('P')}>
                <Box style={{ width: 40, height: 25, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+90</Box>
              </LinkButton>
              <Box style={{ display: 'flex', flexDirection: 'column', marginLeft: 25 }}>
                <Box style={{ width: 100, fontSize: 12, textAlign: 'center' }}>증빙번호변경</Box>
                <Box style={{ marginLeft: 7, marginTop: 2 }}>
                  <LinkButton style={{ width: 35, height: 20, color: '#424242', borderRadius: 3, marginLeft: 7 }} onClick={() => fUpdateSeq('Y')}>
                    <Box style={{ width: 35, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaAngleLeft size={14} />
                    </Box>
                  </LinkButton>
                  <LinkButton style={{ width: 35, height: 20, color: '#424242', borderRadius: 3, marginLeft: 3 }} onClick={() => fUpdateSeq('X')}>
                    <Box style={{ width: 35, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaAngleRight size={14} />
                    </Box>
                  </LinkButton>
                </Box>
              </Box>
            </Box>
            <Box style={{ width: 630, height: 640, border: '1px solid #95b8e7', overflow: 'hidden', margin: '0 auto' }}>
              {imageVO.Photo && (
                <TransformWrapper initalScale={1} minScale={1} maxScale={10}>
                  <TransformComponent>
                    <img src={`${docVO.FilePath}/${imageVO.Photo}`} alt="첨부이미지" className={classes.S2} style={{ transform: 'rotate(' + rotate + 'deg)' }} />
                  </TransformComponent>
                </TransformWrapper>
              )}
            </Box>
          </Box>
        </Box>
        <Box className="dialog-button" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <LinkButton style={{ width: '80px' }} onClick={fCancel}>
            닫기
          </LinkButton>
        </Box>
      </Dialog>
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
    </>
  );
};

const Styles = createUseStyles({
  S1: {
    width: 60,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'center',
      backgroundColor: '#fff !important',
    },
  },
  S2: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
});

export default EvidenceViewer;
