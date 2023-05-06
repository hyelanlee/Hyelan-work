import numeral from 'numeral';
import axios from 'axios';
import moment from 'moment';

export class Grid {
  constructor(setalert) {
    this.setAlert = setalert;
  }

  /**
   * [Header 그리드 초기화]
   * @param {*GridView} view
   * @param {*DataProvider} provider
   * @param {*GridFields} gridFields
   * @param {*GridColumns} gridColumns
   * @param {*onCurrentChanged 이벤트 핸들러} currentChanged
   * @param {*onCellClicked 이벤트 핸들러} cellClicked
   */
  fInitGridHeader = (view, provider, gridFields, gridColumns, height = 30, currentRowChanged = undefined, cellClicked = undefined, keyconfig = undefined, excelTitle = undefined) => {
    view.setDataSource(provider);
    provider.setFields(gridFields);
    view.setColumns(gridColumns);
    view.setCheckBar({ visible: false });
    view.setStateBar({ visible: false });
    view.setFooters({ visible: false });
    view.setRowIndicator({ visible: true });
    view.setCopyOptions({ singleMode: true, enabled: true });
    view.setEditOptions({
      editable: false,
      appendable: false,
    });
    view.sortingOptions.enabled = true;
    view.setDisplayOptions({ focusVisible: false, selectionStyle: 'singleRow', selectionMode: 'none', columnMovable: false, fitStyle: 'fill' });
    view.displayOptions.rowHeight = height;
    view.setRowStyleCallback(() => {
      return 'rg-text-black-color';
    });
    view.setContextMenu([
      {
        label: '엑셀 다운로드',
      },
    ]);

    view.onContextMenuPopup = (grid, x, y, elementName) => {
      elementName.cellType === 'data';
    };

    view.onContextMenuItemClicked = async (grid, label) => {
      const labelTitle = label.label;

      if (labelTitle === '엑셀 다운로드') {
        if (provider.getRowCount()) {
          view.exportGrid({
            compatibility: true,
            type: 'excel',
            target: 'local',
            applyDynamicStyles: true,
            fileName: `${excelTitle}_${moment(new Date()).format('YYYYMMDD')}.xlsx`,
          });
        }
      }
    };

    if (currentRowChanged != undefined) {
      view.onCurrentRowChanged = currentRowChanged;
    }
    if (cellClicked != undefined) {
      view.onCellClicked = cellClicked;
    }
    if (keyconfig != undefined) {
      view.onKeyDown = keyconfig;
    }
  };

