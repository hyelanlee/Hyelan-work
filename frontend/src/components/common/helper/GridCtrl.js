import axios from 'axios';
import numeral from 'numeral';

export const onKeyDown = (grid, event, fCallbackGrid = false) => {
  const key = event.key;
  const rowCount = grid.getItemCount();
  const fieldName = grid.getCurrent().fieldName;

  let itemIndex = grid.getCurrent().itemIndex;

  if (key === 'ArrowDown') {
    itemIndex += 1;

    if (rowCount > itemIndex) {
      setTimeout(() => {
        if (fCallbackGrid) {
          fCallbackGrid();
        }

        grid.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
      }, 10);
    }
  }

  if (key === 'ArrowUp') {
    itemIndex -= 1;
    if (itemIndex < 0) {
      itemIndex = 0;
    }
    if (itemIndex > -1) {
      setTimeout(() => {
        if (fCallbackGrid) {
          fCallbackGrid();
        }
        grid.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
      }, 10);
    }
  }

  if (key === 'Enter') {
    // eslint-disable-next-line no-console
    console.log('onKeyDown : ', key);
    return false;
  }
};

export const onKeyUp = (grid, event, fCallbackGrid = false) => {
  const key = event.key;
  const rowCount = grid.getItemCount();
  const fieldName = grid.getCurrent().fieldName;

  let itemIndex = grid.getCurrent().itemIndex;

  if (key === 'ArrowDown') {
    if (rowCount > itemIndex) {
      setTimeout(() => {
        if (fCallbackGrid) {
          fCallbackGrid();
        }

        grid.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
      }, 10);
    }
  }

  if (key === 'ArrowUp') {
    if (itemIndex < 0) {
      itemIndex = 0;
    }
    if (itemIndex > -1) {
      setTimeout(() => {
        if (fCallbackGrid) {
          fCallbackGrid();
        }
        grid.setCurrent({ itemIndex: itemIndex, fieldName: fieldName });
      }, 10);
    }
  }

  if (key === 'Enter') {
    // eslint-disable-next-line no-console
    return false;
  }
};

export const gridCodeClass = async (current, helper, pgmid, searchValue = '', visible) => {
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

export const gridFocusClear = (grid) => {
  setTimeout(() => {
    grid.clearCurrent();
  }, 10);
};

export const setGridRenderer = (grid) => {
  grid.registerCustomRenderer('renderer_number_#', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_number_#.#', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0.0');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_number_#.##', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0.00');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_number_#,#', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0,0');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_number_#,#.#', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0,0.0');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_number_#,#.##', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = numeral(model.value).format('0,0.00');
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_string_left', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'left-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = model.value;
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_string_center', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'center-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = model.value;
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_string_right', {
    initContent(parent) {
      let div = (this._span = document.createElement('div'));
      div.className = 'right-column';
      parent.appendChild(div);
    },

    clearContent: function () {
      parent.innerHTML = '';
    },

    render: function (grid, model) {
      let span = this._span;
      span.textContent = model.value;
      this._value = model.value;
    },
  });

  grid.registerCustomRenderer('renderer_codeclass', {
    initContent(parent) {
      let span = (this._span = document.createElement('span'));
      span.className = 'codeclass';
      parent.appendChild(span);
    },

    canClick: function () {
      return true;
    },

    clearContent: function () {
      parent.innerHTML = '';
    },
  });

  // grid.registerCustomRenderer('Renderer_TxtNumber', {
  //   initContent(parent) {
  //     let div = (this._span = document.createElement('div'));
  //     div.className = 'right-column';
  //     parent.appendChild(div);
  //   },
  //   // eslint-disable-next-line no-unused-vars
  //   render: function (grid, model, width, height, info) {
  //     info = info || {};
  //     let span = this._span;
  //     span.textContent = numeral(model.value).format('0,0');
  //     this._value = model.value;
  //   },
  // });

  grid.registerCustomRenderer('Renderer_CodeClass', {
    initContent(parent) {
      let div = (this._sapn = document.createElement('div'));
      div.className = 'center-column';
      parent.appendChild(div);
    },
  });
};

export const settingColumns = (grid, col, renderer, readonly = false) => {
  // console.log('settingColumns : ', col, renderer);

  setTimeout(() => {
    grid.setColumnProperty(col, 'renderer', renderer);
  }, 100);

  if (renderer.includes('number')) {
    grid.setColumnProperty(col, 'editor', {
      type: 'number',
    });
  }

  if (readonly) {
    grid.setColumnProperty(col, 'editable', false);
    let column = grid.columnByName(col);
    column.styleCallback = () => {
      return 'rg-sky-color right-column';
    };
  }
};

// export const CodeHelper = (pgmid, grid, provider, CustCd, helper) => {
//   const fieldName = grid.getCurrent().fieldName;
//   const dataRow = grid.getCurrent().dataRow;
//   const fieldIndex = grid.getCurrent().fieldIndex;
//   const itemIndex = grid.getCurrent().itemIndex;

//   const clickData = {
//     column: fieldName,
//     dataRow: dataRow,
//     fieldIndex: fieldIndex,
//     fieldName: fieldName,
//     itemIndex: itemIndex,
//   };
//   const fieldValues = provider.getFieldValues(grid.getCurrent().fieldName, 0, -1)[dataRow];
//   // grid.setCurrent({ itemIndex: itemIndex, fieldName: provider.getOrgFieldName(Number(fieldIndex + 1)) });

//   if (helper.length > 0) {
//     helper.map(async (data) => {
//       for (let [key, value] of Object.entries(data)) {
//         if (key === fieldName) {
//           if (key === 'workno') {
//             value = { ...value, ...{ iInCode1: provider.getValue(dataRow, fieldIndex), iInCode2: CustCd } };
//           }
//           let data = await fCodeClass(key, value, fieldValues, clickData, pgmid);

//           return data;

//         }
//       }
//     });
//   }
// };

// const fCodeClass = async (key, helper, fieldValues, clickData, pgmid) => {
//   try {
//     let apiUrl = 'selectByTSqlItem';
//     const isCust = key.includes('Cust');
//     if (isCust) {
//       apiUrl = 'selectByCustClass';
//     }
//     let result = await axios.get(`/@api/common/codeclass/${apiUrl}`, {
//       params: helper,
//     });

//     return {
//       visible: true,
//       datas: result.data,
//       desc: result.data[2][0].Remark,
//       value: fieldValues,
//       id: clickData.fieldName,
//       viewId: pgmid,
//       selectedData: clickData,
//     };
//   } catch (error) {
//     return { error: error };
//   }
// };
