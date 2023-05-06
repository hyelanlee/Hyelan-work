import React, { useEffect, useState, useRef, useCallback } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { TextBox } from 'rc-easyui';
import axios from 'axios';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import Alert from '@components/common/Alert';
import { FaStar } from 'react-icons/fa';
import imgCalendar from '@assets/images/img_calendar.png';

// import * as Translate from '@components/common/Translate';

/**
 * TextBox 모듈
 *
 * Props_
 * inputId : PGMID가 적용된 InputName
 * inputName : InputName
 * inputPlaceHolder : 라벨/PlaceHolder 타이틀
 * inputValue : 텍스트박스 입력 값
 * inputIndex : -1 포커스가 필요없는 텍스트박스 (Readonly, disabled)
 * helper : 코드도움말 유무
 * onConfirm : 코드도움말 실행
 * onCancel : 코드도움말 종료
 * editable : 수정가능 유무
 * labelStyles : 라벨 스타일
 * inputStyles : 텍스트박스 스타일
 * inputCls : DOM Class
 * multiline : 멀티라인 입력 가능 유무
 *
 * 저장소_
 * commonVO : 코드도움말 데이터 담는 저장소
 * txtValue : TextBox Value
 * codeClassVO : 코드도움말 실행 데이터 저장소
 * isCtrl, isShift : Ctrl, Shift 입력 감지 데이터 저장소
 *
 * 함수_
 * fHandleInput : TextBox Value 입력 함수
 * fKeyUpEvent, fKeyDownEvent : 키보드 키 입력 감지 이벤트
 * fHandleKeyPress : 코드도움말이 있는 TextBox의 OnChange 감지 및 코드도움말 실행 함수
 * fHandleKeyPress2 : 코드도움말이 없는 TextBox의 OnChange 감지 함수
 * fNextFocus : 다음 포커스로 이동 함수
 * fConfirm : 코드도움말 실행 함수
 * fCancel : 코드도움말 종료 함수
 * fCodeclass : 코드도움말 함수
 * */
