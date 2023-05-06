import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useStores from '@stores/useStores';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { LinkButton } from 'rc-easyui';
import { AiOutlineFileAdd, AiOutlineFileSearch } from 'react-icons/ai';
import { BiWindowClose } from 'react-icons/bi';
import { VscSave } from 'react-icons/vsc';
import { TiPrinter } from 'react-icons/ti';
import { BsTrash } from 'react-icons/bs';
import { RiFileUploadLine } from 'react-icons/ri';

const CommonButton = observer(({ pgmid, visible = '111111', onNew, onSearch, onSave, onDelete, onPrint, onAttachment }) => {
  const { $CommonStore, $UserStore, $TabStore, $RouteStore } = useStores();
  const history = useHistory();
  const location = useLocation();

  const refPgmid = useRef(pgmid);
  const refisKeyUp = useRef(true);

  const [btnNew] = useState($UserStore.fCheckAuth(`${pgmid}|NEW`));
  const [btnSearch] = useState($UserStore.fCheckAuth(`${pgmid}|SEARCH`));
  const [btnSave] = useState($UserStore.fCheckAuth(`${pgmid}|SAVE`));
  const [btnDelete] = useState($UserStore.fCheckAuth(`${pgmid}|DELETE`));
  const [btnPrint] = useState($UserStore.fCheckAuth(`${pgmid}|PRINT`));
  const [btnAttachment] = useState($UserStore.fCheckAuth(`${pgmid}|ATTACHMENT`));

  const fClose = () => {
    const nextTabs = $TabStore.tabs.filter((item) => item.path !== location.pathname);
    $TabStore.fSetTab(nextTabs);
    if (nextTabs.length === 0) {
      history.push('/main');
    } else {
      const lastItem = nextTabs[nextTabs.length - 1];
      history.push(lastItem.path);
    }
  };

  const fKeyDownEvent = useCallback((e) => {
    if (e.key === 'F8' && btnNew) {
      $CommonStore.fSetHotKey({ pgmid: refPgmid.current, key: 'NEW' });
    } else if (e.key === 'F9' && btnSearch) {
      $CommonStore.fSetHotKey({ pgmid: refPgmid.current, key: 'SEARCH' });
    } else if (e.key === 'F10' && btnSave) {
      $CommonStore.fSetHotKey({ pgmid: refPgmid.current, key: 'SAVE' });
    } else if (e.key === 'F11' && btnDelete) {
      $CommonStore.fSetHotKey({ pgmid: refPgmid.current, key: 'DELETE' });
    } else if (e.key === 'F12' && btnPrint) {
      $CommonStore.fSetHotKey({ pgmid: refPgmid.current, key: 'PRINT' });
    } else if (e.key === 'Shift') {
      if (refisKeyUp.current) {
        refisKeyUp.current = false;
        $CommonStore.fSetShift(true);
      }
    }
  }, []);

  const fKeyUpEvent = useCallback((e) => {
    if (e.key === 'Shift') {
      refisKeyUp.current = true;
      $CommonStore.fSetShift(false);
    }
  }, []);

  useEffect(() => {
    const route = $RouteStore.routes.find((item) => item.path === location.pathname);
    if (route) {
      refPgmid.current = route.pgmid;
      if (route.pgmid === pgmid) {
        document.addEventListener('keydown', fKeyDownEvent);
        document.addEventListener('keyup', fKeyUpEvent);
      } else {
        document.removeEventListener('keydown', fKeyDownEvent);
        document.removeEventListener('keyup', fKeyUpEvent);
      }
    } else {
      document.removeEventListener('keydown', fKeyDownEvent);
      document.removeEventListener('keyup', fKeyUpEvent);
    }
  }, [location.pathname]);

  return (
    <>
      <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ padding: 10, borderBottom: '1px solid #e2e2e2' }}>
        <Box display="flex" flexDirection="row">
          {visible[0] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} disabled={!btnNew} onClick={onNew}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AiOutlineFileAdd size={18} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>신규</Box>
                  <Box style={{ marginLeft: 4, paddingTop: 5, fontSize: 'x-small' }}>F8</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          {visible[1] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c9" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} disabled={!btnSearch} onClick={onSearch}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AiOutlineFileSearch size={18} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>열기</Box>
                  <Box style={{ marginLeft: 4, paddingTop: 5, fontSize: 'x-small' }}>F9</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          {visible[2] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c4" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} disabled={!btnSave} onClick={onSave}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <VscSave size={18} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>저장</Box>
                  <Box style={{ marginLeft: 4, paddingTop: 5, fontSize: 'x-small' }}>F10</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          {visible[3] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c11" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} disabled={!btnDelete} onClick={onDelete}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BsTrash size={18} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>삭제</Box>
                  <Box style={{ marginLeft: 4, paddingTop: 5, fontSize: 'x-small' }}>F11</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          {visible[4] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton className="c12" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} disabled={!btnPrint} onClick={onPrint}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TiPrinter size={20} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>인쇄</Box>
                  <Box style={{ marginLeft: 4, paddingTop: 5, fontSize: 'x-small' }}>F12</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          {visible[5] === '1' && (
            <Box style={{ marginRight: 12 }}>
              <LinkButton style={{ width: 120, height: 34, color: '#424242', borderRadius: 3, background: '#a9cff9' }} disabled={!btnAttachment} onClick={onAttachment}>
                <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiFileUploadLine size={20} />
                  <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>첨부파일</Box>
                </Box>
              </LinkButton>
            </Box>
          )}
          <Box>
            <LinkButton className="c10" style={{ width: 120, height: 34, color: '#424242', borderRadius: 3 }} onClick={fClose}>
              <Box style={{ width: 120, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BiWindowClose size={20} />
                <Box style={{ marginLeft: 5, fontSize: 16, paddingBottom: 2, fontWeight: 500 }}>종료</Box>
              </Box>
            </LinkButton>
          </Box>
        </Box>
      </Box>
    </>
  );
});

export default React.memo(CommonButton);