  /**
   * [Detail 그리드 초기화]
   * @param {*GridView} view
   * @param {*DataProvider} provider
   * @param {*GridFields} gridFields
   * @param {*GridColumns} gridColumns
   * @param {*onCellButtonClicked 이벤트 핸들러} cellbuttonClicked
   * @param {*onCellEdited 이벤트 핸들러} cellEdited
   * @param {*onKeyDown 이벤트 핸들러} keyconfig
   */
  fInitGridDetail = (view, provider, gridFields, gridColumns, cellbuttonClicked = undefined, cellEdited = undefined, keyconfig = undefined, excelTitle = undefined, isCheckOption = false) => {
    view.setDataSource(provider);
    provider.setFields(gridFields);
    view.setColumns(gridColumns);
    view.setCheckBar({ visible: true });
    view.setStateBar({ visible: true });
    view.setFooters({ visible: false });
    view.setRowIndicator({ visible: true });
    view.setEditOptions({
      insertable: false,
      appendable: false,
      editable: true,
      useTabKey: false,
    });
    view.setCopyOptions({ singleMode: true, enabled: true });
    view.sortingOptions.enabled = false;
    view.setDisplayOptions({ focusVisible: true, selectionStyle: 'rows', selectionMode: 'none', columnMovable: false, fitStyle: 'none', rowHeight: 25 });
    view.setOptions({ summaryMode: 'aggregate' });
    view.displayOptions.rowHeight = 27;
    view.setRowStyleCallback(() => {
      return 'rg-text-black-color';
    });
    view.editOptions.commitLevel = 'warning';
    view.commit();

    if (isCheckOption) {
      view.setContextMenu([
        {
          label: '엑셀 다운로드',
        },
        {
          label: '전체체크',
        },
        {
          label: '체크해제',
        },
      ]);
    } else {
      view.setContextMenu([
        {
          label: '엑셀 다운로드',
        },
      ]);
    }

    view.onContextMenuPopup = (grid, x, y, elementName) => {
      elementName.cellType === 'data';
    };

    view.onContextMenuItemClicked = async (grid, label, column) => {
      const labelTitle = label.label;

      if (labelTitle === '엑셀 다운로드') {
        if (provider.getRowCount()) {
          view.exportGrid({
            compatibility: true,
            type: 'excel',
            target: 'local',
            applyDynamicStyles: true,
            fileName: `${excelTitle}_${moment(new Date()).format('YYYYMMDD')}.xlsx`,
          });
        }
      } else if (labelTitle === '전체체크') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'Y');
          });
        }
      } else if (labelTitle === '체크해제') {
        if (grid.getColumnProperty(column.column, 'renderer') === undefined) {
          return;
        }

        if (grid.getColumnProperty(column.column, 'renderer').type === 'check' && grid.getColumnProperty(column.column, 'renderer').editable !== false) {
          const rows = grid.getDataSource().getRows();
          rows.forEach((item, index) => {
            grid.getDataSource().setValue(index, column.column, 'N');
          });
        }
      }
    };
    if (cellbuttonClicked != undefined) {
      view.onCellButtonClicked = cellbuttonClicked;
    }
    if (cellEdited != undefined) {
      view.onCellEdited = cellEdited;
    }
    if (keyconfig != undefined) {
      view.onKeyDown = keyconfig;
    }
  };

  /**
   * [Tree 그리드 초기화]
   * @param {*GridView} view
   * @param {*DataProvider} provider
   * @param {*GridFields} gridFields
   * @param {*GridColumns} gridColumns
   */
  fInitGridTree = (view, provider, gridFields, gridColumns) => {
    provider.setFields(gridFields);
    view.setDataSource(provider);
    view.setColumns(gridColumns);
    view.setCheckBar({ visible: false });
    view.setStateBar({ visible: false });
    view.setRowIndicator({ visible: true });
    view.setDisplayOptions({ focusVisible: false, selectionStyle: 'singleRow', selectionMode: 'none', columnMovable: false, fitStyle: 'fill' });
    view.setFooters({ visible: false });
    view.sortingOptions.enabled = false;
    view.displayOptions.columnMovable = false;
    view.setEditOptions({
      editable: false,
      appendable: false,
    });
    view.setRowStyleCallback(() => {
      return 'rg-text-black-color';
    });
    view.treeOptions.iconVisible = true;
    view.setOptions({ summaryMode: 'statistical' });
  };

  /**
   * [그리드 유효성 검사]
   * @param {*DataProvider} provider
   * @param {*리턴값} returnValue
   * @param {*유효성 대상 필드} target
   * @param {*메시지} message
   * @returns
   */
  fCheckGridData = (provider, returnValue, target, message = null) => {
    const source = provider.getRows();

    let createSource = provider.getStateRows('created');
    let updateSource = provider.getStateRows('updated');

    let isValidate = '';

    source.forEach((row, index) => {
      createSource.forEach((cindex) => {
        if (index === cindex) {
          const rowData = provider.getJsonRow(index);
          for (const [key, value] of Object.entries(target)) {
            if (typeof rowData[key] == 'number') {
              if (rowData[key] === undefined || rowData[key] == null || rowData[key] == 0) {
                isValidate = value;
                return;
              }
            } else {
              if (rowData[key] === undefined || rowData[key] == null || this.fEmptyReturn(rowData[key] === '')) {
                isValidate = value;
                return;
              }
            }
          }
          returnValue.push(rowData);
        }
      });

      if (isValidate != '') {
        return;
      }

      updateSource.forEach((uindex) => {
        if (index === uindex) {
          const rowData2 = provider.getJsonRow(index);
          for (const [key, value] of Object.entries(target)) {
            if (typeof rowData2[key] == 'number') {
              if (rowData2[key] === undefined || rowData2[key] == null || rowData2[key] == 0) {
                isValidate = value;
                return;
              }
            } else {
              if (rowData2[key] === undefined || rowData2[key] == null || this.fEmptyReturn(rowData2[key] === '')) {
                isValidate = value;
                return;
              }
            }
          }
          returnValue.push(rowData2);
        }
      });
      if (isValidate != '') {
        return;
      }
    });

    if (isValidate != '') {
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 그리드 [' + isValidate + '] 필수값 누락', type: 'W' });
      return isValidate;
    }
  };

  /**
   * [그리드(전체) 유효성 검사]
   * @param {*DataProvider} provider
   * @param {*리턴값} returnValue
   * @param {*유효성 대상 필드} target
   * @param {*메시지} message
   * @returns
   */
  fCheckGridDataAll = (provider, returnValue, target, message = null) => {
    const source = provider.getRows();

    let isValidate = '';

    source.forEach((row, index) => {
      const rowData = provider.getJsonRow(index);
      for (const [key, value] of Object.entries(target)) {
        if (typeof rowData[key] == 'number') {
          if (rowData[key] === undefined || rowData[key] == null || rowData[key] == 0) {
            isValidate = value;
            return;
          }
        } else {
          if (rowData[key] === undefined || rowData[key] == null || this.fEmptyReturn(rowData[key] === '')) {
            isValidate = value;
            return;
          }
        }
      }
      returnValue.push(rowData);
      if (isValidate != '') {
        return;
      }
    });

    if (isValidate != '') {
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 그리드 [' + isValidate + '] 필수값 누락', type: 'W' });
      return isValidate;
    }
  };

  /**
   * [Insert 키 이벤트 핸들러]
   * @param {*그리드} grid
   * @param {*아이템 인덱스} itemIndex
   * @param {*유효성 체크} rowchk
   * @param {*키필드} keyField
   */
  fKeyInsert = (grid, itemIndex, rowchk, keyField = undefined, isformat = true) => {
    grid.commit(true);
    if (rowchk) {
      grid.getDataSource().insertRow(itemIndex, []);

      const rows = grid.getDataSource().getRows();
      rows.map((item, index) => {
        if (itemIndex <= index && keyField != undefined) {
          if (isformat) {
            grid.getDataSource().setValue(index, keyField, numeral(index + 1).format('000'));
          } else {
            grid.getDataSource().setValue(index, keyField, index + 1);
          }
        }
      });
    }
  };

  /**
   * [다운 키 이벤트 핸들러]
   * @param {*그리드} grid
   * @param {*아이템 인덱스} itemIndex
   * @param {*전체 행 갯수} rowCount
   * @param {*유효성 체크} rowchk
   * @param {*키필드} keyField
   */
  fArrowDown = (grid, itemIndex, rowCount, rowchk, keyField = undefined, isformat = true) => {
    grid.commit(true);
    itemIndex += 1;
    if (rowCount <= itemIndex && rowchk) {
      grid.getDataSource().addRow([]);
      if (keyField != undefined) {
        if (isformat) {
          grid.getDataSource().setValue(itemIndex, keyField, numeral(itemIndex + 1).format('000'));
        } else {
          grid.getDataSource().setValue(itemIndex, keyField, itemIndex + 1);
        }
      }
    }
  };

  /**
   * [업 키 이벤트 핸들러]
   * @param {*그리드} grid
   * @param {*아이템 인덱스} itemIndex
   * @param {*전체 행 갯수} rowCount
   * @param {*유효성 체크} rowchk
   */
  fArrowUp = (grid, itemIndex, rowCount, rowchk) => {
    if (itemIndex === -1) {
      return;
    }

    grid.commit(true);
    if (grid.getDataSource().getRowState(itemIndex) === 'created') {
      if (rowCount - grid.getDataSource().getRowStateCount('created') <= itemIndex && rowchk && itemIndex > 0) {
        grid.getDataSource().removeRow(itemIndex);
      }
    }
  };

  /**
   * [ESC 키 이벤트 핸들러]
   * @param {*그리드} grid
   * @param {*아이템 인덱스} itemIndex
   * @param {*전체 행 갯수} rowCount
   * @param {*키필드} keyField
   */
  fEscape = (grid, itemIndex, rowCount, keyField, isformat = true) => {
    if (rowCount > 0 && itemIndex >= 0) {
      grid.commit(true);
      if (grid.getDataSource().getRowState(itemIndex) === 'created') {
        grid.getDataSource().removeRow(itemIndex);
        const rows = grid.getDataSource().getRows();

        rows.map((item, index) => {
          if (itemIndex <= index) {
            if (isformat) {
              grid.getDataSource().setValue(index, keyField, numeral(index + 1).format('000'));
            } else {
              grid.getDataSource().setValue(index, keyField, index + 1);
            }
          }
        });
        setTimeout(() => {
          if (grid.getDataSource().getRowCount() < 1) {
            grid.getDataSource().addRow([]);
          }
        });
      }
    }
  };

  /**
   * [TAB 키 이벤트 핸들러]
   * @param {*포커스 대상 그리드} view
   * @param {*유효성 체크} rowchk
   * @param {*키 필드명} fieldName
   */
  fTab = (view, rowchk, fieldName) => {
    const rowCount1 = view.getDataSource().getRowCount();

    if (rowCount1 <= 0) {
      this.fArrowDown(view, -1, rowCount1, rowchk, fieldName);
    }
    view.setCurrent({ dataRow: 0, column: 0 });
  };

  /**
   * [Set DataProvider (res === undefined 일때만 사용 권장 (else 구분은 fSetMultiDataProvider 함수로 대체))]
   * @param {*DataProvider} provider
   * @param {*Index} index
   * @param {*필드} items
   * @param {*공통코드 데이터} res
   */
  fSetDataProvider = (provider, index, items, res) => {
    if (res == undefined) {
      items.forEach((item, idx, array) => {
        provider.setValue(index, array[idx], undefined);
      });
    } else {
      provider.setValue(index, items[0], res.minorcd);
      provider.setValue(index, items[1], res.minornm);
    }
  };

  /**
   * [Set Multi DataProvider]
   * @param {*DataProvider} provider
   * @param {*Index} index
   * @param {*필드} items
   */
  fSetMultiDataProvider = (provider, index, items) => {
    for (const [key, value] of Object.entries(items)) {
      if (provider.getFieldIndex(key) !== -1 && index !== -1) {
        provider.setValue(index, key, value);
      }
    }
  };

  /**
   * [그리드 마지막 필드 엔터키]
   * @param {*Grid} grid
   * @param {*ItemIndex} itemIndex
   * @param {*행갯수} rowCount
   * @param {*유효성 검사} rowchk
   */
  fEnterLastField = (grid, itemIndex, rowCount, rowchk) => {
    grid.setCurrent({ itemIndex: itemIndex + 1, column: 0 });

    if (rowCount <= itemIndex + 1 && rowchk) {
      grid.getDataSource().addRow([]);
      grid.setCurrent({ itemIndex: itemIndex + 1, column: 0 });
    } else {
      grid.setCurrent({ itemIndex: itemIndex, column: 0 });
    }
  };

  /**
   * [그리드 코드도움말]
   * @param {*현재 행} current
   * @param {*helper} helper
   * @param {*프로그램 ID} pgmid
   * @param {*검색어} searchValue
   * @param {*팝업 visible} visible
   * @returns
   */
  gridCodeClass = async (current, helper, pgmid, searchValue = '', visible) => {
    let apiUrl = 'selectByTSqlItem';
    const fieldName = current.fieldName;
    const dataRow = current.dataRow;
    const fieldIndex = current.fieldIndex;
    const itemIndex = current.itemIndex;
    const isCust = fieldName.toLowerCase().includes('cust');
    const isUnit = fieldName.toLowerCase().includes('unit');
    const isWeight = fieldName.toLowerCase().includes('weight');
    if (isCust) {
      if (isUnit || isWeight) {
        apiUrl;
      } else {
        apiUrl = 'selectByCustClass';
      }
    }

    const clickData = {
      column: fieldName,
      dataRow: dataRow,
      fieldIndex: fieldIndex,
      fieldName: fieldName,
      itemIndex: itemIndex,
    };
    try {
      let result = await axios.get(`/@api/common/codeclass/${apiUrl}`, {
        params: helper,
      });

      let _data = result.data[1];
      let chk = {};

      _data.map((item, index, array) => {
        const isSameTxt = (el) => {
          return el === (searchValue.length > 0 && searchValue);
        };

        if (Object.values(item).some(isSameTxt)) {
          chk = { ...chk, ...array[index] };
        }
      });
      let return_obj = {};

      if (visible) {
        return_obj = {
          visible: true,
          datas: result.data,
          desc: result.data[2][0].Remark,
          value: searchValue,
          id: fieldName,
          viewId: pgmid,
          selectedData: clickData,
        };
      } else {
        if (Object.keys(chk).length < 1) {
          return_obj = {
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            id: fieldName,
            viewId: pgmid,
            selectedData: clickData,
          };
        } else if (Object.keys(chk).length > 0) {
          return_obj = {
            visible: false,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            res: chk,
            id: fieldName,
            viewId: pgmid,
            selectedData: clickData,
          };
        }
      }
      return return_obj;
    } catch (err) {
      return { error: err };
    }
  };

  /**
   * [그리드 코드도움말]
   * @param {*현재 행} current
   * @param {*프로그램 ID} PGMID
   * @param {*검색어} searchValue
   * @param {*팝업 visible} visible
   * @returns
   */
  gridSearchGoods = async (current, pgmid, searchValue = '', visible) => {
    const fieldName = current.fieldName;
    const dataRow = current.dataRow;
    const fieldIndex = current.fieldIndex;
    const itemIndex = current.itemIndex;

    const clickData = {
      column: fieldName,
      dataRow: dataRow,
      fieldIndex: fieldIndex,
      fieldName: fieldName,
      itemIndex: itemIndex,
    };
    try {
      let return_obj = {};

      if (visible) {
        return_obj = {
          visible: true,
          id: fieldName,
          viewId: pgmid,
          value: searchValue,
          selectedData: clickData,
        };
      } else {
        return_obj = {
          visible: true,
          id: fieldName,
          viewId: pgmid,
          value: searchValue,
          selectedData: clickData,
        };
      }
      return return_obj;
    } catch (err) {
      return { error: err };
    }
  };

  /**
   * [그리드 코드도움말 (CodeType)]
   * @param {*현재 행} current
   * @param {*helper} helper
   * @param {*프로그램 ID} pgmid
   * @param {*검색어} searchValue
   * @param {*팝업 visible} visible
   * @returns
   */
  gridTypeCodeClass = async (current, helper, pgmid, searchValue = '', visible) => {
    const fieldName = current.fieldName;
    const dataRow = current.dataRow;
    const fieldIndex = current.fieldIndex;
    const itemIndex = current.itemIndex;

    const clickData = {
      column: fieldName,
      dataRow: dataRow,
      fieldIndex: fieldIndex,
      fieldName: fieldName,
      itemIndex: itemIndex,
    };
    try {
      let result = await axios.get('/@api/common/codeclass/selectByType', {
        params: helper,
      });

      let _data = result.data[1];
      let chk = {};

      _data.map((item, index, array) => {
        const isSameTxt = (el) => {
          return el === (searchValue.length > 0 && searchValue);
        };

        if (Object.values(item).some(isSameTxt)) {
          chk = { ...chk, ...array[index] };
        }
      });
      let return_obj = {};

      if (visible) {
        return_obj = {
          visible: true,
          datas: result.data,
          desc: result.data[2][0].Remark,
          value: searchValue,
          id: fieldName,
          viewId: pgmid,
          selectedData: clickData,
        };
      } else {
        if (Object.keys(chk).length < 1) {
          return_obj = {
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            id: fieldName,
            viewId: pgmid,
            selectedData: clickData,
          };
        } else if (Object.keys(chk).length > 0) {
          return_obj = {
            visible: false,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            res: chk,
            id: fieldName,
            viewId: pgmid,
            selectedData: clickData,
          };
        }
      }
      return return_obj;
    } catch (err) {
      return { error: err };
    }
  };

  /**
   * [그리드 키 필드 지정]
   * @param {*그리드} grid
   * @param {*현재 행} datarow
   * @param {*키 필드} fiels
   */
  fSetGridKeyField = (grid, datarow, fiels) => {
    fiels.forEach((item) => {
      if (['none', 'updated'].includes(grid.getDataSource().getRowState(datarow))) {
        grid.setColumnProperty(item, 'editable', false);
      } else {
        grid.setColumnProperty(item, 'editable', true);
      }
    });
  };

  /**
   * [신규 행 생성]
   * @param {*데이터 프로바이더} provider
   * @param {*초기값} items
   */
  fNewRow = (provider, items) => {
    provider.clearRows();
    provider.addRow([]);

    for (const [key, value] of Object.entries(items)) {
      provider.setValue(0, key, value);
    }
  };

  /**
   *
   * @param {*인덱스} itemIndex
   * @param {*데이터 프로바이더} provider
   * @param {*그리드뷰} view
   * @param {*체크필드} field
   * @returns
   */
  fNewRowChk = (provider, view, field, itemIndex) => {
    const rows = provider.getAllStateRows().created;
    if (rows.length > 0) {
      let emptyCnt = 0;
      rows.map((item) => {
        if (itemIndex === undefined || item >= itemIndex) {
          if (view) {
            const datas = view.getValues(item);
            if (!datas[field] || datas[field] === undefined) {
              emptyCnt += 1;
            }
          }
        }
      });
      return emptyCnt;
    }
    return 0;
  };

  /**
   * [공백 반환]
   * @param {*대상} item
   * @returns
   */
  fEmptyReturn = (item) => {
    if (item === undefined || item === '' || item === null) {
      return '';
    } else {
      return item;
    }
  };

  /**
   * [컨테이너 초기화]
   * @param {*컨테이너 아이디} gridId
   */
  fContainerInit = (gridId) => {
    if (gridId !== undefined && gridId !== '' && gridId !== null) {
      document.getElementById(gridId).innerHTML = '';
    }
  };

  fMaxSeq = (provider, keyfield) => {
    let tempSeq = 0;
    const rows = provider.getRows();

    rows.map((item, index) => {
      let currentSeq = provider.getValue(index, keyfield);

      if (tempSeq <= currentSeq) {
        tempSeq = currentSeq;
      }
    });

    return parseInt(tempSeq);
  };

  /**
   *
   * @param {*대상 DataProvider} provider
   * @param {*대상 GridView} view
   * @param {*엑셀 파일명} excelTitle
   */
  fExcelDownload = (provider, view, excelTitle) => {
    if (provider.getRowCount()) {
      view.exportGrid({
        compatibility: true,
        type: 'excel',
        target: 'local',
        applyDynamicStyles: true,
        fileName: `${excelTitle}_${moment(new Date()).format('YYYYMMDD')}.xlsx`,
      });
    }
  };

  fDuplexKeyCheck = (provider, view, keyfield) => {
    view.commit();
    const rows = provider.getJsonRows();

    let result = false;

    rows.some((row) => {
      const cnt = rows.filter((item) => item[keyfield] === row[keyfield]).length;

      if (cnt > 1) {
        result = true;
        return result;
      }
    });

    return result;
  };
}

export default Grid;
