import axios from 'axios';

export class Command {
  constructor(setalert) {
    this.setAlert = setalert;
  }

  /**
   * [조회]
   * @param {*Data Provider} provider
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   * @param {*메시지} message
   */
  fSearch = async (provider, path, param, message = null) => {
    if (!provider) {
      return;
    }

    provider.clearRows();

    try {
      let result = await axios.get(path, {
        params: param,
      });
      const data = result.data;

      this.fDataTrim(data);

      if (!data) {
        this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 조회 결과가 없습니다.' });
      } else {
        provider.setRows(data);
      }
    } catch (error) {
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 조회중 오류가 발생하였습니다.', type: 'E' });
    }
  };

  /**
   * [조회]
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   */
  fSearchByReturn = async (path, param) => {
    let result = await axios.get(path, {
      params: param,
    });

    return result.data;
  };

  /**
   * [조회(Trim)]
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   */
  fSearchByReturnTrim = async (path, param) => {
    let result = await axios.get(path, {
      params: param,
    });

    return this.fDataTrim(result.data);
  };

  /**
   * [조회(Trim)]
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   */
  fSearchByReturnTrimLists = async (path, param) => {
    let result = await axios.get(path, {
      params: param,
    });

    let returnLists = {};

    for (var list in result.data) {
      returnLists[list] = this.fDataTrim(result.data[list]);
    }

    return returnLists;
  };

  /**
   * [데이터 공백 제거]
   * @param {*데이터} data
   * @returns
   */
  fDataTrim = (data) => {
    if (data === '') {
      return;
    }

    data.forEach((items) => {
      for (const [key, value] of Object.entries(items)) {
        if (typeof items[key] === 'string') {
          items[key] = value.trim();
        }
      }
    });

    return data;
  };

  /**
   * [저장]
   * @param {*Backend 경로} path
   * @param {*헤더 파라메터} headerVo
   * @param {*명세내역 파라메터} detailVo
   * @returns
   */
  fSave = async (path, headerVo, detailVo) => {
    try {
      const result = await axios.post(path, {
        header: headerVo,
        detail: detailVo,
      });

      const resultData = result.data;

      if (resultData.errmess !== '') {
        this.setAlert({ visible: true, desc: resultData.errmess, type: 'E' });
        return;
      }

      this.setAlert({ visible: true, desc: '문서 저장이 완료되었습니다.' });
      return resultData;
    } catch (error) {
      this.setAlert({ visible: true, desc: `저장 중 오류가 발생하였습니다.${error}` });
      return false;
    }
  };

  /**
   * [삭제]
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   * @param {*메시지} message
   * @returns
   */
  fDelete = async (path, param, message = null) => {
    try {
      let result = await axios.post(path, {
        data: param,
      });

      const data = result.data;

      if (data.errmess !== '') {
        this.setAlert({ visible: true, desc: data.errmess, type: 'E' });
        return;
      }
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 문서가 삭제되었습니다.' });
      return true;
    } catch (error) {
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 문서 삭제 중 오류가 발생하였습니다.' });
      return false;
    }
  };

  /**
   * [체크 항목 삭제]
   * @param {*GridView} view
   * @param {*DataProvider} provider
   * @param {*Backend 경로} path
   * @param {*파라메터} param
   * @param {*메시지} message
   * @returns
   */
  fDeleteCheckItem = async (view, provider, path, param, message = null) => {
    let jDeletedDatas = [];
    const deleted = view.getCheckedItems(true);

    deleted.forEach((itemIndex) => {
      const rowData = provider.getJsonRow(itemIndex);
      jDeletedDatas.push(rowData);
    });

    try {
      let result = await axios.post(path, {
        data: param,
        item: jDeletedDatas,
      });

      const data = result.data;

      if (data.errmess !== '') {
        this.setAlert({ visible: true, desc: data.errmess, type: 'E' });
        return;
      }
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + '이 삭제되었습니다.' });
    } catch (error) {
      this.setAlert({ visible: true, desc: this.fEmptyReturn(message) + ' 삭제 중 오류가 발생하였습니다.' });
    }
  };

  /**
   * [파일삭제]
   * @param {*문서구분} DocSource
   * @param {*문서번호} DocNo
   * @param {*파일경로} filepath
   * @param {*파일명} fileName
   */
  fDeleteFiles = async (filepath, files) => {
    const paramVO = {};
    paramVO.FilePath = filepath;

    await axios.post('/@api/common/appr/deleteByFiles', { params: paramVO, files: files });
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
}

export default Command;
