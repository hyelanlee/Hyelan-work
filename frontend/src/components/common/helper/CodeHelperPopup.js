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

/**
 * inputType: [Dept: 부서, Pno: 사원, Cust: 거래처, Act: 계정과목, Whs: 창고, Good: 품목, '': 기타]
 */
const CodeHelperPopup = observer(
  ({
    inputCls,
    pgmid,
    inputType,
    id,
    title,
    helper,
    onConfirm,
    ComponentCode,
    ComponentValue,
    SetValue,
    boxStyles,
    labelStyles,
    inputStyles,
    disabled,
    editable,
    onTabEvent,
    inputRequired = false,
    InitValue = undefined,
  }) => {
    const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
    const Util = new Utility(pgmid, setAlert, true, true, true, true, true);
    const classes = Styles();

    const refSearchValue = useRef('');
    const refCompValue = useRef('');
    const refCompName = useRef('');
    const refWidth = useRef(470);

    const { $CommonStore } = useStores();
    const [render, setRender] = useState({});
    const [currentData, setCurrentData] = useState({
      Data: '',
    });
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

    const fConfirm = () => {
      fChangeStateBinding($CommonStore.Codeclass.selData);
      setTimeout(() => {
        Util.Common.fMakeFocus(id);
      }, 10);
      Util.Common.fFieldChange(setCodeClassVO, 'visible', false);
      $CommonStore.fSetCodeclassPopup(false);
    };

    const fCancel = () => {
      document.getElementById(codeClassVO.id).focus();
      Util.Common.fFieldChange(setCodeClassVO, 'visible', false);
      $CommonStore.fSetCodeclassPopup(false);
    };

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

    const fDataTrim = (data) => {
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

    const fCodeclass = async (inputName, inputType, searchValue = '', searchCode = null, popupOpen = true, isCoercion = false) => {
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

        let resultData = fDataTrim(result.data[1]);
        let chk = {};

        resultData.some((item, index, array) => {
          if (inputType === 'Cust') {
            if (Util.Common.fTrim(item.custnm) === (searchValue.length > 0 && searchValue) || item.custcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Pno') {
            if (Util.Common.fTrim(item.name) === (searchValue.length > 0 && searchValue) || item.pno === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Dept') {
            if (Util.Common.fTrim(item.deptnm) === (searchValue.length > 0 && searchValue) || item.deptcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Act') {
            if (Util.Common.fTrim(item.actnm3) === (searchValue.length > 0 && searchValue) || item.actcod === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Whs') {
            if (Util.Common.fTrim(item.wrhnm) === (searchValue.length > 0 && searchValue) || item.wrhcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Good') {
            if (Util.Common.fTrim(item.goodno) === (searchValue.length > 0 && searchValue) || item.goodcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else if (inputType === 'Type') {
            if (Util.Common.fTrim(item.codenm) === (searchValue.length > 0 && searchValue) || item.codeid === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          } else {
            if (Util.Common.fTrim(item.minornm) === (searchValue.length > 0 && searchValue) || item.minorcd === (searchValue.length > 0 && searchValue)) {
              chk = { ...chk, ...array[index] };
            }
          }
        });

        let totalSize = 0;
        result.data[0].map((item) => {
          totalSize += Number(item.Size);
        });

        refWidth.current = totalSize < 470 ? 470 : totalSize + 80;

        if (isCoercion) {
          setCodeClassVO({
            visible: true,
            datas: result.data,
            desc: result.data[2][0].Remark,
            value: searchValue,
            codeValue: searchCode === '' ? null : searchCode,
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
            codeValue: null,
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

    const fChangeStateBinding = (selData) => {
      Util.Common.fMultiFieldChange(setCurrentData, {
        Data: selData,
      });

      switch (inputType) {
        case 'Dept':
          {
            refCompValue.current = Util.Common.fTrim(selData.deptcd);
            refCompName.current = Util.Common.fTrim(selData.deptnm);
          }
          break;
        case 'Pno':
          {
            refCompValue.current = Util.Common.fTrim(selData.pno);
            refCompName.current = Util.Common.fTrim(selData.name);
          }
          break;
        case 'Cust':
          {
            refCompValue.current = Util.Common.fTrim(selData.custcd);
            refCompName.current = Util.Common.fTrim(selData.custnm);
          }
          break;
        case 'Act':
          {
            refCompValue.current = Util.Common.fTrim(selData.actcod);
            refCompName.current = Util.Common.fTrim(selData.actnm3);
          }
          break;
        case 'Whs':
          {
            refCompValue.current = Util.Common.fTrim(selData.wrhcd);
            refCompName.current = Util.Common.fTrim(selData.wrhnm);
          }
          break;
        case 'Good':
          {
            refCompValue.current = Util.Common.fTrim(selData.goodcd);
            refCompName.current = Util.Common.fTrim(selData.goodno);
          }
          break;
        case 'Type':
          {
            refCompValue.current = Util.Common.fTrim(selData.codeid);
            refCompName.current = Util.Common.fTrim(selData.codenm);
          }
          break;
        default:
          {
            refCompValue.current = Util.Common.fTrim(selData.minorcd);
            refCompName.current = Util.Common.fTrim(selData.minornm);
          }
          break;
      }
      setRender({ ...render });
    };

    const fOnChange = (value) => {
      refSearchValue.current = value;
    };

    const fHandleKeyDown = (e, inputName) => {
      if (e.key === 'Enter') {
        if (e.target.value || inputRequired) {
          Util.Common.fMultiFieldChange(setCurrentData, {
            Data: '',
          });
          refCompValue.current = '';
          refCompName.current = '';
          fCodeclass(inputName, inputType, e.target.value, refCompValue.current, true);
        } else {
          fNextFocus();
        }
      } else if (!$CommonStore.isShift && e.key === 'Tab') {
        if (e.target.value || inputRequired) {
          fCodeclass(inputName, inputType, e.target.value, refCompValue.current, true);
        } else {
          if (onTabEvent) {
            onTabEvent();
          } else {
            fNextFocus();
          }
        }
      }

      if (e.ctrlKey && e.which === 32) {
        fCodeclass(inputName, inputType, e.target.value, refCompValue.current, true, true);
      }
    };

    const fHandleKeyUp = (e) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        $CommonStore.fSetCodeclass({
          selData: {},
          inputId: Util.Common.fMakeId(id),
          inputName: id,
          inputType: 'DEL',
          isHelper: helper,
        });

        Util.Common.fMultiFieldChange(setCurrentData, {
          Data: '',
        });

        refCompValue.current = '';
        refCompName.current = '';
      }
    };

    useEffect(() => {
      SetValue(id, Util.Common.fTrim(refCompValue.current), Util.Common.fTrim(refCompName.current), currentData);
    }, [refCompName.current]);

    useEffect(() => {
      if (Util.Common.fEmptyReturn(ComponentValue) === '') {
        Util.Common.fMultiFieldChange(setCurrentData, {
          Data: '',
        });

        refCompValue.current = '';
        refCompName.current = '';
      } else {
        refCompValue.current = ComponentCode;
        refCompName.current = ComponentValue;
        setRender({ ...render });
      }
    }, [ComponentValue]);

    useEffect(() => {
      if (InitValue === undefined) {
        return;
      }

      refCompValue.current = InitValue.CompValue;
      refCompName.current = InitValue.CompName;
    }, []);

    return (
      <>
        <CodeclassConfirm
          visible={codeClassVO.visible}
          description={codeClassVO.desc}
          value={codeClassVO.value}
          codeValue={codeClassVO.codeValue}
          datas={codeClassVO.datas}
          id={codeClassVO.id}
          viewId={codeClassVO.viewId}
          selectedData={codeClassVO.selectedData}
          width={refWidth.current}
          onConfirm={onConfirm}
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
                value={refCompName.current}
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
                        fCodeclass(Util.Common.fMakeId(id), inputType, refSearchValue.current === null ? '' : refSearchValue.current, refCompValue.current, true, true);
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

export default CodeHelperPopup;
