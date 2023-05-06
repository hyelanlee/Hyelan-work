import React, { useEffect, useState, useRef } from 'react';
import useStores from '@stores/useStores';
import { Box } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { TextBox } from 'rc-easyui';
import axios from 'axios';
import CodeclassConfirm from '@components/common/CodeclassConfirm';
import Alert from '@components/common/Alert';
import { FaStar } from 'react-icons/fa';
import { Utility } from '@components/common/Utility/Utility';

const AccountCodeHelper = observer(
  ({
    inputCls,
    pgmid,
    inputType,
    id,
    title,
    helper,
    onConfirm,
    ComponentValue,
    ComponentName,
    SetValue,
    boxStyles,
    labelStyles,
    inputStyles,
    disabled,
    editable,
    onTabEvent,
    inputRequired = false,
  }) => {
    const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
    const Util = new Utility(pgmid, setAlert, true, true, true, true, true);
    const classes = Styles();

    const refSearchValue = useRef('');
    const { $CommonStore } = useStores();
    const [ComponentVO, setComponentVO] = useState({
      CompValue: ComponentValue,
      CompName: ComponentName,
    });
    const [codeClassVO, setCodeClassVO] = useState({
      visible: false,
      description: '',
      value: '',
      datas: {},
      id: '',
      viewId: '',
      selectedData: {},
    });

    const fConfirm = () => {
      fChangeStateBinding($CommonStore.Codeclass.selData);
      Util.Common.fFieldChange(setCodeClassVO, 'visible', false);
      $CommonStore.fSetCodeclassPopup(false);
    };

    const fCancel = () => {
      document.getElementById(codeClassVO.id).focus();
      Util.Common.fFieldChange(setCodeClassVO, 'visible', false);
      $CommonStore.fSetCodeclassPopup(false);
    };

    // Next 포커스
    const fNextFocus = () => {
      const elems = document.getElementsByClassName('inputCls');
      const filtered = Object.values(elems).filter((item) => item.id.includes(pgmid));
      const chkIdx = Number(document.getElementById(Util.Common.fMakeId(id)).getAttribute('tabindex')) + 1;

      for (let i = filtered.length; i--; ) {
        const idx = Number(filtered[i].getAttribute('tabindex'));
        if (chkIdx === idx) {
          setTimeout(() => {
            filtered[i].focus();
          });
        }
      }
    };

    const fPreviousFocus = (id) => {
      const elems = document.getElementsByClassName('inputCls');
      const filtered = Object.values(elems).filter((item) => item.id.includes(pgmid));
      const chkIdx = Number(document.getElementById(Util.Common.fMakeId(id)).getAttribute('tabindex')) + 1;

      for (let i = filtered.length; i--; ) {
        const idx = Number(filtered[i].getAttribute('tabindex'));
        if (chkIdx === idx) {
          setTimeout(() => {
            filtered[i - 2].focus();
          });
        }
      }
    };

    // 코드 도움말 조회
    const fCodeclass = async (inputName, inputType, searchValue = '', popupOpen = true, isCoercion = false) => {
      var apiUrl;
      let restVO = { ...helper };

      if (inputType === 'Cust') {
        apiUrl = 'selectByCustClass';
      } else {
        apiUrl = 'selectByTSqlItem';
        restVO.iCustNm = searchValue;
      }

      try {
        let result = await axios.get(`/@api/common/codeclass/${apiUrl}`, {
          params: restVO,
        });

        let resultData = result.data[1];
        let chk = {};

        resultData.map((item, index, array) => {
          if (inputType === 'Cust') {
            if (item.custnm === (searchValue.length > 0 && searchValue) || item.custcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Pno') {
            if (item.name === (searchValue.length > 0 && searchValue) || item.pno === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Dept') {
            if (item.deptnm === (searchValue.length > 0 && searchValue) || item.deptcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Act') {
            if (item.actnm3 === (searchValue.length > 0 && searchValue) || item.actcod === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Whs') {
            if (item.wrhnm === (searchValue.length > 0 && searchValue) || item.wrhcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else {
            if (item.minornm === (searchValue.length > 0 && searchValue) || item.minorcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          }
        });

        if (isCoercion) {
          setCodeClassVO({
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            id: Util.Common.fMakeId(id),
            viewId: inputName,
            selectedData: $CommonStore.Codeclass.selData,
          });
          $CommonStore.fSetCodeclassPopup(true);
        } else if (Object.keys(chk).length < 1 && popupOpen) {
          setCodeClassVO({
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            id: Util.Common.fMakeId(id),
            viewId: inputName,
            selectedData: $CommonStore.Codeclass.selData,
          });
          $CommonStore.fSetCodeclassPopup(true);
        } else if (Object.keys(chk).length > 0) {
          if (onTabEvent) {
            onTabEvent();
          } else {
            fNextFocus();
          }
          fChangeStateBinding(chk);
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

    // 코드 도움말 바인딩
    const fChangeStateBinding = (selData) => {
      switch (inputType) {
        case 'Dept':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.deptcd),
              CompName: Util.Common.fTrim(selData.deptnm),
            });
          }
          break;
        case 'Pno':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.pno),
              CompName: Util.Common.fTrim(selData.name),
            });
          }
          break;
        case 'Cust':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.custcd),
              CompName: Util.Common.fTrim(selData.custnm + '(' + Util.Common.fTrim(selData.taxno) + ')'),
            });
            $CommonStore.fSetParameter([selData.taxno, selData.custnm]);
          }
          break;
        case 'Act':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.actcod),
              CompName: Util.Common.fTrim(selData.actnm3),
            });
          }
          break;
        case 'Whs':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.wrhcd),
              CompName: Util.Common.fTrim(selData.wrhnm),
            });
          }
          break;
        case 'Whcd':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.wrhcd),
              CompName: Util.Common.fTrim(selData.wrhnm),
            });
          }
          break;
        case 'Man':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.pno),
              CompName: Util.Common.fTrim(selData.name),
            });
          }
          break;
        case 'Lcno':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.lcno),
              CompName: Util.Common.fTrim(selData.lcno),
            });
          }
          break;
        case 'Good':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.goodno),
              CompName: Util.Common.fTrim(selData.lcno),
            });
          }
          break;
        case 'Card':
          {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.cardcd),
              CompName: Util.Common.fTrim(selData.cardno.substr(0, 19)),
            });
          }
          break;
        default:
          if (title === '금융기관') {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.minorcd),
              CompName: Util.Common.fTrim(selData.minornm) + '(' + Util.Common.fTrim(selData.item1) + ')',
            });
          } else {
            Util.Common.fMultiFieldChange(setComponentVO, {
              CompValue: Util.Common.fTrim(selData.minorcd),
              CompName: Util.Common.fTrim(selData.minornm),
            });
          }
          break;
      }
    };

    const fOnChange = (value) => {
      refSearchValue.current = value;
    };

    // 텍스트 박스 키 다운 이벤트
    const fHandleKeyDown = (e, inputName) => {
      if (e.key === 'Enter') {
        if (e.target.value || inputRequired) {
          Util.Common.fMultiFieldChange(setComponentVO, {
            CompValue: undefined,
            CompName: undefined,
          });
          fCodeclass(inputName, inputType, e.target.value, true);
        } else {
          fNextFocus();
        }
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          fPreviousFocus();
        } else if (e.target.value || inputRequired) {
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
        fCodeclass(inputName, inputType, e.target.value, true, true);
      }
    };

    // 텍스트 박스 키 업 이벤트
    const fHandleKeyUp = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        $CommonStore.fSetCodeclass({
          selData: {},
          inputId: Util.Common.fMakeId(id),
          inputName: id,
          inputType: 'DEL',
          isHelper: helper,
        });

        Util.Common.fMultiFieldChange(setComponentVO, {
          CompValue: undefined,
          CompName: undefined,
        });
      }
    };

    useEffect(() => {
      SetValue(id, ComponentVO.CompValue, ComponentVO.CompName);
    }, [ComponentVO.CompName]);

    useEffect(() => {
      Util.Common.fMultiFieldChange(setComponentVO, {
        CompValue: ComponentValue,
      });
      refSearchValue.current = ComponentValue;

      if (ComponentValue !== '' && ComponentValue !== undefined && ComponentName === '' && ComponentName === undefined) {
        fCodeclass(Util.Common.fMakeId(id), inputType, refSearchValue.current === null ? '' : refSearchValue.current, false);
      }
    }, [ComponentValue]);

    useEffect(() => {
      setTimeout(() => {
        fNextFocus();
      }, 200);
    }, [ComponentVO.CompValue, ComponentVO.CompName]);

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
          // onConfirm={fNextFocus()}
          onCancel={() => Util.Common.fCancel(id)}
          setVisibleData={fConfirm}
          setVisibleCancel={fCancel}
        />
        <Box className={classes.BoxAlignStyle} style={boxStyles}>
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
                key={Util.Common.fMakeId(id)}
                inputCls={inputCls}
                inputId={Util.Common.fMakeId(id)}
                placeholder=""
                className={classes.InputBox}
                onChange={(value) => fOnChange(value)}
                value={ComponentVO.CompValue}
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
                        fCodeclass(Util.Common.fMakeId(id), inputType, refSearchValue.current === null ? '' : refSearchValue.current, true, true);
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

const StylesMain = {
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

  SB5: {
    width: 77,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'center',
      color: '#424242',
    },
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
};

const Styles = createUseStyles(StylesMain);

export default AccountCodeHelper;
