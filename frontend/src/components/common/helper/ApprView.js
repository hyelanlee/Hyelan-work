import React, { useEffect, useState, useRef, useCallback } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { TextBox, LinkButton, FileButton } from 'rc-easyui';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import axios from 'axios';
import { GridView, LocalDataProvider } from 'realgrid';
import ImageViewer from '@components/common/ImageViewer';
import imageCompression from 'browser-image-compression';
import { GridFields, GridColumns } from '@components/common/helper/ApprViewGrid';
import * as helper from '@components/common/helper/CodeClass';
import * as gridCtrl from '@components/common/helper/GridCtrl';
import { fReturnMinor } from '@components/common/helper/TextBoxDefault';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import Toast from '@components/common/Toast';
import Alert from '@components/common/Alert';
import imgCalendar from '@assets/images/img_calendar.png';

const ApprView = observer(({ apprUrl, docNo, docSource, imgSeq, PGMID }) => {
  const { $CommonStore, $UserStore } = useStores();
  const classes = Styles();

  const refGrid = useRef(null);
  const refDocPhoto = useRef(null);
  const refSeq = useRef(null);
  const refBtnFileInput = useRef(null);
  const refNewRowChk = useRef(null);

  const isCtrl = useRef(false);

  const [docStatus, setDocStatus] = useState('');
  const [docRemark, setDocRemark] = useState('');
  const [delvImage, setDelvImage] = useState(null);
  const [delvImageSeq, setDelvImageSeq] = useState(0);
  const [iamgeTotalCnt, setImageTotalCnt] = useState(0);
  const [imageViewerVO, setImageViewerVO] = useState({
    visible: false,
    docNo: '',
    docSource: '',
    buffer: null,
    docSeq: 0,
    totalCnt: 0,
  });
  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    description: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });
  const [toast, setToast] = useState({ visible: false, desc: '', type: 'N' });
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });

  const gridHelperApprNm = { ...helper.Default };
  gridHelperApprNm.iInId = 'B0011';
  gridHelperApprNm.iInCode1 = '001';

  const gridHelperApprPosNm = { ...helper.Default };
  gridHelperApprPosNm.iInId = 'A001';
  gridHelperApprPosNm.iInCode1 = '313';

  const lastField = 'ProcessYmd';
  const codeClassField = ['ApprNm', 'ApprPosNm'];

  const onSelectFile = async (file) => {
    const imageFile = file[0];

    const options = {
      maxSizeMB: 0.38,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      base64_encode(compressedFile);
      fSaveImage();
    } catch (error) {
      // console.log(error);
    }
  };

  const base64_encode = (files) => {
    let reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onloadend = () => {
      const base_64 = reader.result;
      let buff = new Buffer.from(base_64.split('data:image/jpeg;base64,')[1], 'base64');
      refDocPhoto.current = buff;
    };
  };

  const fImageViewerConfirm = () => {
    setImageViewerVO({ visible: false, docNo: '', docSource: '', docSeq: 0, buffer: null });
    setImageTotalCnt(0);
  };

  const fOpenNew = () => {
    if (apprUrl) {
      window.open(apprUrl, '_Blank');
    }
  };

  const fSaveImage = async () => {
    if (docNo && docSource) {
      try {
        let result = await axios.post('/@api/purchase/delv/selectByiInsSeq', {
          params: {
            iTag: 'I',
            iDocNo: docNo,
            iDocSource: docSource,
            iFactory: 'A00',
            iSeq: null,
            iPno: $UserStore.user.userid,
          },
        });

        if (result.data.iInsSeq) {
          refSeq.current = result.data.iInsSeq;
          await axios.post('/@api/purchase/delv/updateByImage', {
            params: {
              iDocNo: docNo,
              iDocSource: docSource,
              iFactory: 'A00',
              iSeq: result.data.iInsSeq,
              iPhoto: refDocPhoto.current,
            },
          });
          setDelvImageSeq(result.data.iInsSeq);
          await fGetDelvImage(docNo, docSource, result.data.iInsSeq);
          setAlert({ visible: true, desc: `${result.data.iInsSeq}번째 증빙 자료를 등록 했습니다.` });
        } else if (result.data.ErrMess) {
          setAlert({ visible: true, desc: result.data.ErrMess });
        }
      } catch (error) {
        setAlert({ visible: true, desc: '이미지 등록 중 오류가 발생했습니다.' });
      }
    } else {
      setAlert({ visible: true, desc: '필수입력 사항 누락입니다. 확인후 작업 바랍니다.' });
    }
  };

  const fArrayBufferToBase64 = (buffer) => {
    let base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    return base64;
  };

  const fGetDelvImage = async (DocNo, DocSource, Seq) => {
    try {
      let result = await axios.get('/@api/purchase/delv/selectByImageList', {
        params: {
          iDocNo: DocNo,
          iDocSource: DocSource,
          iFactory: 'A00',
          iSeq: Seq,
        },
      });

      setDelvImage(result.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAlert({ visible: true, desc: '조회결과가 없습니다.' });
        return;
      } else {
        setAlert({ visible: true, desc: '조회중 오류가 발생하였습니다.' });
        return;
      }
    }
  };

  const fGetDelvImageSeq = async (iTag, DocNo, DocSource, Seq, Factory) => {
    try {
      let result = await axios.get('/@api/purchase/delv/selectByImageSeq', {
        params: {
          iTag: iTag,
          iDocNo: DocNo,
          iDocSource: DocSource,
          iSeq: Seq,
          iFactory: Factory,
        },
      });

      const data = result.data;

      if (data.ErrMess) {
        setAlert({ visible: true, desc: data.ErrMess });
      } else {
        setDelvImageSeq(data.Seq);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setAlert({ visible: true, desc: '조회결과가 없습니다.' });
      } else {
        setAlert({ visible: true, desc: '조회중 오류가 발생하였습니다.' });
      }
    }
  };

  const fGetDelvImagePrev = async () => {
    await fGetDelvImageSeq('B', docNo, docSource, delvImageSeq, 'A00');
  };

  const fGetDelvImageNext = async () => {
    await fGetDelvImageSeq('N', docNo, docSource, delvImageSeq, 'A00');
  };

  const fSetDelvImageDetailPrev = async () => {
    await fGetDelvImageSeq('B', docNo, docSource, delvImageSeq, 'A00');
    setImageViewerVO({ visible: true, docNo: docNo, docSource: docSource, docSeq: delvImageSeq, buffer: delvImage[0].Photo });
  };

  const fSetDelvImageDetailNext = async () => {
    await fGetDelvImageSeq('N', docNo, docSource, delvImageSeq, 'A00');
    setImageViewerVO({ visible: true, docNo: docNo, docSource: docSource, docSeq: delvImageSeq, buffer: delvImage[0].Photo });
  };

  const fGetDelvImageDetail = async () => {
    try {
      let result = await axios.get('/@api/purchase/delv/selectByDelvTotalCnt', {
        params: {
          iTag: 'Q',
          iDocNo: docNo,
          iDocSource: docSource,
          iFactory: 'A00',
        },
      });

      if (result.data.TotCnt) {
        setImageTotalCnt(result.data.TotCnt);
      } else if (result.data.ErrMess) {
        setAlert({ visible: true, desc: result.data.ErrMess });
      }
    } catch (error) {
      setAlert({ visible: true, desc: '이미지 등록 중 오류가 발생했습니다.' });
    }

    if (delvImage && delvImage[0]) {
      setImageViewerVO({ visible: true, docNo: docNo, docSource: docSource, buffer: delvImage[0].Photo });
    }
  };

  const fDelDelvImage = async () => {
    if (delvImageSeq > 0) {
      try {
        let result = await axios.post('/@api/purchase/delv/deleteByImage', {
          params: {
            iTag: 'D',
            iDocNo: docNo,
            iDocSource: docSource,
            iFactory: 'A00',
            iSeq: delvImageSeq,
          },
        });

        const data = result.data;
        if (data.ErrMess) {
          setAlert({ visible: true, desc: data.ErrMess });
        } else {
          fGetDelvImageSeq('B', docNo, docSource, delvImageSeq, 'A00');
          setAlert({ visible: true, desc: '이미지를 삭제했습니다.' });
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAlert({ visible: true, desc: '조회결과가 없습니다.' });
        } else {
          setAlert({ visible: true, desc: '조회중 오류가 발생하였습니다.' });
        }
      }
    }
  };

  const fGetDocList = async (iTag, iDocNo, iDocSource, iFactory, iApprGubun, iDataSeq, iSeq, iApprSeq, iApprId, iApprPos, iCloseFlag) => {
    try {
      let result = await axios.get('/@api/purchase/delv/selectByDocList', {
        params: {
          iTag: iTag,
          iDocNo: iDocNo,
          iDocSource: iDocSource,
          iFactory: iFactory,
          iApprGubun: iApprGubun,
          iDataSeq: iDataSeq,
          iSeq: iSeq,
          iApprSeq: iApprSeq,
          iApprId: iApprId,
          iApprPos: iApprPos,
          iCloseFlag: iCloseFlag,
          iCrePno: $UserStore.user.userid,
        },
      });

      if (iTag === 'A') {
        setDocRemark(result.data[0].DocRemark);
        setDocStatus(result.data[0].DocStatus);
      } else {
        fRenderGrid();
        dataProvider.setRows(result.data);
      }
    } catch (error) {
      dataProvider.clearRows();
      if (error.response.status === 404) {
        setAlert({ visible: true, desc: '조회결과가 없습니다.' });
        return;
      } else {
        setAlert({ visible: true, desc: '조회중 오류가 발생하였습니다.' });
        return;
      }
    }
  };

  const fApprDocSave = async () => {
    if (docNo && docSource) {
      gridView.commit(true);

      const rowCount = dataProvider.getRowCount();
      let jRowsData = [];

      for (let i = 0; i < rowCount; i++) {
        const data = dataProvider.getJsonRow(i);
        jRowsData.push(data);
      }

      try {
        let result = await axios.post('/@api/purchase/delv/updateByApprDocList', {
          params: {
            iTag: 'I',
            iDocNo: docNo,
            iDocSource: docSource,
            iFactory: 'A00',
            iApprGubun: 'A',
            iDataSeq: null,
            iSeq: null,
            iCrePno: $UserStore.user.userid,
          },
          data: jRowsData,
        });
        const data = result.data;
        if (data.errmess === '') {
          setToast({ visible: true, desc: '결재라인 저장이 완료되었습니다.' });
          fGetDocList('Q', docNo, docSource, 'A00', 'A', null, null, null, null, null, null, $UserStore.user.userid);
        } else {
          setAlert({ visible: true, desc: data.errmess });
          return;
        }
      } catch (error) {
        setAlert({ visible: true, desc: '저장중 오류가 발생하였습니다' });
        return;
      }
    }
  };

  const fApprDocDel = async () => {
    let current = gridView.getCurrent().dataRow;
    try {
      let result = await axios.post('/@api/purchase/delv/updateByApprDocList', {
        params: {
          iTag: 'D',
          iDocNo: docNo,
          iDocSource: docSource,
          iFactory: 'A00',
          iApprGubun: 'A',
          iDataSeq: null,
          iSeq: current + 1,
          iCrePno: $UserStore.user.userid,
        },
      });
      const data = result.data;
      if (data.errmess === '') {
        setToast({ visible: true, desc: '결재라인 저장이 완료되었습니다.' });
        fGetDocList('Q', docNo, docSource, 'A00', 'A', null, null, null, null, null, null, $UserStore.user.userid);
      } else {
        setAlert({ visible: true, desc: data.errmess });
        return;
      }
    } catch (error) {
      setAlert({ visible: true, desc: '저장중 오류가 발생하였습니다' });
      return;
    }
  };

  const fKeyUpEvent = useCallback((e) => {
    // if (e.key === 'Shift') {
    //   isShift.current = false;
    // }
    if (e.key === 'Ctrl') {
      isCtrl.current = false;
    }
  }, []);

  const fKeyDownEvent = useCallback((e) => {
    // if (e.key === 'Shift') {
    //   isShift.current = true;
    // }
    if (e.key === 'Ctrl') {
      isCtrl.current = true;
    }
    if (e.key === 'Enter' && alert.visible) {
      setAlert({ visible: false, disc: '' });
    }
  }, []);

  const fInitGrid = () => {
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    gridView.setDataSource(dataProvider);
    dataProvider.setFields(GridFields);
    gridView.setColumns(GridColumns);

    gridView.setCheckBar({
      visible: false,
    });

    gridView.setStateBar({
      visible: false,
    });

    gridView.setRowIndicator({
      visible: false,
    });

    gridView.setEditOptions({
      editable: true,
      appendable: true,
    });

    gridView.sortingOptions.enabled = false;
    gridView.setFooters({ visible: false });
    gridView.displayOptions.selectionStyle = 'singleRow';
    gridView.displayOptions.columnMovable = false;
    gridView.setOptions({ summaryMode: 'statistical' });

    gridView.displayOptions.rowHeight = 25;

    gridView.onCellButtonClicked = async (grid) => {
      const itemIndex = grid.getCurrent().itemIndex;
      const fieldName = grid.getCurrent().fieldName;
      if (codeClassField.indexOf(fieldName) !== -1) {
        grid.commit(true);
        const value = grid.getValue(itemIndex, fieldName);
        let codeClassValue = {};
        if (fieldName === 'ApprNm') {
          codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprNm, PGMID, value, true);
        } else if (fieldName === 'ApprPosNm') {
          codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprPosNm, PGMID, value, true);
        }
        setCodeClassInputs(codeClassValue);
      }
    };

    gridView.onKeyDown = onKeyDown;
  };

  const onKeyDown = async (grid, event) => {
    const rowCount = grid.getItemCount();
    const fieldName = grid.getCurrent().fieldName;
    let itemIndex = grid.getCurrent().itemIndex;
    const createdCount = dataProvider.getRowStateCount('created');

    if (event.key === 'ArrowDown') {
      itemIndex += 1;
      if (rowCount <= itemIndex && refNewRowChk.current === false) {
        refNewRowChk.current = true;
        dataProvider.addRow(['', '', '', '', '']);
        dataProvider.setRowState(itemIndex, '', true);
      }
    }

    if (event.key === 'ArrowUp') {
      itemIndex -= 1;
      if (rowCount >= itemIndex && refNewRowChk.current === true) {
        refNewRowChk.current = false;
        dataProvider.removeRow(itemIndex + 1);
      }
    }

    if (event.key === 'Delete') {
      grid.commit();
      if (fieldName === 'ApprNm') {
        dataProvider.setValue(itemIndex, 'ApprId', '');
      } else if (fieldName === 'ApprPosNm') {
        dataProvider.setValue(itemIndex, 'ApprPos', '');
      }
    }

    if (event.key === 'Enter') {
      grid.commit();

      if (alert.visible) {
        setAlert({ visible: false, disc: '' });
      }

      if (fieldName === lastField) {
        itemIndex += 1;
        if (rowCount <= itemIndex && refNewRowChk.current === false) {
          refNewRowChk.current = true;
          dataProvider.addRow(['', '', '', '', '']);
          dataProvider.setRowState(itemIndex + 1, '', true);
        } else {
          grid.setCurrent({ itemIndex: itemIndex, column: 0 });
        }
      } else if (codeClassField.indexOf(fieldName) !== -1) {
        grid.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
        const value = grid.getValue(itemIndex, fieldName);
        let codeClassValue = {};

        if (fieldName === 'ApprNm') {
          codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprNm, PGMID, value, false);
        } else if (fieldName === 'ApprPosNm') {
          codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprPosNm, PGMID, value, false);
        }
        setCodeClassInputs(codeClassValue);
      }
      grid.setFocus();
    }

    if (event.key === 'Escape') {
      if (rowCount - createdCount <= itemIndex && itemIndex !== 0) {
        dataProvider.removeRow(itemIndex);
        if (itemIndex + 1 === rowCount) {
          refNewRowChk.current = false;
        }
      } else if (rowCount >= itemIndex && refNewRowChk.current === true && itemIndex !== 0) {
        itemIndex -= 1;
        refNewRowChk.current = false;
        dataProvider.removeRow(itemIndex + 1);
      }
    }

    // if (isCtrl.current === false && event.key === 'F9') {
    //   if (codeClassField.indexOf(fieldName) !== -1) {
    //     grid.commit(true);
    //     const value = grid.getValue(itemIndex, fieldName);
    //     let codeClassValue = {};

    //     if (fieldName === 'ApprNm') {
    //       codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprNm, PGMID, value, true);
    //     } else if (fieldName === 'ApprPosNm') {
    //       codeClassValue = await gridCtrl.gridCodeClass(grid.getCurrent(), gridHelperApprPosNm, PGMID, value, true);
    //     }

    //     setCodeClassInputs(codeClassValue);
    //   }
    // }
  };

  const fRenderGrid = () => {
    gridView.orderBy([], []);
  };

  const fCodeClaseConfirmFunc = async () => {
    gridView.commit(true);
    const clickData = codeClassInputs.selectedData;
    if (clickData.column === 'ApprNm') {
      const obj = fReturnMinor('pno', $CommonStore.Codeclass.selData);
      dataProvider.setValue(clickData.dataRow, 'ApprId', obj.minorcd);
      dataProvider.setValue(clickData.dataRow, clickData.column, obj.minornm);
    } else if (clickData.column === 'ApprPosNm') {
      const obj = fReturnMinor('ApprPosNm', $CommonStore.Codeclass.selData);
      dataProvider.setValue(clickData.dataRow, 'ApprPos', obj.minorcd);
      dataProvider.setValue(clickData.dataRow, clickData.column, obj.minornm);
    }
    gridView.commit(true);
    setCodeClassInputs({ visible: false, desc: '', value: '', datas: {}, selectedData: {}, id: '', viewId: '' });
    gridView.setFocus();
  };

  const fCodeClassConfirmCancel = () => {
    const itemIndex = gridView.getCurrent().itemIndex;
    const fieldName = dataProvider.getFieldName(gridView.getCurrent().fieldIndex - 1);
    gridView.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
    gridView.setFocus();

    setCodeClassInputs({ visible: false });
  };

  useEffect(() => {
    fInitGrid();
    document.addEventListener('keydown', fKeyDownEvent);
    document.addEventListener('keyup', fKeyUpEvent);
  }, []);

  useEffect(() => {
    if (docNo && docSource && delvImageSeq) {
      fGetDocList('A', docNo, docSource, 'A00', null, null, null, null, null, null, null, $UserStore.user.userid);
      fGetDocList('Q', docNo, docSource, 'A00', 'A', null, null, null, null, null, null, $UserStore.user.userid);
      fGetDelvImage(docNo, docSource, delvImageSeq);
    } else {
      setDocRemark('');
      setDocStatus('');
      setDelvImageSeq(0);
      dataProvider.clearRows();
    }
  }, [docNo, docSource, delvImageSeq]);

  useEffect(() => {
    if (imgSeq) {
      setDelvImageSeq(imgSeq);
    }
  }, [imgSeq]);

  return (
    <>
      {/* 증빙자료 및 결재 */}
      <Box style={{ width: 350, height: 422, marginLeft: 25 }}>
        <Box style={{ marginRight: 10, marginBottom: 20 }}>
          <TextBox style={{ width: '100%', height: 40 }} className={classes.InputBox6} editable={false} disabled value={docStatus} />
        </Box>
        <Box style={{ margin: 1, display: 'flex', alignItems: 'end' }}>
          <Box style={{ width: 260, height: 230, border: '1px solid #95b8e7' }}>
            {delvImage && delvImage[0] && delvImage[0].Photo && (
              <img src={`data:image/png;base64,${fArrayBufferToBase64(delvImage[0].Photo.data)}`} alt="DelvImage" style={{ width: '100%', height: '100%' }} />
            )}
          </Box>
          <Box>
            <Box style={{ marginTop: 3, marginLeft: 4, width: 80 }}>
              <FileButton style={{ width: '100%' }} name="imgUpload" onSelect={onSelectFile} ref={refBtnFileInput} accept="image/jpeg">
                이미지등록
              </FileButton>
            </Box>
            <Box style={{ marginTop: 10, marginLeft: 4, width: 80 }}>
              <LinkButton onClick={fDelDelvImage}>이미지삭제</LinkButton>
            </Box>
            <Box style={{ marginTop: 20, marginLeft: 4, width: 80 }}>
              <LinkButton style={{ width: '100%' }} onClick={fGetDelvImageDetail}>
                크게보기
              </LinkButton>
            </Box>
            <Box style={{ marginTop: 10, marginLeft: 4, display: 'grid' }}>
              <TextBox style={{ width: 60 }} className={classes.InputBox5} editable={false} value={delvImageSeq} />
              <Box style={{ display: 'flex', marginTop: 5 }}>
                <LinkButton style={{ width: 30 }} onClick={fGetDelvImagePrev}>
                  {'<'}
                </LinkButton>
                <LinkButton style={{ width: 30 }} onClick={fGetDelvImageNext}>
                  {'>'}
                </LinkButton>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginLeft: 1, marginTop: 20, display: 'flex', alignItems: 'center' }}>
          <Box className={classes.TitleBox3}>
            <span className={classes.TitleText}>전자결재문서</span>
          </Box>
          <TextBox style={{ marginLeft: 10 }} className={classes.TitleText3} value={apprUrl} />
          <LinkButton style={{ marginLeft: 5 }} onClick={fOpenNew}>
            문서보기
          </LinkButton>
        </Box>
      </Box>
      <Box style={{ width: 350, height: 422, marginLeft: 25 }}>
        <Box>
          <Box className={classes.TitleBox3}>
            <span className={classes.TitleText}>상신자의견</span>
          </Box>
          <TextBox style={{ width: '100%', height: 130, padding: 5 }} multiline className={classes.TitleText4} value={docRemark} name="DocRemark" />
        </Box>
        <Box style={{ marginTop: 20 }}>
          <Box style={{ display: 'flex' }}>
            <Box className={classes.TitleBox3}>
              <span className={classes.TitleText}>결재라인</span>
            </Box>
            <Box style={{ width: '100%', heigth: '29px', margin: '3px 0px', padding: '3px 0px', display: 'flex', justifyContent: 'flex-end' }}>
              <LinkButton style={{ marginRight: 10 }} onClick={fApprDocSave}>
                저장
              </LinkButton>
              <LinkButton onClick={fApprDocDel}>삭제</LinkButton>
            </Box>
          </Box>
          <Box ref={refGrid} style={{ width: '100%', height: 160, marginTop: 5 }} />
        </Box>
      </Box>

      <CodeclassConfirm
        visible={codeClassInputs.visible}
        description={codeClassInputs.desc}
        value={codeClassInputs.value}
        datas={codeClassInputs.datas}
        id={codeClassInputs.id}
        viewId={codeClassInputs.viewId}
        selectedData={codeClassInputs.selectedData}
        onConfirm={fCodeClaseConfirmFunc}
        onCancel={fCodeClassConfirmCancel}
      />
      <ImageViewer
        visible={imageViewerVO.visible}
        docNo={docNo}
        docSource={docSource}
        docSeq={delvImageSeq}
        buffer={delvImage && delvImage[0] && delvImage[0].Photo ? delvImage[0].Photo : null}
        totalCnt={iamgeTotalCnt}
        onConfirm={fImageViewerConfirm}
        onPrev={fSetDelvImageDetailPrev}
        onNext={fSetDelvImageDetailNext}
      />

      <Toast visible={toast.visible} description={toast.desc} type={toast.type} onConfirm={() => setToast({ visible: false })} />
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

