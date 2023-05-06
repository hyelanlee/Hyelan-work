import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import injectSheet from 'react-jss';
import { TextBox, LinkButton } from 'rc-easyui';
import axios from 'axios';
import { Box } from '@material-ui/core';
import useStores from '@stores/useStores';
import ApprovalButton from '@components/common/Approval/ApprovalButton';
import ApprovalLine from '@components/common/Approval/ApprovalLine';
import ApprovalImage from '@components/common/Approval/ApprovalImage';
import ApprovalAttachments from '@components/common/Approval/ApprovalAttachments';
import { Utility } from '@components/common/Utility/Utility';
import Confirm from '@components/common/Confirm';
import Alert from '@components/common/Alert';
import ApprRemarkViewer from '@components/common/ApprRemarkViewer';

const Approval = observer(
  ({
    classes,
    PGMID,
    Init,
    ApprovalType = 'A',
    ApprovalDocFlag = 'A',
    ApprovalDocNo,
    ApprovalDocSource,
    AttachmentsKeyName,
    MaxRevNo,
    RevNo,
    isImageComponent,
    isAttachments,
    isRevision,
    filepath,
    SetTitle,
    isReturnButton,
    RetrieveFlag,
  }) => {
    const PGMID_APPROVAL = PGMID + '_APPROVAL';
    const { $UserStore } = useStores();

    const refDataSource = useRef(null);
    const refRetrieve = useRef();

    const [isRemarkFlag, setIsRemarkFlag] = useState(false);
    const [docVO, setDocVO] = useState({});
    const [InputVO, setInputVO] = useState({
      DocRemark: '',
      AcctRemark: '',
      ApprDocFlag: '',
      ApprRemFlag: '',
      DocApprUrl1: '',
      ApprovalDisabled: true,
      ApprovalCancelDisabled: true,
      ApprovalRemarkDisabled: true,
      ApprovalReturnDisabled: true,
    });

    const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });
    const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
    const Util = new Utility(PGMID_APPROVAL, setAlert, true, true, true, true, true);

    const finit = () => {
      setInputVO(
        {
          DocRemark: '',
          AcctRemark: '',
          ApprDocFlag: '',
          ApprRemFlag: '',
          DocApprUrl1: '',
          ApprovalDisabled: true,
          ApprovalCancelDisabled: true,
          ApprovalRemarkDisabled: true,
          ApprovalReturnDisabled: true,
        },
        50,
      );
    };

    const GetDataSource = (provider) => {
      if (provider != undefined && provider != null) {
        refDataSource.current = provider;
      }
    };

    const onClickApproval = () => {
      if (Util.Common.fValidate(refDataSource.current.getRowCount() < 1, '결재라인이 지정되지 않았습니다.')) {
        return;
      }

      if (Util.Common.fValidate(MaxRevNo !== RevNo, '마지막 리비전이 아닙니다. 결재상신 할 수 없습니다.')) {
        return;
      }

      setConfirm({
        visible: true,
        desc: '해당 문서를 결재상신 하시겠습니까?',
        id: 'APPROVAL',
      });
    };

    const onClickApprovalCancel = () => {
      if (Util.Common.fValidate(MaxRevNo !== RevNo, '마지막 리비전이 아닙니다. 상신취소 할 수 없습니다.')) {
        return;
      }

      setConfirm({
        visible: true,
        desc: '해당 문서를 상신취소 하시겠습니까?',
        id: 'APPROVAL_CANCEL',
      });
    };

    const onClickApprovalRemark = () => {
      setDocVO({
        DocSource: ApprovalDocSource,
        DocNo: ApprovalDocNo,
        Factory: $UserStore.user.factory,
      });

      setIsRemarkFlag(true);
    };

    const onClickApprovalReturn = () => {
      if (Util.Common.fValidate(MaxRevNo !== RevNo, '마지막 리비전이 아닙니다. 반려 할 수 없습니다.')) {
        return;
      }

      setConfirm({
        visible: true,
        desc: '해당 문서를 반려 하시겠습니까?',
        id: 'RETURN',
      });
    };

    const fApprovalInfo = async (flag) => {
      if (!ApprovalDocNo) {
        return;
      }
      const paramVO = {};
      paramVO.ApprovalType = ApprovalType;
      paramVO.ApprovalDocNo = ApprovalDocNo;
      paramVO.ApprovalDocSource = ApprovalDocSource;
      paramVO.UserPno = $UserStore.user.userid;
      paramVO.Factory = $UserStore.user.factory;

      const result = await Util.Command.fSearchByReturn(`/@api/common/appr/selectByApprovalInfo`, paramVO);
      if (result === '') {
        Util.Common.fMultiFieldChange(setInputVO, {
          DocRemark: undefined,
          AcctRemark: undefined,
          DocApprUrl1: undefined,
          ApprovalDisabled: false,
          ApprovalCancelDisabled: true,
          ApprovalRemarkDisabled: true,
          ApprovalReturnDisabled: true,
        });
        return;
      } else {
        Util.Common.fMultiFieldChange(setInputVO, {
          DocRemark: result[0].DocRemark,
          AcctRemark: result[0].AcctRemark,
          DocApprUrl1: result[0].DocApprUrl1,
          ApprovalDisabled: !(result[0].ApprovalDisabled && ApprovalDocNo),
          ApprovalCancelDisabled: !(result[0].ApprovalCancelDisabled && ApprovalDocNo),
          ApprovalRemarkDisabled: !(result[0].ApprovalRemarkDisabled && ApprovalDocNo),
          ApprovalReturnDisabled: !(result[0].ApprovalReturnDisabled && ApprovalDocNo),
        });
        if (flag) {
          SetTitle(result[0].DocStatus);
        }
      }
    };

    const fOpenDocument = () => {
      if (InputVO.DocApprUrl1.startsWith('http')) {
        window.open(InputVO.DocApprUrl1, '_blank');
      } else {
        setAlert({ visible: true, desc: `주소가 잘못되었습니다.\nURL 주소를 확인하여 주세요.` });
      }
    };

    const fConfirmFunc = async () => {
      setConfirm({ visible: false, desc: '', id: '' });

      if (confirm.id === 'APPROVAL') {
        fSaveApproval();
      } else if (confirm.id === 'APPROVAL_CANCEL') {
        fDeleteApproval();
      } else if (confirm.id === 'RETURN') {
        fReturnApproval();
      }
    };

    const fConfirmCancel = () => {
      setConfirm({ visible: false, desc: '', id: '' });
    };

    const fSaveApproval = async () => {
      const paramVO = { ...InputVO };
      paramVO.Factory = $UserStore.user.factory;
      paramVO.iUserPno = $UserStore.user.userid;
      paramVO.ApprovalType = ApprovalType;
      paramVO.ApprovalDocNo = ApprovalDocNo;
      paramVO.ApprovalDocSource = ApprovalDocSource;
      paramVO.ApprovalDocFlag = ApprovalDocFlag;

      let approvalInfo = [];
      const checkResult = Util.Grid.fCheckGridDataAll(refDataSource.current, approvalInfo, { ApprId: '결재자', ApprPos: '직책' }, '결재라인');
      if (checkResult !== undefined) {
        return;
      }

      try {
        const result = await axios.post('/@api/common/appr/updateByApproval', {
          header: paramVO,
          detail: approvalInfo,
        });
        const resultData = result.data;
        if (resultData.errmess !== '') {
          setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
          return;
        }
        setAlert({ visible: true, desc: '결재상신이 완료 되었습니다.' });
        setTimeout(() => {
          fApprovalInfo(true);
          refRetrieve.current = !refRetrieve.current;
        }, 700);
      } catch (error) {
        setAlert({ visible: true, desc: `결재상신 중 오류가 발생하였습니다.${error}`, type: 'E' });
      }
    };

    const fDeleteApproval = async () => {
      const paramVO = { ...InputVO };
      paramVO.Factory = $UserStore.user.factory;
      paramVO.iUserPno = $UserStore.user.userid;
      paramVO.ApprovalType = ApprovalType;
      paramVO.ApprovalDocNo = ApprovalDocNo;
      paramVO.ApprovalDocSource = ApprovalDocSource;

      try {
        const result = await axios.post('/@api/common/appr/deleteByApproval', {
          header: paramVO,
        });
        const resultData = result.data;
        if (resultData.errmess !== '') {
          setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
          return;
        }
        setAlert({ visible: true, desc: '상신취소가 완료 되었습니다.' });
        setTimeout(() => {
          fApprovalInfo(true);
          refRetrieve.current = !refRetrieve.current;
        }, 700);
      } catch (error) {
        setAlert({ visible: true, desc: `상신취소 중 오류가 발생하였습니다.${error}`, type: 'E' });
      }
    };

    const fReturnApproval = async () => {
      const paramVO = { ...InputVO };
      paramVO.Factory = $UserStore.user.factory;
      paramVO.iUserPno = $UserStore.user.userid;
      paramVO.ApprovalType = ApprovalType;
      paramVO.ApprovalDocNo = ApprovalDocNo;
      paramVO.ApprovalDocSource = ApprovalDocSource;

      try {
        const result = await axios.post('/@api/common/appr/returnByApproval', {
          header: paramVO,
        });
        const resultData = result.data;
        if (resultData.errmess !== '') {
          setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
          return;
        }
        setAlert({ visible: true, desc: '반려가 완료 되었습니다.' });
        setTimeout(() => {
          fApprovalInfo(true);
          refRetrieve.current = !refRetrieve.current;
        }, 700);
      } catch (error) {
        setAlert({ visible: true, desc: `반려 중 오류가 발생하였습니다.${error}`, type: 'E' });
      }
    };

    useEffect(() => {
      if (Util.Common.fEmptyReturn(ApprovalDocNo) === '') {
        finit();
        return;
      }
      fApprovalInfo();
    }, [ApprovalDocNo]);

    useEffect(() => {
      if (Util.Common.fEmptyReturn(ApprovalDocSource) === '') {
        finit();
        return;
      }
      fApprovalInfo();
      refRetrieve.current = !refRetrieve.current;
    }, [RetrieveFlag]);

    return (
      <>
        <ApprovalButton
          ApprovalDisabled={InputVO.ApprovalDisabled}
          ApprovalCancelDisabled={InputVO.ApprovalCancelDisabled}
          ApprovalRemarkDisabled={InputVO.ApprovalRemarkDisabled}
          ApprovalReturnDisabled={InputVO.ApprovalReturnDisabled}
          onClickApproval={onClickApproval}
          onClickApprovalCancel={onClickApprovalCancel}
          onClickApprovalRemark={onClickApprovalRemark}
          onClickApprovalReturn={onClickApprovalReturn}
          isReturnButton={isReturnButton}
        />
        <ApprovalLine
          PGMID={PGMID_APPROVAL}
          Init={Init}
          ApprovalType={ApprovalType}
          ApprovalDocNo={ApprovalDocNo}
          ApprovalDocSource={ApprovalDocSource}
          Retrieve={refRetrieve.current}
          GetDataSource={GetDataSource}
        />
        {!isReturnButton && (
          <Box>
            <Box className={classes.Box}>
              <Box className={classes.BoxTitle}>상신자의견</Box>
            </Box>
            <Box>
              <TextBox
                key={Util.Common.fMakeId('DocRemark')}
                name="DocRemark"
                inputId={Util.Common.fMakeId('DocRemark')}
                multiline
                className={classes.TextArea}
                value={InputVO.DocRemark}
                onChange={(value) => Util.Common.fFieldChange(setInputVO, 'DocRemark', value)}
              />
            </Box>
          </Box>
        )}
        {isReturnButton && (
          <Box>
            <Box className={classes.Box2}>
              <Box className={classes.BoxTitle}>상신자의견</Box>
            </Box>
            <Box>
              <TextBox
                key={Util.Common.fMakeId('DocRemark')}
                name="DocRemark"
                inputId={Util.Common.fMakeId('DocRemark')}
                multiline
                className={classes.TextArea2}
                value={InputVO.DocRemark}
                onChange={(value) => Util.Common.fFieldChange(setInputVO, 'DocRemark', value)}
              />
            </Box>
            <Box className={classes.Box2}>
              <Box className={classes.BoxTitle}>반려의견</Box>
            </Box>
            <Box>
              <TextBox
                key={Util.Common.fMakeId('AcctRemark')}
                name="AcctRemark"
                inputId={Util.Common.fMakeId('AcctRemark')}
                multiline
                className={classes.TextArea2}
                value={InputVO.AcctRemark}
                onChange={(value) => Util.Common.fFieldChange(setInputVO, 'AcctRemark', value)}
              />
            </Box>
          </Box>
        )}
        <Box>
          <Box className={classes.Box}>
            <Box className={classes.BoxTitle}>전자결재문서</Box>
          </Box>
          <Box style={{ marginLeft: 10 }}>
            <TextBox
              key={Util.Common.fMakeId('DocApprUrl1')}
              name="DocApprUrl1"
              inputId={Util.Common.fMakeId('DocApprUrl1')}
              value={InputVO.DocApprUrl1}
              className={classes.TextBox2}
              style={{ width: 296, height: 30 }}
              onChange={(value) => Util.Common.fFieldChange(setInputVO, 'DocApprUrl1', value)}
            />
            <LinkButton
              style={{ width: 70, color: '#424242', borderRadius: 3, marginLeft: 10 }}
              disabled={!ApprovalDocNo}
              onClick={() => {
                if (InputVO.DocApprUrl1) {
                  fOpenDocument();
                }
              }}
            >
              <Box style={{ width: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box className={classes.ButtonText}>문서보기</Box>
              </Box>
            </LinkButton>
          </Box>
        </Box>
        <ApprRemarkViewer
          visible={isRemarkFlag}
          docVO={docVO}
          onCancel={() => {
            setIsRemarkFlag(false);
          }}
        />
        <Box>{isImageComponent && <ApprovalImage PGMID={PGMID_APPROVAL} ApprovalDocSource={ApprovalDocSource} ApprovalDocNo={ApprovalDocNo} filepath={filepath} />}</Box>
        <Box>
          {isAttachments && (
            <ApprovalAttachments
              PGMID={PGMID_APPROVAL}
              FileType={ApprovalDocSource}
              FileNo={ApprovalDocNo}
              RevNo={RevNo}
              IsRevision={isRevision}
              FilePath={filepath}
              AttachmentsKeyName={AttachmentsKeyName}
            />
          )}
        </Box>
        <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
        <Confirm visible={confirm.visible} description={confirm.desc} onCancel={fConfirmCancel} onConfirm={fConfirmFunc} />
      </>
    );
  },
);

const Styles = {
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
  Box2: {
    marginLeft: 10,
    marginTop: 5,
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
  TextArea2: {
    width: '95%',
    height: 42,
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
};

export default injectSheet(Styles)(Approval);
