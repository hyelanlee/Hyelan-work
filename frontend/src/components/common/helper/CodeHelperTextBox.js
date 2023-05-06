import React, { useEffect, useState, useCallback, useRef } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { TextBox } from 'rc-easyui';
import axios from 'axios';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import Alert from '@components/common/Alert';
import { FaStar } from 'react-icons/fa';
import { Common } from '@components/common/Utility/Common';

const CodeHelperTextBox = observer(
  ({ inputCls, pgmid, inputType, id, title, placeHolder, helper, onConfirm, inputValue, codeValue, labelStyles, inputStyles, disabled, editable, onTabEvent, inputRequired = false }) => {
    const { $CommonStore } = useStores();
    const classes = Styles();

    const UtilCommon = new Common(pgmid);
    const refWidth = useRef(0);

    const [commonVO, setCommonVO] = useState(null);
    const [txtValue, setTxtValue] = useState(null);
    const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
    const [codeClassVO, setCodeClassVO] = useState({
      visible: false,
      description: '',
      value: '',
      codeValue: '',
      datas: {},
      id: '',
      viewId: '',
      selectedData: {},
    });

    // 코드도움말 확인 버튼
    const fConfirm = () => {
      const selData = $CommonStore.Codeclass.selData;
      setCommonVO(selData);
      setCodeClassVO({ visible: false });
      $CommonStore.fSetCodeclassPopup(false);
    };

    // 코드도움말 취소 버튼
    const fCancel = () => {
      document.getElementById(codeClassVO.id).focus();
      setCodeClassVO({ visible: false });
      $CommonStore.fSetCodeclassPopup(false);
    };

    // 텍스트 박스 키 다운 이벤트
    const fHandleKeyDown = (e, inputName) => {
      if (e.key === 'Enter') {
        if (e.target.value || inputRequired) {
          fCodeclass(inputName, inputType, e.target.value, true);
        } else {
          fNextFocus();
        }
      } else if (e.key === 'Tab' && !$CommonStore.fGetShift()) {
        if (e.target.value || inputRequired) {
          fCodeclass(inputName, inputType, e.target.value, true);
        } else {
          if (onTabEvent) {
            onTabEvent();
          } else {
            fNextFocus();
          }
        }
      }

      if (e.ctrlKey && e.which === 32) {
        fCodeclass(inputName, inputType, e.target.value, true);
      }
    };

    // 텍스트 박스 키 업 이벤트
    const fHandleKeyUp = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        $CommonStore.fSetCodeclass({
          // selData: { minorcd: '', minornm: e.target.value },
          selData: {},
          inputId: UtilCommon.fMakeId(id),
          inputName: id,
          inputType: 'DEL',
          isHelper: helper,
        });
        onConfirm();
      }
    };

    // Next 포커스
    const fNextFocus = () => {
      const elems = document.getElementsByClassName('inputCls');
      const filtered = Object.values(elems).filter((item) => item.id.includes(pgmid));
      const chkIdx = Number(document.getElementById(UtilCommon.fMakeId(id)).getAttribute('tabindex')) + 1;

      for (let i = filtered.length; i--; ) {
        const idx = Number(filtered[i].getAttribute('tabindex'));
        if (chkIdx === idx) {
          setTimeout(() => {
            filtered[i].focus();
          });
        }
      }
    };

    // 텍스트 박스 onChange 이벤트
    const fHandleInput = (value, type, obj, iType) => {
      if (type === 'CODECLASS') {
        $CommonStore.fSetChangeValue({
          inputId: UtilCommon.fMakeId(id),
          inputName: id,
          inputValue: fReturnMinor(id, obj, iType),
          inputType: type,
        });

        $CommonStore.fSetCodeclass({
          selData: obj,
          inputId: UtilCommon.fMakeId(id),
          inputName: id,
          inputType: type,
          isHelper: helper,
        });
        onConfirm();
      }
      setTxtValue(value);
    };

    // 코드도움말 팝업 버튼 / Enter / Tab 키 입력 시
    const fCodeclass = async (inputName, inputType, searchValue = '', popupOpen = true) => {
      let apiUrl = 'selectByTSqlItem';

      let restVO = { ...helper };

      if (inputType === 'Cust') {
        apiUrl = 'selectByCustClass';
        restVO.iCustNm = searchValue;
      }

      try {
        let result = await axios.get(`/@api/common/codeclass/${apiUrl}`, {
          params: restVO,
        });

        let _data = result.data[1];
        let chk = {};
        let cnt = 0;

        _data.map((item, index, array) => {
          if (inputType === 'Cust') {
            if (item.custnm === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
              cnt += 1;
            }
          } else {
            const isSameTxt = (el) => {
              if (inputType === 'Pno') {
                return el.trim() === (searchValue.length > 0 && searchValue);
              }
              return el === (searchValue.length > 0 && searchValue);
            };

            if (Object.values(item).some(isSameTxt)) {
              chk = { ...chk, ...array[index] };
              cnt += 1;
            }
          }
        });

        let totalSize = 0;
        result.data[0].map((item) => {
          totalSize += Number(item.Size);
        });

        refWidth.current = totalSize < 470 ? 470 : totalSize + 80;

        if (Object.keys(chk).length < 1 && popupOpen) {
          setCodeClassVO({
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: txtValue,
            codeValue: codeValue,
            id: UtilCommon.fMakeId(id),
            viewId: inputName,
            selectedData: commonVO,
          });
          $CommonStore.fSetCodeclassPopup(true);
        } else if (Object.keys(chk).length > 0) {
          if (cnt > 1) {
            setCodeClassVO({
              visible: true,
              datas: result.data,
              desc: result.data[2][0].Remark,
              value: txtValue,
              codeValue: codeValue,
              id: UtilCommon.fMakeId(id),
              viewId: inputName,
              selectedData: commonVO,
            });
            $CommonStore.fSetCodeclassPopup(true);
          } else {
            if (onTabEvent) {
              onTabEvent();
            } else {
              fNextFocus();
            }
            fHandleInput(txtValue, 'CODECLASS', chk, inputType);
            document.removeEventListener('keydown', fKeyDownEvent);
          }
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

    const fReturnMinor = (iName, iValue, iType) => {
      let obj = {};

      const CheckIndex = (code, name, key, value) => {
        const chkCd = [code];
        const chkNm = [name];
        if (chkCd.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minorcd']: value.trim() } };
        }
        if (chkNm.indexOf(key) > -1) {
          obj = { ...obj, ...{ ['minornm']: value.trim() } };
        }
      };

      for (const [key, value] of Object.entries(iValue)) {
        if (value) {
          switch (iType) {
            case 'Cust':
              CheckIndex('custcd', 'custnm', key, value);
              break;
            case 'Dept':
              CheckIndex('deptcd', 'deptnm', key, value);
              break;
            case 'Pno':
              CheckIndex('pno', 'name', key, value);
              break;
            case 'Shop':
              CheckIndex('shopcd', 'shopnm', key, value);
              break;
            case 'Class4':
              {
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
              }
              break;
            default:
              CheckIndex('minorcd', 'minornm', key, value);
              break;
          }
        }
      }
      return obj;
    };

    const fKeyDownEvent = useCallback((e) => {
      if (e.key === 'Enter' && alert.visible) {
        setAlert({ visible: false, disc: '' });
      }
    }, []);

    useEffect(() => {
      document.addEventListener('keydown', fKeyDownEvent);
    }, []);

    useEffect(() => {
      setTxtValue(inputValue);
    }, [inputValue]);

    return (
      <>
        <CodeclassConfirm
          visible={codeClassVO.visible}
          description={codeClassVO.desc}
          value={codeClassVO.value}
          datas={codeClassVO.datas}
          id={codeClassVO.id}
          codeValue={codeClassVO.codeValue}
          viewId={codeClassVO.viewId}
          selectedData={codeClassVO.selectedData}
          width={refWidth.current}
          onConfirm={onConfirm}
          onCancel={() => UtilCommon.fCancel(id)}
          setVisibleData={fConfirm}
          setVisibleCancel={fCancel}
        />
        <Box className={classes.BoxAlignStyle}>
          <Box className={classes.TitleBox} style={labelStyles}>
            <span className={classes.TitleText}>{title}</span>
            {inputRequired && (
              <Box className={classes.TitleBoxR}>
                <FaStar size={10} />
              </Box>
            )}
          </Box>
          {helper && (
            <Box
              onKeyDown={(e) => {
                fHandleKeyDown(e, id);
              }}
              onKeyUp={(e) => {
                fHandleKeyUp(e);
              }}
            >
              <TextBox
                key={UtilCommon.fMakeId(id)}
                inputCls={inputCls}
                inputId={UtilCommon.fMakeId(id)}
                placeholder={placeHolder ? placeHolder : ''}
                className={classes.InputBox}
                onChange={(value) => fHandleInput(value)}
                value={txtValue}
                style={inputStyles}
                name={id}
                disabled={disabled}
                editable={editable}
                addonRight={() => (
                  <Box
                    className="textbox-icon icon-search"
                    title="Codeclass"
                    onClick={() => {
                      if (!disabled) {
                        fCodeclass(UtilCommon.fMakeId(id), inputType, '', true);
                      }
                    }}
                  />
                )}
              />
            </Box>
          )}
        </Box>
        <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
      </>
    );
  },
);

const Styles = createUseStyles({
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

  TitleText: {
    width: 100,
  },

  InputBox: {
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

  BoxAlignStyle: {
    marginTop: 3,
    display: 'flex',
    alignItems: 'end',
  },
});

export default CodeHelperTextBox;
