import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { GridView, LocalDataProvider } from 'realgrid';
import axios from 'axios';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import Alert from '@components/common/Alert';
import { GridColumns, GridFields } from '@components/common/Attachments/AttachmentsGrid';
import { Utility } from '@components/common/Utility/Utility';

const AttachmentsList = observer(({ PGMID, FileType, FileNo, RevNo, Retrieve, GetDataSource }) => {
  const { $UserStore } = useStores();

  const refGrid = useRef(null);

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, false);

  const fInitGrid = () => {
    Util.Grid.fContainerInit(Util.Common.fMakeId('Grid1'));
    dataProvider = new LocalDataProvider(false);
    gridView = new GridView(refGrid.current);
    Util.Grid.fInitGridHeader(gridView, dataProvider, GridFields, GridColumns, 27);
    gridView.setRowIndicator({ visible: false });
    gridView.setEditOptions({
      editable: true,
      appendable: false,
    });
    gridView.registerCustomRenderer('Renderer_FileBtn', {
      initContent: function (parent) {
        parent.appendChild((this._downloadButtn = document.createElement('span')));
      },

      canClick: function () {
        return true;
      },

      clearContent: function (parent) {
        parent.innerHTML = '';
      },

      render: function (grid, model) {
        this._fileSeq = grid.getValue(model.index._itemIndex, 'FileSeq');
        this._filePath = grid.getValue(model.index._itemIndex, 'FilePath');
        this._fileName = grid.getValue(model.index._itemIndex, 'FileName');
        this._originalfileName = grid.getValue(model.index._itemIndex, 'OriginalFileName');
        this._downloadButtn.className = 'grid_fileDown_button';
      },

      click: function (event) {
        event.preventDefault;
        if (event.target === this._downloadButtn) {
          var downElement = document.createElement('a');
          downElement.download = this._originalfileName;
          downElement.href = Util.Common.fGetFilePath(this._filePath) + '/' + this._fileName;
          downElement.click();
        }
      },
    });
    gridView.registerCustomRenderer('Renderer_FileDeleteBtn', {
      initContent: function (parent) {
        parent.appendChild((this._deleteBtn = document.createElement('span')));
      },

      canClick: function () {
        return true;
      },

      clearContent: function (parent) {
        parent.innerHTML = '';
      },

      render: function (grid, model) {
        this._fileSeq = grid.getValue(model.index._itemIndex, 'FileSeq');
        this._filePath = grid.getValue(model.index._itemIndex, 'FilePath');
        this._fileName = grid.getValue(model.index._itemIndex, 'FileName');
        this._originalfileName = grid.getValue(model.index._itemIndex, 'OriginalFileName');
        this._deleteBtn.className = 'grid_filedelete_button';
      },

      click: async function (event) {
        event.preventDefault;
        if (event.target === this._deleteBtn) {
          try {
            const paramVO = {};
            paramVO.FilePath = this._filePath;
            paramVO.FileName = this._fileName;

            await axios.post('/@api/common/attachments/deleteByFile', { data: paramVO });

            paramVO.FileType = FileType;
            paramVO.FileNo = FileNo;
            paramVO.RevNo = RevNo;
            paramVO.FileSeq = this._fileSeq;
            paramVO.Factory = $UserStore.user.factory;

            const result2 = await axios.post('/@api/common/attachments/deleteByAttachments', {
              data: paramVO,
            });
            const rdata2 = result2.data;

            if (rdata2.errmess === '') {
              setTimeout(() => {
                fSearch();
              }, 50);
            } else {
              setAlert({ visible: true, desc: rdata2.errmess, type: 'W' });
            }
          } catch (error) {
            setAlert({ visible: true, desc: '첨부파일 삭제중 오류가 발생하였습니다.', type: 'E' });
          }
        }
      },
    });
  };

  const fSearch = async () => {
    if (Util.Common.fValidate(Util.Common.fEmptyReturn(FileType) === '' || Util.Common.fEmptyReturn(FileNo) === '', '첨부파일을 조회할 수 없습니다.')) {
      return;
    }

    const paramVO = {};
    paramVO.FileType = FileType;
    paramVO.FileNo = FileNo;
    paramVO.RevNo = RevNo;
    paramVO.UserPno = $UserStore.user.userid;
    paramVO.Factory = $UserStore.user.factory;

    try {
      const result = await Util.Command.fSearchByReturnTrim('/@api/common/attachments/selectByAttachments', paramVO);

      if (result) {
        dataProvider.setRows(result);
        GetDataSource(dataProvider);
      } else {
        dataProvider.clearRows();
      }
    } catch (error) {
      setAlert({ visible: true, desc: `조회 중 오류가 발생하였습니다..${error}` });
    }
  };

  useEffect(() => {
    fInitGrid();
    fSearch();
  }, []);

  useEffect(() => {
    if (Util.Common.fEmptyReturn(Retrieve) === '') {
      return;
    }
    fSearch();
  }, [Retrieve]);

  return (
    <>
      <Box ref={refGrid} id={Util.Common.fMakeId('Grid1')} style={{ width: '100%', height: 269 }} />
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

let dataProvider;
let gridView;

export default AttachmentsList;
