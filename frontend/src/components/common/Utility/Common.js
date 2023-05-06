import * as helper from '@components/common/helper/CodeClass';

export class Common {
  constructor(pgmid, setalert) {
    this.PGMID = pgmid;
    this.setAlert = setalert;
  }

  /**
   * [ID 생성]
   * @param {*컨트롤 ID} id
   * @returns
   */
  fMakeId = (id) => {
    return this.PGMID + '_' + id;
  };

  /**
   * [탭인덱스 지정]
   */
  fSetTabIndex = () => {
    for (const [key, value] of Object.entries(document.querySelectorAll('.inputCls'))) {
      value.setAttribute('tabindex', Number(key) + 1);
    }
  };

  /**
   * [포커스]
   * @param {*대상} inputName
   */
  fMakeFocus = (inputName) => {
    const elems = document.getElementsByClassName('inputCls');
    const chkIdx = Number(document.getElementById(this.fMakeId(inputName)).getAttribute('tabindex')) + 1;

    for (let i = 0; i < elems.length; i++) {
      const idx = Number(elems[i].getAttribute('tabindex'));
      if (chkIdx <= idx) {
        if (!elems[i].disabled) {
          elems[i].focus();
          break;
        }
      }
    }
  };

  /**
   * [입력필드 유효성 검사]
   * @param {*유효성 검사 대상} targets
   * @returns {*결과값}
   */
  fValidateElements = (targets) => {
    const elems = document.getElementsByClassName('inputCls');
    let result = false;

    for (const [key, value] of Object.entries(targets)) {
      const index = Number(document.getElementById(this.fMakeId(key)).getAttribute('tabindex')) - 1;
      if (index !== -1) {
        if (this.fEmptyReturn(elems[index].value) === '' || this.fNullReturn(elems[index].value) === null) {
          this.setAlert({ visible: true, desc: `${value} 이(가) 입력되지 않았습니다.`, type: 'W' });
          result = true;
          break;
        }
      }
    }

    return result;
  };

  /**
   * [입력필드 유효성 검사]
   * @param {*유효성 검사 대상} targets
   * @param {*메시지} message
   * @returns {*결과값}
   */
  fValidate = (isValidate, message) => {
    if (isValidate) {
      this.setAlert({ visible: true, desc: message, type: 'W' });
      return true;
    }
    return false;
  };