const TextBoxDefault = observer(
  ({
    inputId,
    inputName,
    inputPlaceHolder,
    inputValue,
    inputIndex,
    helper,
    onConfirm,
    onCancel,
    editable,
    disabled,
    labelStyles,
    inputStyles,
    columnStyles,
    inputCls,
    multiline = false,
    gridFocus,
    isNumber,
    marginZero,
    placeHolder,
    TitleText,
    maxLength = false,
    inputRequired = false,
  }) => {
    const { $CommonStore } = useStores();
    const classes = Styles();

    const [commonVO, setCommonVO] = useState(null);
    const [txtValue, setTxtValue] = useState(null);
    const [codeClassVO, setCodeClassVO] = useState({
      visible: false,
      description: '',
      value: '',
      datas: {},
      id: '',
      viewId: '',
      selectedData: {},
    });

    const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });

    let isCtrl = useRef(false);
    let isAlt = useRef(false);
    let isShift = useRef(false);

    const fHandleInput = (value, type, obj) => {
      // if (type === 'CODECLASS') {
      //   $CommonStore.fSetChangeValue({
      //     inputId: inputId,
      //     inputName: inputName,
      //     inputValue: fReturnMinor(inputName, obj),
      //     inputType: 'CODECLASS',
      //   });
      // }

      if (type === 'CODECLASS') {
        $CommonStore.fSetChangeValue({
          inputId: inputId,
          inputName: inputName,
          inputValue: fReturnMinor(inputName, obj),
          inputType: 'CODECLASS',
        });

        $CommonStore.fSetCodeclass({
          selData: obj,
          inputId: inputId,
          inputName: inputName,
          inputType: 'CODECLASS',
          isHelper: helper,
        });
        onConfirm();
      }
      setTxtValue(value);
    };

    const fKeyUpEvent = useCallback((e) => {
      if (e.key === 'Shift') {
        isShift.current = false;
      }
      if (e.key === 'Ctrl') {
        isCtrl.current = false;
      }

      if (e.key === 'Alt') {
        isAlt.current = false;
      }
    }, []);

    const fKeyDownEvent = useCallback((e) => {
      if (e.key === 'Shift') {
        isShift.current = true;
      }
      if (e.key === 'Ctrl') {
        isCtrl.current = true;
      }
      if (e.key === 'Alt') {
        isAlt.current = true;
      }
      if (e.key === 'Enter' && alert.visible) {
        setAlert({ visible: false, disc: '' });
      }
    }, []);

    const fHandleKeyPress = (e, inputName) => {
      if (isCtrl.current === false && isShift.current === false) {
        if (e.key === 'Enter') {
          if (e.target.value || inputRequired) {
            fCodeclass(inputName, e.target.value, true);
          } else {
            if (gridFocus) {
              document.getElementById(inputId).blur();
              setTimeout(() => {
                gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
                gridFocus.setFocus();
              }, 100);
            } else {
              fNextFocus();
            }
          }
        }

        /*  if (e.key === 'F9' && isAlt.current === true) {
          fCodeclass(inputName, '', true);
        } */

        if (e.key === 'Tab') {
          if (e.target.value || inputRequired) {
            fCodeclass(inputName, e.target.value, true);
          } else {
            if (gridFocus) {
              document.getElementById(inputId).blur();
              setTimeout(() => {
                gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
                gridFocus.setFocus();
              }, 100);
            } else {
              fNextFocus();
            }
          }
          /*
          if (gridFocus) {
            document.getElementById(inputId).blur();
            setTimeout(() => {
              gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
              gridFocus.setFocus();
            }, 100);
          } else {
            fNextFocus();
          }
          */
        }
      }
    };

    const fHandleKeyPress2 = (e, inputName) => {
      if (isCtrl.current === false && isShift.current === false) {
        if (e.key === 'Enter') {
          $CommonStore.fSetChangeValue({
            inputId: inputId,
            inputName: inputName,
            inputType: 'INSERT',
            inputValue: e.target.value,
          });

          if (gridFocus) {
            document.getElementById(inputId).blur();
            setTimeout(() => {
              gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
              gridFocus.setFocus();
            }, 100);
          } else {
            fNextFocus();
          }
        }

        if (e.key === 'Tab') {
          if (gridFocus) {
            document.getElementById(inputId).blur();
            setTimeout(() => {
              gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
              gridFocus.setFocus();
            }, 100);
          } else {
            fNextFocus();
          }
        }
      }
    };

    const fHandleKeyPress3 = (e) => {
      // if (e.target.value) {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        $CommonStore.fSetCodeclass({
          // selData: { minorcd: '', minornm: e.target.value },
          selData: {},
          inputId: inputId,
          inputName: inputName,
          inputType: 'DEL',
          isHelper: helper,
        });
        onConfirm();
      } else if (e.key === 'Enter') {
        $CommonStore.fSetCodeclass({
          selData: { minorcd: '', minornm: e.target.value },
          inputId: inputId,
          inputName: inputName,
          inputType: 'INSERT',
          isHelper: helper,
        });
        if (onConfirm) {
          onConfirm();
        }
      } else {
        $CommonStore.fSetCodeclass({
          selData: { minorcd: '', minornm: e.target.value },
          inputId: inputId,
          inputName: inputName,
          inputType: 'INSERT',
          isHelper: helper,
        });
        if (onConfirm) {
          onConfirm();
        }

        $CommonStore.fSetChangeValue({
          inputId: inputId,
          inputName: inputName,
          inputType: 'INSERT',
          inputValue: e.target.value,
        });
      }
      // }
    };

    const fHandleKeyPress4 = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        $CommonStore.fSetCodeclass({
          // selData: { minorcd: '', minornm: e.target.value },
          selData: {},
          inputId: inputId,
          inputName: inputName,
          inputType: 'DEL',
          isHelper: helper,
        });
        onConfirm();
      }
    };

    const fNextFocus = () => {
      const PGMID = inputId.split('_')[0];
      const elems = document.getElementsByClassName('inputCls');
      const filtered = Object.values(elems).filter((item) => item.id.includes(PGMID));
      const chkIdx = Number(document.getElementById(inputId).getAttribute('tabindex')) + 1;

      // if (chkIdx > filtered.length) {
      //   chkIdx = 1;
      // }

      for (let i = filtered.length; i--; ) {
        const idx = Number(filtered[i].getAttribute('tabindex'));
        if (chkIdx === idx) {
          setTimeout(() => {
            filtered[i].focus();
          });
        }
      }
    };

    const fConfirm = () => {
      const selData = $CommonStore.Codeclass.selData;
      let obj = {};
      for (const [key, value] of Object.entries(selData)) {
        const chkNm = ['custnm', 'minornm', 'deptnm', 'name'];
        if (chkNm.includes(key)) {
          obj = { ...obj, ...{ ['minornm']: !value ? '' : value.trim() } };
        }
      }

      setCommonVO(selData);
      setCodeClassVO({ visible: false });
    };

    const fCancel = () => {
      document.getElementById(codeClassVO.id).focus();

      setCodeClassVO({ visible: false });
    };

    const fCodeclass = async (inputName, searchValue = '', popupOpen = true) => {
      let apiUrl = 'selectByTSqlItem';
      const isCust = inputName.toLowerCase().includes('cust');
      const isSearch = inputName.toLowerCase().includes('search');
      const isWorkNo = inputName.toLowerCase().includes('workno');
      const isPno = inputName.toLowerCase().includes('pno');
      const isGoodno = inputName.toLowerCase().includes('goodno');

      let restVO = { ...helper };

      if (isCust) {
        apiUrl = 'selectByCustClass';
        restVO.iCustNm = searchValue;
      }

      if (isSearch && isWorkNo) {
        restVO.iInCode3 = searchValue;
      }

      if (!isSearch && isGoodno) {
        restVO.iInCode3 = searchValue;
      }

      try {
        let result = await axios.get(`/@api/common/codeclass/${apiUrl}`, {
          params: restVO,
        });

        let _data = result.data[1];
        let chk = {};

        _data.map((item, index, array) => {
          if (isCust) {
            if (item.custnm === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else {
            const isSameTxt = (el) => {
              if (isPno) {
                return el.trim() === (searchValue.length > 0 && searchValue);
              }
              return el === (searchValue.length > 0 && searchValue);
            };

            if (Object.values(item).some(isSameTxt)) {
              chk = { ...chk, ...array[index] };
            }
          }
        });

        if (Object.keys(chk).length < 1 && popupOpen) {
          setCodeClassVO({
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: txtValue,
            id: inputId,
            viewId: inputName,
            selectedData: commonVO,
          });
        } else if (Object.keys(chk).length > 0) {
          if (gridFocus) {
            document.getElementById(inputId).blur();
            setTimeout(() => {
              gridFocus.setCurrent({ itemIndex: 0, dataRow: 0 });
              gridFocus.setFocus();
            }, 100);
          } else {
            fNextFocus();
          }

          fHandleInput(txtValue, 'CODECLASS', chk);
          document.removeEventListener('keydown', fKeyDownEvent);
          document.removeEventListener('keyup', fKeyUpEvent);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setAlert({ visible: true, desc: '조회결과가 없습니다.' });
          return;
        } else {
          setAlert({ visible: true, desc: '조회중 오류가 발생하였습니다.' + error });
          return;
        }
      }
    };

    useEffect(() => {
      document.addEventListener('keydown', fKeyDownEvent);
      document.addEventListener('keyup', fKeyUpEvent);
    }, []);

    useEffect(() => {
      setTxtValue(inputValue);
    }, [inputValue]);

    useEffect(() => {
      document.getElementById(inputId).setAttribute('maxlength', maxLength);
    }, [maxLength]);

    return (
      <>
        <CodeclassConfirm
          visible={codeClassVO.visible}
          description={codeClassVO.desc}
          value={codeClassVO.value}
          datas={codeClassVO.datas}
          id={codeClassVO.id}
          viewId={codeClassVO.viewId}
          selectedData={codeClassVO.selectedData}
          onConfirm={onConfirm}
          onCancel={onCancel}
          setVisibleData={fConfirm}
          setVisibleCancel={fCancel}
        />
        <Box className={marginZero ? classes.BoxAlignStyle2 : classes.BoxAlignStyle} style={columnStyles}>
          <Box className={classes.TitleBox} style={labelStyles}>
            <span className={classes.TitleText} style={TitleText}>
              {inputPlaceHolder}
            </span>
            {inputRequired && (
              <Box className={classes.TitleBoxR}>
                <FaStar size={10} />
              </Box>
            )}
          </Box>
          {helper && (
            <Box
              onKeyDown={(e) => {
                fHandleKeyPress(e, inputName);
              }}
              onKeyUp={(e) => {
                fHandleKeyPress4(e);
              }}
            >
              <TextBox
                inputId={inputId}
                placeholder={placeHolder ? placeHolder : ''}
                className={marginZero ? classes.InputBox4 : classes.InputBox}
                onChange={(value) => fHandleInput(value)}
                value={txtValue}
                style={(marginZero ? { marginTop: 0 } : { marginTop: 3 }, inputStyles)}
                tabIndex={inputIndex}
                name={inputName}
                disabled={disabled}
                editable={editable}
                multiline={multiline}
                inputCls={inputCls}
                addonRight={() => (
                  <Box
                    className="textbox-icon icon-search"
                    title="Codeclass"
                    onClick={() => {
                      if (disabled) {
                        return;
                      }
                      fCodeclass(inputId, '', true);
                    }}
                  />
                )}
              />
            </Box>
          )}
          {!helper && (
            <Box
              onKeyDown={(e) => {
                fHandleKeyPress2(e, inputName);
              }}
              onKeyUp={(e) => {
                fHandleKeyPress3(e);
              }}
            >
              <TextBox
                inputId={inputId}
                placeholder={placeHolder ? placeHolder : ''}
                className={marginZero ? classes.InputBox4 : isNumber ? classes.InputBox2 : classes.InputBox}
                onChange={(value) => fHandleInput(value)}
                value={txtValue}
                style={(marginZero ? { marginTop: 0 } : { marginTop: 3 }, inputStyles)}
                name={inputName}
                editable={editable}
                disabled={disabled}
                multiline={multiline}
                tabIndex={inputIndex}
                inputCls={inputCls}
              />
            </Box>
          )}
        </Box>

        <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      </>
    );
  },
);

