import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import useStores from '@stores/useStores';
import { createUseStyles } from 'react-jss';
import ReactInterval from 'react-interval';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import CryptoJS from 'crypto-js';
import { Box } from '@material-ui/core';
import { Panel, LinkButton, Dialog, TextBox } from 'rc-easyui';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { GridView, LocalDataProvider } from 'realgrid';
import { GridFields4, GridColumns4 } from '@pages/business/KsExofferGrid';

const Sidebar = observer(() => {
  const { $UserStore, $CommonStore } = useStores();
  const classes = Styles();
  const history = useHistory();

  const refRemark = useRef('');
  const refApprCnt = useRef(null);
  const refApprList = useRef(null);
  const refSideBarGrid = useRef(null);

  const [pmsInfo, setPmsInfo] = useState({ pms1Cnt: '', pms2Cnt: '', pms3Cnt: '' });
  const [apprCnt, setApprCnt] = useState({ appr1Cnt: '', appr2Cnt: '', appr3Cnt: '', rev1Cnt: '', rev2Cnt: '' });
  const [apprList, setApprList] = useState({ appr1Info: [], appr2Info: [], appr3Info: [], rev1Info: [], rev2Info: [] });
  const [apprViewPopup, setApprViewPopup] = useState('');
  const [revisionViewPopup, setRevisionViewPopup] = useState('');
  const [apprRemarkPopup, setApprRemarkPopup] = useState('');
  const [sideBarRevVO, setSideBarRevVO] = useState({
    revno: '',
    revdate: '',
    revhistory: '',
  });

  const fInit = () => {
    fGetPmsInfo();
    fGetApprDocInfo();
  };

  const fPmsOpen = (type) => {
    var iv = '1375110db6392f93e90d5159dabdee4b';
    var salt = '9dc00b2fc5f0e0ee00411dda4dabc064';
    var plainText = $UserStore.user.userid;
    var keySize = 128;
    var iterationCount = 10000;
    var passPhrase = moment(new Date()).format('MMDD').toString();
    var key128Bits100Iterations = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), { keySize: keySize / 32, iterations: iterationCount });
    var encrypted = CryptoJS.AES.encrypt(plainText, key128Bits100Iterations, { iv: CryptoJS.enc.Hex.parse(iv) });
    const win = window.open(`https://pms.ehansun.co.kr/login/erplink.do?user_id=${encodeURIComponent(encrypted.toString())}&gubun=${type}`, '_blank');
    if (win != null) {
      win.focus();
    }
  };

  const fGetPmsInfo = async () => {
    const instance = axios.create({});
    instance.defaults.headers.common['Cache-Control'] = 'no-cache';
    instance.defaults.headers.common['Pragma'] = 'no-cache';
    instance.defaults.headers.get['If-Modified-Since'] = '0';
    instance.defaults.headers['Access-Control-Allow-Origin'] = '*';
    try {
      const result = await instance.get('/@api/common/pms/selectByPmsInfo', {
        params: { userid: $UserStore.user.userid },
      });
      if (result.data) {
        let pms1Cnt, pms2Cnt, pms3Cnt;
        for (const item of result.data) {
          if (item.WebPgmNm === '나에게온요청사항') {
            pms1Cnt = item.ServiceCnt;
          } else if (item.WebPgmNm === '팀에게온요청사항') {
            pms2Cnt = item.ServiceCnt;
          } else if (item.WebPgmNm === '나의요청사항') {
            pms3Cnt = item.ServiceCnt;
          }
        }
        setPmsInfo({ pms1Cnt: pms1Cnt, pms2Cnt: pms2Cnt, pms3Cnt: pms3Cnt });
      } else {
        setPmsInfo({ pms1Cnt: '오류', pms2Cnt: '오류', pms3Cnt: '오류' });
      }
    } catch (e) {
      setPmsInfo({ pms1Cnt: '오류', pms2Cnt: '오류', pms3Cnt: '오류' });
    }
  };

  const fGetApprDocInfo = async () => {
    try {
      const result = await axios.get('/@api/common/appr/selectByApprDocInfo', {
        params: { userid: $UserStore.user.userid },
      });
      const rdata = result.data;
      let appr1Info, appr2Info, appr3Info;
      let rev1Info, rev2Info;
      for (let [key, value] of Object.entries(rdata)) {
        if (key === 'appr1') {
          appr1Info = value;
        } else if (key === 'appr2') {
          appr2Info = value;
        } else if (key === 'appr3') {
          appr3Info = value;
        } else if (key === 'rev1') {
          rev1Info = value;
        } else if (key === 'rev2') {
          rev2Info = value;
        }
      }
      setApprCnt({ appr1Cnt: appr1Info.length, appr2Cnt: appr2Info.length, appr3Cnt: appr3Info.length, rev1Cnt: rev1Info.length, rev2Cnt: rev2Info.length });
      setApprList({ appr1Info: appr1Info, appr2Info: appr2Info, appr3Info: appr3Info, rev1Info: rev1Info, rev2Info: rev2Info });
    } catch (e) {
      setApprCnt({ appr1Cnt: '오류', appr2Cnt: '오류', appr3Cnt: '오류', rev1Cnt: '오류', rev2Cnt: '오류' });
      setApprList({ appr1Info: [], appr2Info: [], appr3Info: [], rev1Info: [], rev2Info: [] });
    }
  };

  const fApprView = (id) => {
    if (id === 'appr1') {
      if (apprCnt.appr1Cnt) {
        setApprViewPopup('APPR1');
      }
    } else if (id === 'appr2') {
      if (apprCnt.appr2Cnt) {
        setApprViewPopup('APPR2');
      }
    } else if (id === 'appr3') {
      if (apprCnt.appr3Cnt) {
        setApprViewPopup('APPR3');
      }
    } else if (id === 'rev1') {
      if (apprCnt.rev1Cnt) {
        setApprViewPopup('REV1');
      }
    } else if (id === 'rev2') {
      if (apprCnt.rev2Cnt) {
        setApprViewPopup('REV2');
      }
    }
  };

  const fApprOpen = (info) => {
    if (info.CreStatus === 'R') {
      fMenu2(info.PgmId, info.PgmId.toLowerCase(), info.ExofferNo, info.DocSource, info.CreStatus);
    } else if (info.CreStatus === 'K') {
      setSideBarRevVO({
        ...sideBarRevVO,
        revno: info.RevNo,
        revdate: moment(info.RevDate).format('YYYY-MM-DD'),
        revhistory: info.RevRemark,
      });
      fMenu3(info.ExofferNo, info.DocSource, info.RevNo);
    } else {
      fMenu(info.PgmId, info.PgmId.toLowerCase(), info.Actno);
    }
  };

  const fDisApproveOpen = (remark) => {
    refRemark.current = remark;
    setApprRemarkPopup('REMARK');
  };

  const fMenu = (pgmId, pgmUrl, DocSource) => {
    $CommonStore.fSetParameter({
      search: {
        returnURL: pgmUrl,
        data1: pgmId,
        data2: DocSource,
      },
    });
    history.push(pgmUrl);
    setApprViewPopup('');
  };

  const fMenu2 = (pgmId, pgmUrl, ExofferNo, DocSource, CreStatus) => {
    $CommonStore.fSetParameter({
      search: {
        returnURL: pgmUrl,
        data1: pgmId,
        data2: ExofferNo,
        revKeyNo: DocSource,
        creStatus: CreStatus,
      },
    });
    history.push(pgmUrl);
    setApprViewPopup('');
  };

  const fMenu3 = async (ExofferNo, DocSource, RevNo) => {
    setRevisionViewPopup('REFER');
    fRevList(ExofferNo, DocSource, RevNo);
  };

  const fInitSidebarGrid = () => {
    sidebar_dataProvider = new LocalDataProvider(false);
    sidebar_gridView = new GridView(refSideBarGrid.current);
    sidebar_gridView.setDataSource(sidebar_dataProvider);
    sidebar_dataProvider.setFields(GridFields4);
    sidebar_gridView.setColumns(GridColumns4);
    sidebar_gridView.setCheckBar({
      visible: false,
    });
    sidebar_gridView.setStateBar({
      visible: true,
    });
    sidebar_gridView.setFooters({
      visible: true,
    });
    sidebar_gridView.setRowIndicator({
      visible: true,
    });
    sidebar_gridView.setCopyOptions({ singleMode: true, enabled: true });
    sidebar_gridView.sortingOptions.enabled = false;
    sidebar_gridView.setDisplayOptions({ focusVisible: false, selectionStyle: 'rows', selectionMode: 'none', columnMovable: false, fitStyle: 'none', rowHeight: 25 });
    sidebar_gridView.setOptions({ summaryMode: 'aggregate' });
    sidebar_gridView.setEditOptions({
      insertable: false,
      appendable: false,
      editable: false,
    });

    sidebar_gridView.setRowStyleCallback((grid, item) => {
      const data = grid.getDataSource().getJsonRow(item.index);
      if (data.historystate === '이전자료') {
        return 'rg-text-black-color';
      } else if (data.historystate === '내용수정') {
        return 'rg-semi-orange-color rg-text-black-color';
      } else if (data.historystate === '품번추가') {
        return 'rg-semired-color rg-text-black-color';
      }
    });

    sidebar_gridView.orderBy([], []);
  };

  const fRevList = async (exofferno, revkeyno, revno) => {
    try {
      let result = await axios.get('/@api/common/appr/selectByRevList', {
        params: {
          iTag: revkeyno.substr(0, 6) >= '202204' ? 'QP' : 'QY',
          iExOfferNo: exofferno,
          iRevKeyNo: revkeyno,
          iRevNo: revno,
          iCrePno: $UserStore.user.userid,
        },
      });

      const data = result.data;

      if (data.errmess) {
        return;
      } else {
        if (data.length) {
          sidebar_dataProvider.setRows(data);
        } else {
          sidebar_dataProvider.clearRows();
        }
        fGetApprDocInfo();
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (revisionViewPopup === 'REFER') {
      fInitSidebarGrid();
    }
  }, [revisionViewPopup]);

  useEffect(() => {
    refApprCnt.current = apprCnt;

    if ($CommonStore.ChangeValue.TYPE === 'appr1') {
      fApprView('appr1');
    } else if ($CommonStore.ChangeValue.TYPE === 'appr3') {
      fApprView('appr3');
    } else if ($CommonStore.ChangeValue.TYPE === 'appr4') {
      fApprView('appr4');
    } else if ($CommonStore.ChangeValue.TYPE === 'rev1') {
      fApprView('rev1');
    } else if ($CommonStore.ChangeValue.TYPE === 'rev2') {
      fApprView('rev2');
    }
  }, [apprCnt]);

  useEffect(() => {
    refApprList.current = apprList;
  }, [apprList]);

  useEffect(() => {
    if ($CommonStore.ChangeValue.VALUE) {
      if ($CommonStore.ChangeValue.VALUE === 'UPDATE') {
        fGetApprDocInfo();
        $CommonStore.fSetChangeValue({});
      } else if ($CommonStore.ChangeValue.VALUE === 'ALARM') {
        fGetApprDocInfo();
      }
    }
  }, [$CommonStore.ChangeValue.PGMID, $CommonStore.ChangeValue.VALUE]);

  useEffect(() => {
    fInit();
  }, []);

  return (
    <>
      <ReactInterval timeout={600000} enabled callback={() => fInit()} />
      <Panel showHeader={false} bodyStyle={{ padding: 3 }} className={classes.S2}>
        <Box style={{ width: 212, height: 140 }} className={classes.S3} display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.S1}>PMS</Box>
          <LinkButton className={classes.S4} onClick={() => fPmsOpen('002')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.S5}>나에게온요청사항</Box>
              <Box className={classes.S6}>{pmsInfo.pms1Cnt}</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.S4} onClick={() => fPmsOpen('001')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.S5}>팀에게온요청사항</Box>
              <Box className={classes.S6}>{pmsInfo.pms2Cnt}</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.S4} onClick={() => fPmsOpen('003')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.S5}>나의요청사항</Box>
              <Box className={classes.S6}>{pmsInfo.pms3Cnt}</Box>
            </Box>
          </LinkButton>
        </Box>
        <Box style={{ width: 212 }} className={classes.S3} display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.S1}>전자결재</Box>
          <LinkButton className={classes.S4} onClick={() => fApprView('appr1')}>
            <Box style={{ display: 'flex', alignItems: 'center', height: 25 }}>
              <Box className={classes.S5}>결재상신</Box>
              <Box className={classes.S6}>{apprCnt.appr1Cnt}</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.S4} onClick={() => fApprView('appr2')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.S5}>결재반려</Box>
              <Box className={classes.S6}>{apprCnt.appr2Cnt}</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.S4} style={{ marginBottom: '5px' }} onClick={() => fApprView('appr3')}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Box className={classes.S5}>결재</Box>
              <Box className={classes.S6}>{apprCnt.appr3Cnt}</Box>
            </Box>
          </LinkButton>
        </Box>
        <Box style={{ width: 212 }} className={classes.S3} display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.S1}>리비전 요청</Box>
          <LinkButton className={classes.S4} onClick={() => fApprView('rev2')}>
            <Box style={{ display: 'flex', alignItems: 'center', height: 25 }}>
              <Box className={classes.S5}>결재</Box>
              <Box className={classes.S6}>{apprCnt.rev2Cnt}</Box>
            </Box>
          </LinkButton>
          <LinkButton className={classes.S4} onClick={() => fApprView('rev1')}>
            <Box style={{ display: 'flex', alignItems: 'center', height: 25 }}>
              <Box className={classes.S5}>참조</Box>
              <Box className={classes.S6}>{apprCnt.rev1Cnt}</Box>
            </Box>
          </LinkButton>
        </Box>
      </Panel>

      {apprViewPopup === 'APPR1' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>결재상신 문서</Box>} style={{ width: 920 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ height: 350, backgroundColor: '#fff', padding: 5 }}>
            <Box border={1} borderRadius={5} borderColor="#ddd" bgcolor="#FBFBFB" style={{ height: 310, marginTop: 20, padding: 5, display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box className={classes.SB1} style={{ width: 61, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  NO.
                </Box>
                <Box className={classes.SB1} style={{ width: 130, borderLeft: 0 }}>
                  문서명
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신상태
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신일자
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  결재자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  결재상태
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  문서확인
                </Box>
              </Box>
              <PerfectScrollbar style={{ height: 310 }}>
                {apprList.appr1Info.map((item, index) => (
                  <Box key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box className={classes.SB2} style={{ width: 60, borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.rowNum}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 130, justifyContent: 'center' }}>
                      {item.PgmNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.Actno}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.CreStatusNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.CreDateTime).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.ApprPnoNm}
                      {item.jkcdName}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.ApprStatusNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 101, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      <LinkButton className={classes.SB3} onClick={() => fApprOpen(item)}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SB4}>확인</Box>
                        </Box>
                      </LinkButton>
                    </Box>
                  </Box>
                ))}
              </PerfectScrollbar>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 950, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprViewPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {apprViewPopup === 'APPR2' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>결재반려 문서</Box>} style={{ width: 830 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ height: 350, backgroundColor: '#fff', padding: 5 }}>
            <Box border={1} borderRadius={5} borderColor="#ddd" bgcolor="#FBFBFB" style={{ height: 310, marginTop: 20, padding: 5, display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box className={classes.SB1} style={{ width: 61, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  NO.
                </Box>
                <Box className={classes.SB1} style={{ width: 130, borderLeft: 0 }}>
                  문서명
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신상태
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신일자
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  결재자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  결재상태
                </Box>
                {/* <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  문서확인
                </Box> */}
              </Box>
              <PerfectScrollbar style={{ height: 310 }}>
                {apprList.appr2Info.map((item, index) => (
                  <Box key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box className={classes.SB2} style={{ width: 60, borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.rowNum}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 130, justifyContent: 'center' }}>
                      {item.PgmNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.Actno}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.CreStatusNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.CreDateTime).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.ApprPnoNm}
                      {item.jkcdName}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      {item.ApprStatus === 'F' && (
                        <LinkButton className={classes.SB3} onClick={() => fDisApproveOpen(item.ApprRemark)}>
                          <Box style={{ display: 'flex', alignItems: 'center' }}>
                            <Box className={classes.SB4}>{item.ApprStatusNm}</Box>
                          </Box>
                        </LinkButton>
                      )}
                      {item.ApprStatus !== 'F' && item.ApprStatusNm}
                    </Box>
                    {/* <Box className={classes.SB2} style={{ width: 101, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      <LinkButton className={classes.SB3} onClick={() => fApprOpen(item)}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SB4}>확인</Box>
                        </Box>
                      </LinkButton>
                    </Box> */}
                  </Box>
                ))}
              </PerfectScrollbar>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 950, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprViewPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {apprViewPopup === 'APPR3' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>결재요청 문서</Box>} style={{ width: 920 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ height: 350, backgroundColor: '#fff', padding: 5 }}>
            <Box border={1} borderRadius={5} borderColor="#ddd" bgcolor="#FBFBFB" style={{ height: 310, marginTop: 20, padding: 5, display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box className={classes.SB1} style={{ width: 61, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  NO.
                </Box>
                <Box className={classes.SB1} style={{ width: 130, borderLeft: 0 }}>
                  문서명
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  담당자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신일자
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  결재자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  결재상태
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  문서확인
                </Box>
              </Box>
              <PerfectScrollbar style={{ height: 310 }}>
                {apprList.appr3Info.map((item, index) => (
                  <Box key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box className={classes.SB2} style={{ width: 60, borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.rowNum}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 130, justifyContent: 'center' }}>
                      {item.PgmNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.Actno}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.CrePnoNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.CreDateTime).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.ApprPnoNm}
                      {item.jkcdName}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.ApprStatusNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 101, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      <LinkButton className={classes.SB3} onClick={() => fApprOpen(item)}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SB4}>확인</Box>
                        </Box>
                      </LinkButton>
                    </Box>
                  </Box>
                ))}
              </PerfectScrollbar>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 950, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprViewPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {apprViewPopup === 'REV1' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>리비전 참조요청 문서</Box>} style={{ width: 1110 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ height: 400, backgroundColor: '#fff', padding: 5 }}>
            <Box bgcolor="#FBFBFB" style={{ height: 370, marginTop: 10, padding: 5, display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box className={classes.SB1} style={{ width: 61, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  NO.
                </Box>
                <Box className={classes.SB1} style={{ width: 130, borderLeft: 0 }}>
                  문서명
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  리비전 문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  생산관리팀 결재자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  결재일자
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  연구개발팀 결재자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  결재일자
                </Box>
                <Box className={classes.SB1} style={{ width: 103, borderLeft: 0 }}>
                  문서확인
                </Box>
              </Box>
              <PerfectScrollbar style={{ height: 370 }}>
                {apprList.rev1Info.map((item, index) => (
                  <Box key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box className={classes.SB2} style={{ width: 60, borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.rowNum}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 130, justifyContent: 'center' }}>
                      {item.PgmNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.Actno}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.DocSource}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.ApprPnoNm}
                      {item.jkcdName}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.ApprDateTime).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.ApprPnoNm2}
                      {item.jkcdName2}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.ApprDateTime2).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 103, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      <LinkButton className={classes.SB3} onClick={() => fApprOpen(item)}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SB4}>확인</Box>
                        </Box>
                      </LinkButton>
                    </Box>
                  </Box>
                ))}
              </PerfectScrollbar>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 1110, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprViewPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {apprViewPopup === 'REV2' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>리비전 결재요청 문서</Box>} style={{ width: 970 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ height: 400, backgroundColor: '#fff', padding: 5 }}>
            <Box bgcolor="#FBFBFB" style={{ height: 370, marginTop: 10, padding: 5, display: 'flex', flexDirection: 'column' }}>
              <Box style={{ display: 'flex', flexDirection: 'row' }}>
                <Box className={classes.SB1} style={{ width: 61, height: 33, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  NO.
                </Box>
                <Box className={classes.SB1} style={{ width: 130, borderLeft: 0 }}>
                  문서명
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 150, borderLeft: 0 }}>
                  리비전 문서번호
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  담당자
                </Box>
                <Box className={classes.SB1} style={{ width: 100, borderLeft: 0 }}>
                  상신일자
                </Box>
                <Box className={classes.SB1} style={{ width: 140, borderLeft: 0 }}>
                  리비전 상태
                </Box>
                <Box className={classes.SB1} style={{ width: 103, borderLeft: 0 }}>
                  문서확인
                </Box>
              </Box>
              <PerfectScrollbar style={{ height: 370 }}>
                {apprList.rev2Info.map((item, index) => (
                  <Box key={index} style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box className={classes.SB2} style={{ width: 60, borderRight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.rowNum}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 130, justifyContent: 'center' }}>
                      {item.PgmNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.Actno}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 150, justifyContent: 'center' }}>
                      {item.DocSource}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {item.CrePnoNm}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 100, justifyContent: 'center' }}>
                      {moment(item.CreDateTime).format('YYYY-MM-DD')}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 140, justifyContent: 'center' }}>
                      {item.RevFlag}
                    </Box>
                    <Box className={classes.SB2} style={{ width: 103, justifyContent: 'center', borderRight: '1px solid #8fc0f5' }}>
                      <LinkButton className={classes.SB3} onClick={() => fApprOpen(item)}>
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                          <Box className={classes.SB4}>확인</Box>
                        </Box>
                      </LinkButton>
                    </Box>
                  </Box>
                ))}
              </PerfectScrollbar>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 970, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprViewPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {apprRemarkPopup === 'REMARK' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>결재요청 문서</Box>} style={{ width: 540 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ backgroundColor: '#fff', padding: 5 }}>
            <Box style={{ display: 'flex', flexDirection: 'row', margin: 10 }}>
              <Box className={classes.SB5}>반려사유</Box>
              <Box className={classes.SB6}>
                <Box display="flex" alignItems="center" style={{ marginLeft: 10 }}>
                  {refRemark.current}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 540, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setApprRemarkPopup('');
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}

      {revisionViewPopup === 'REFER' && (
        <Dialog title={<Box style={{ paddingLeft: 5 }}>리비전요청 내역</Box>} style={{ width: 1200 }} bodyCls="f-column" closable={false} modal>
          <Box className="f-full" style={{ backgroundColor: '#fff', padding: 5 }}>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" flexDirection="row">
                <Box display="flex" flexDirection="column" style={{ marginRight: 10 }}>
                  <Box display="flex" flexDirection="row">
                    <Box display="flex" flexDirection="row" style={{ marginTop: 5 }}>
                      <Box className={classes.P1}>
                        <Box className={classes.P2}>Rev No.</Box>
                      </Box>
                      <Box style={{ marginTop: 3 }}>
                        <TextBox className={classes.P3} readOnly value={sideBarRevVO.revno} />
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="row" style={{ marginTop: 5 }}>
                      <Box className={classes.P1}>
                        <Box className={classes.P2}>Rev 일자</Box>
                      </Box>
                      <Box style={{ marginTop: 3 }}>
                        <TextBox className={classes.P3} readOnly value={sideBarRevVO.revdate} />
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="row" style={{ marginTop: 5 }}>
                    <Box className={classes.P1}>
                      <Box className={classes.P2}>Rev History</Box>
                    </Box>
                    <TextBox style={{ width: 360, height: 264, padding: 3 }} multiline readOnly value={sideBarRevVO.revhistory} className={classes.P3} />
                  </Box>
                </Box>
                <Box ref={refSideBarGrid} style={{ width: '100%', height: 300, marginTop: 5 }} />
              </Box>
            </Box>
          </Box>
          <Box className="dialog-button">
            <Box style={{ display: 'flex', flexDirection: 'row' }}>
              <Box style={{ width: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <LinkButton
                  style={{ width: '80px', color: '#000', marginRight: 15 }}
                  onClick={() => {
                    setRevisionViewPopup('');
                    sidebar_dataProvider.destroy();
                    sidebar_gridView.destroy();
                    setSideBarRevVO({
                      ...sideBarRevVO,
                      revno: '',
                      revdate: '',
                      revhistory: '',
                    });
                  }}
                >
                  닫기
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
});

let sidebar_dataProvider;
let sidebar_gridView;

const Styles = createUseStyles({
  S1: {
    width: 212,
    height: 25,
    color: '#1f1f1f',
    fontWeight: 500,
    textAlign: 'center',
    background: 'linear-gradient(to bottom,#e0ecff 0,#c1d9fe 100%)',
  },

  S2: {
    '& .panel-body': {
      borderRightWidth: '0px',
    },
    height: 890,
  },

  S3: {
    border: '2px solid #e0ecff',
  },

  S4: {
    width: 202,
    height: 30,
    marginTop: 5,
    color: '#424242',
    borderRadius: 2,
    border: '1px solid #e4e4e4',
  },

  S5: {
    width: 142,
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
  },

  S6: {
    width: 50,
    height: 24,
    fontSize: 14,
    fontWeight: 500,
    backgroundColor: '#ffbc1b',
    borderRadius: 3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  SB1: {
    backgroundColor: '#eff5ff',
    border: '1px solid #8fc0f5',
    color: '#163971',
    padding: 5,
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  SB2: {
    height: 40,
    backgroundColor: '#fff',
    border: '1px solid #8fc0f5',
    borderTop: 0,
    borderRight: 0,
    color: '#000',
    padding: 5,
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  SB3: {
    width: 150,
    height: 30,
    color: '#424242',
    borderRadius: 2,
    border: '1px solid #e4e4e4',
  },

  SB4: {
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'left',
  },

  SB5: {
    width: 250,
    height: 40,
    backgroundColor: '#ddffdd',
    border: '1px solid #c2c2c2',
    color: '#163971',
    borderRightWidth: 0,
    paddingLeft: 10,
    padding: 5,
    fontSize: '13px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  SB6: {
    width: 1172,
    height: 40,
    backgroundColor: '#fff',
    border: '1px solid #c2c2c2',
    color: '#000',
    padding: 5,
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  P1: {
    margin: '3px 10px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    width: 110,
    fontWeight: 600,
  },

  P2: {
    width: 100,
    position: 'relative',
    display: 'inline-block',
  },
  P3: {
    width: 115,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
});

export default Sidebar;