  /**
   * [Trim]
   * @param {*대상 값} value
   * @returns {*공백 제거 결과값}
   */
  fTrim = (value) => {
    if (typeof value === 'string') {
      return value === undefined ? value : value.trim();
    } else {
      return value;
    }
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
   * [0 반환]
   * @param {*대상} item
   * @returns
   */
  fZeroReturn = (item) => {
    if (item === undefined || item === 0 || item === null) {
      return 0;
    } else {
      return item;
    }
  };

  /**
   * [null 반환]
   * @param {*대상} item
   * @returns
   */
  fNullReturn = (item) => {
    if (item === undefined || item === '' || item === '0') {
      return null;
    } else {
      return item;
    }
  };

  /**
   * [팝업 캔슬]
   * @param {*포커스 필드 이름} inputName
   */
  fCancel = (inputName) => {
    document.getElementById(this.fMakeId(inputName)).focus();
  };

  /**
   * [단축키]
   * @param {*$CommonStore} common
   * @param {*신규함수} fnew
   * @param {*조회함수} fsearch
   * @param {*저장함수} fsave
   * @param {*삭제함수} fdelete
   * @param {*인쇄함수} fprint
   */
  fHotKey = (common, popupvisible, fnew = undefined, fsearch = undefined, fsave = undefined, fdelete = undefined, fprint = undefined) => {
    if (!popupvisible) {
      if (common.HotKey) {
        if (common.HotKey.pgmid === this.PGMID) {
          if (common.HotKey.key === 'NEW') {
            if (fnew != undefined) {
              fnew();
            }
          } else if (common.HotKey.key === 'SEARCH') {
            if (fsearch != undefined) {
              fsearch(false);
            }
          } else if (common.HotKey.key === 'SAVE') {
            if (fsave != undefined) {
              fsave();
            }
          } else if (common.HotKey.key === 'DELETE') {
            if (fdelete != undefined) {
              fdelete();
            }
          } else if (common.HotKey.key === 'PRINT') {
            if (fprint != undefined) {
              fprint();
            }
          }
        }
      }
    }
  };

  /**
   * [상태관리]
   * @param {*상태} setVo
   * @param {*키} key
   * @param {*값} value
   */
  fFieldChange = (setVo, key, value) => {
    setVo((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  /**
   * [상태관리(멀티)]
   * @param {*상태} setVo
   * @param {*키-값 } fields
   */
  fMultiFieldChange = (setVo, fields) => {
    for (const [key, value] of Object.entries(fields)) {
      setVo((prevState) => {
        return { ...prevState, [key]: value };
      });
    }
  };

  /**
   * [검색]
   * @param {*그리드 뷰} view
   * @param {*Data Provider} provider
   * @param {*구분} type
   * @param {*검색 구분} searchGubun
   * @param {*검색 값} searchValue
   */
  fSearchMatch = (view, provider, type, searchGubun, searchValue) => {
    let sd = '';
    for (const [key, value] of Object.entries(searchGubun)) {
      if (type === key) {
        sd = provider.searchData({ fields: [value], value: searchValue, partialMatch: true });
      }
    }
    if (sd != null) {
      view.setCurrent({ dataRow: sd.dataRow, column: 0 });
    }
  };

  /**
   * [포커스 지정]
   * @param {*첫번째 컴포넌트명} first
   * @param {*두번째 컴포넌트명} second
   */
  fSetFocus = (first, second) => {
    if (document.getElementById(this.fMakeId(first)).disabled) {
      document.getElementById(this.fMakeId(second)).focus();
    } else {
      document.getElementById(this.fMakeId(first)).focus();
    }
  };

  /**
   * [그리드 컬럼 정렬]
   * @param {*그리드 뷰} view
   * @param {*구분} type
   * @param {*검색 구분} searchGubun
   */
  fGridSort = (view, type, searchGubun, sortdirs = 'ascending') => {
    for (const [key, value] of Object.entries(searchGubun)) {
      if (type === key) {
        view.orderBy([value], [sortdirs]);
        view.commit();
      }
    }
  };

  /**
   * [결재자 조회]
   * @param {*대상부서 구분} type
   * @param {*로그인 사용자} user
   * @returns 결재자정보
   */
  fGetApprUser = (type, user) => {
    const testHost = ['develop.ehansun.co.kr:7005', 'test5.ehansun.co.kr'];
    let aUser = { Pno: 'K0091', Name: '김창수' }; // 통합 결재
    let bUser = { Pno: 'K0091', Name: '김창수' }; // 영업팀 결재
    let pUser = { Pno: 'K0075', Name: '김태연' }; // 생산관리팀 결재
    let tUser = { Pno: 'K0027', Name: '주현미' }; // 연구개발팀 결재
    if (testHost.includes(window.location.host)) {
      aUser = { Pno: user.userid, Name: user.username };
      bUser = { Pno: user.userid, Name: user.username };
      pUser = { Pno: user.userid, Name: user.username };
      tUser = { Pno: user.userid, Name: user.username };
    }
    if (type === 'A') {
      return aUser;
    } else if (type === 'B') {
      return bUser;
    } else if (type === 'P') {
      return pUser;
    } else if (type === 'T') {
      return tUser;
    } else {
      return { Pno: '', Name: '' };
    }
  };

  /**
   * [첨부파일 경로 생성]
   * @param {*경로명} pathName
   * @returns FULL경로
   */
  fGetFilePath = (pathName) => {
    if (window.location.port) {
      return window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/@files/' + pathName;
    } else {
      return window.location.protocol + '//' + window.location.hostname + '/@files/' + pathName;
    }
  };

  /**
   * [첨부파일 용량 체크]
   * @param {*파일용량} file
   * @param {*체크용량구분} type
   * @param {*체크용량} size
   * @returns 체크결과
   */
  fFileSizeCheck = (file, type = 'KB', size) => {
    let chkSize = size * 1024;
    if (type === 'MB') {
      chkSize = size * 1024 * 1024;
    } else if (type === 'GB') {
      chkSize = size * 1024 * 1024 * 1024;
    }
    return file <= chkSize;
  };

  /**
   * [첨부파일 확장자 체크]
   * @param {*파일명} file
   * @param {*체크 확장자(배열)} chkExt
   * @returns 체크결과
   */
  fFileExtensionCheck = (file, chkExt = []) => {
    const fileDotIdx = file.lastIndexOf('.');
    const fileExtension = file.substring(fileDotIdx + 1, file.length).toLowerCase();
    return chkExt.includes(fileExtension);
  };

  /**
   * [Document 파일생성]
   * @param {*파일명} filename
   * @param {*컨텐츠} contents
   */
  fCreateTextFile = (filename, contents) => {
    var blob = new Blob([contents], { type: 'text/plain' });
    var objURL = window.URL.createObjectURL(blob);

    if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = filename;
    a.href = objURL;
    a.click();
  };

  /**
   * [Document 파일생성]
   * @param {*파일명} filename
   * @param {*컨텐츠} contents
   */
  fDownloadFile = (filename, contents) => {
    var blob = new Blob([contents]);
    var objURL = window.URL.createObjectURL(blob);

    if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
    }
    window.__Xr_objURL_forCreatingFile__ = objURL;
    var a = document.createElement('a');
    a.download = filename;
    a.href = objURL;
    a.click();
  };

  /**
   *
   * @param {*id} id
   * @param {*code1} code1
   * @param {*code2} code2
   * @param {*code3} code3
   * @param {*code4} code4
   * @param {*code5} code5
   * @param {*code6} code6
   * @returns
   */
  fCreateHelper = (id, code1, code2, code3, code4, code5, code6) => {
    let CodeHelper = { ...helper.Default };
    CodeHelper.iInCode1 = '';
    CodeHelper.iInId = id;
    if (code1) {
      CodeHelper.iInCode1 = code1;
    }
    if (code2) {
      CodeHelper.iInCode2 = code2;
    }
    if (code3) {
      CodeHelper.iInCode3 = code3;
    }
    if (code4) {
      CodeHelper.iInCode4 = code4;
    }
    if (code5) {
      CodeHelper.iInCode5 = code5;
    }
    if (code6) {
      CodeHelper.iInCode6 = code6;
    }

    return CodeHelper;
  };

  /**
   * [Redefinition Helper]
   * @param {*Helper} helper
   * @param {*필드} items
   * @returns helper
   */
  fRedefHelper = (helper, items) => {
    for (const [key, value] of Object.entries(items)) {
      helper[key] = value;
    }
    return helper;
  };

  /**
   * [Provider Clear Rows]
   * @param {*DataProvider} provider
   */
  fProviderClearRows = (provider) => {
    provider ? provider.clearRows() : null;
  };

  /**
   * [코드 도움말 Width]
   * @param {*필드} fiels
   * @returns
   */
  fGetWidthByCodeHelper = (fields) => {
    let totalSize = 0;
    fields.map((item) => {
      totalSize += Number(item.Size);
    });
    return totalSize < 470 ? 470 : totalSize + 300;
  };
}

export default Common;