export const fReturnMinor = (iName, iValue) => {
  const is_search = iName.toLowerCase().includes('search');
  const is_cust = iName.toLowerCase().includes('cust');
  const is_dept = iName.toLowerCase().includes('dept');
  const is_pno = iName.toLowerCase().includes('pno');
  const is_Assent = iName.toLowerCase().includes('assent');

  const is_exception = iName.toLowerCase().includes('exception');

  const is_itemclass4 = iName.toLowerCase().includes('itemclass4');

  let obj = {};

  for (const [key, value] of Object.entries(iValue)) {
    if (value) {
      if (!is_exception && is_cust) {
        if (is_search) {
          const chkCd = ['custoutcd'];
          const chkNm = ['custnm'];
          if (chkCd.indexOf(key) > -1) {
            obj = { ...obj, ...{ ['minorcd']: value.trim() } };
          }
          if (chkNm.indexOf(key) > -1) {
            obj = { ...obj, ...{ ['minornm']: value.trim() } };
          }
        } else {
          const chkCd = ['custcd'];
          const chkNm = ['custnm'];
          if (chkCd.indexOf(key) > -1) {
            obj = { ...obj, ...{ ['minorcd']: value.trim() } };
          }
          if (chkNm.indexOf(key) > -1) {
            obj = { ...obj, ...{ ['minornm']: value.trim() } };
          }
        }
      } else if (is_dept) {
        const chkCd = ['deptcd'];
        const chkNm = ['deptnm'];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
      } else if (is_pno) {
        const chkCd = ['pno'];
        const chkNm = ['name'];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
      } else if (is_Assent) {
        const chkCd = ['custcd'];
        const chkNm = ['custnm'];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
      } else if (is_itemclass4) {
        const chkCd = ['minorcd'];
        const chkNm = ['minornm'];
        const chkItem1 = ['item1'];
        const chkItem2 = ['item2'];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
        if (chkItem1.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['item1']: value.trim() } };
        }
        if (chkItem2.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['item2']: value.trim() } };
        }
      } else if (is_exception) {
        obj = iValue;
      } else {
        const chkCd = ['minorcd'];
        const chkNm = ['minornm'];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
      }
    }
  }
  return obj;
};

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

  marginZero: {
    marginTop: 0,
  },

  TitleBox: {
    margin: '3px 15px',
    backgroundColor: '#e0ecff',
    color: '#163971',
    padding: 5,
    height: 25,
    fontSize: '12px',
    alignItems: 'center',
    width: 110,
    fontWeight: 600,
    display: 'inline-block',
    position: 'relative',
  },

  TitleBoxR: {
    position: 'absolute',
    right: 5,
    top: 4,
    color: '#ffa8a8',
  },

  TitleBox3: {
    margin: '3px 10px 3px 100px',
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

  TitleText: {
    width: 100,
  },

  InputBox: {
    width: 185,
    height: 25,
    marginTop: 3,
    '& input': {
      fontSize: '12px !important',
    },
    '& textarea': {
      fontSize: '12px !important',
      fontFamily: 'Noto Sans KR',
    },
  },

  InputBox2: {
    width: 185,
    height: 25,
    marginTop: 3,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'right',
    },
    '& textarea': {
      fontSize: '12px !important',
      fontFamily: 'Noto Sans KR',
    },
  },

  InputBox3: {
    marginLeft: 5,
    width: 140,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
    '& textarea': {
      fontSize: '12px !important',
      fontFamily: 'Noto Sans KR',
    },
  },

  InputBox4: {
    width: 185,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
    '& textarea': {
      fontSize: '12px !important',
      fontFamily: 'Noto Sans KR',
    },
  },

  RadioLabel: {
    display: 'flex',
    alignItems: 'center',
    height: 20,
    width: 50,
    fontSize: 12,
    margin: '0px 1px',
  },

  RB1: {
    width: '15px!important',
    height: '15px!important',
  },

  RB2: {
    '& :focus-visible': {
      outline: 'none!important',
      border: '2px solid #91a7ff!important',
    },
  },

  DateFont: {
    width: 110,
    height: 25,
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

  ComboStyle2: {
    width: 50,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },

  CB: {
    margin: '3px 0px 0px 10px',
    width: '15px!important',
    height: '15px!important',
  },

  BoxAlignStyle: {
    marginTop: 3,
    display: 'flex',
    alignItems: 'end',
  },

  BoxAlignStyle2: {
    marginTop: 0,
    display: 'flex',
    alignItems: 'end',
  },

  onKeyEventBox: {
    height: 31,
  },

  InputAlignRight: {
    textAlign: 'right ',
  },
});

export default TextBoxDefault;
