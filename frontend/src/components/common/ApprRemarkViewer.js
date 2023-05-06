import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton } from 'rc-easyui';
import axios from 'axios';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Alert from '@components/common/Alert';
import imgKsMark from '@assets/images/img_ks_mark.png';

const ApprRemarkViewer = ({ visible, docVO, onCancel }) => {
  const [infoVO, setInfoVO] = useState([]);
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });

  const fInit = async () => {
    try {
      const result = await axios.get('/@api/common/apprremarkviewer/selectByInfo', {
        params: { DocNo: docVO.DocNo, DocSource: docVO.DocSource, Factory: docVO.Factory },
      });
      const rdata = result.data;
      if (!rdata) {
        setInfoVO([]);
      } else {
        setInfoVO(rdata);
      }
    } catch (error) {
      setAlert({ visible: true, desc: '첨언 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  useEffect(() => {
    if (visible) {
      setInfoVO([]);
      fInit();
    }
  }, [visible]);

  const header = () => {
    return (
      <Box key="title" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ marginLeft: 5, width: 27 }} />
        <Box disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          첨언보기
        </Box>
      </Box>
    );
  };

  if (!visible) return null;
  return (
    <>
      <Dialog header={header} style={{ width: 400, height: 400 }} bodyCls="f-column" closable={false} modal>
        <Box className="f-full" style={{ display: 'flex', alignItems: 'center' }}>
          <Box style={{ display: 'flex', flexDirection: 'column', paddingLeft: 3 }}>
            <PerfectScrollbar style={{ minHeight: 300, maxHeight: 300 }}>
              <Box style={{ width: 380, height: 300, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                {infoVO.map((item) => (
                  <Box key={item.Seq}>{item.ApprComment}</Box>
                ))}
              </Box>
            </PerfectScrollbar>
          </Box>
        </Box>
        <Box className="dialog-button" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <LinkButton style={{ width: '80px' }} onClick={onCancel}>
            닫기
          </LinkButton>
        </Box>
      </Dialog>

      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
};
export default ApprRemarkViewer;
