export class GridSearchGoods {
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
}

export default GridSearchGoods;