let dataProvider;
let gridView;

const Styles = createUseStyles({
  S1: {
    '& .panel-header': {
      borderRightWidth: 0,
      height: 35,
    },
  },
  S2: {
    '& .panel-body': {
      borderRightWidth: 0,
    },
  },

  TitleBox: {
    margin: '3px 10px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    width: 90,
    fontWeight: 600,
  },

  TitleBox2: {
    margin: '3px 3px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    width: 70,
    fontWeight: 600,
  },

  TitleBox3: {
    margin: '3px 1px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 29,
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    width: 80,
    fontWeight: 600,
  },

  TitleText: {
    width: 80,
  },

  TitleText2: {
    width: 60,
  },

  TitleText3: {
    width: 180,
  },

  TitleText4: {
    width: 170,
    '& textarea': {
      fontSize: '12px !important',
      fontFamily: 'Noto Sans KR',
    },
  },

  CB: {
    width: '15px!important',
    height: '15px!important',
    border: '1px solid #3c96ff',
    marginTop: '1px',
    '& .checkbox-checked': {
      border: 0,
      background: '#3c96ff',
    },
  },

  LabelText: {
    marginLeft: 8,
    width: 147,
    fontSize: '12px',
    color: '#848484',
  },

  InputBox: {
    width: 150,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },

  InputBox2: {
    width: 30,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },

  InputBox3: {
    marginLeft: 5,
    width: 140,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },

  InputBox4: {
    width: 150,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'right',
    },
  },

  InputBox5: {
    width: 150,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'center',
    },
  },

  InputBox6: {
    width: 150,
    height: 25,
    '& input': {
      fontSize: '20px !important',
      textAlign: 'center',
    },
  },

  RB1: {
    width: '15px!important',
    height: '15px!important',
  },

  DateFont: {
    '& .textbox-text': {
      fontSize: '12px',
    },
    '& .textbox': {
      fontSize: '12px',
    },
    '& .combo-arrow': {
      backgroundImage: `url(${imgCalendar})`,
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#ffffff!important',
      height: 12,
    },
  },

  ComboStyle: {
    width: 90,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
});

export default ApprView;
