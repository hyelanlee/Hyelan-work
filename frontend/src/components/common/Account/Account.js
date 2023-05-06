import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { TextBox, NumberBox } from 'rc-easyui';
import { Box } from '@material-ui/core';
import Alert from '@components/common/Alert';
import { Utility } from '@components/common/Utility/Utility';
import moment from 'moment';
import CommonDatePicker from '@components/common/CommonDatePicker';
import AccountCodeHelper from '@root/components/common/Account/AccountCodeHelper';
import * as helper from '@components/common/helper/CodeClass';
import { FaStar } from 'react-icons/fa';

const Account = observer(({ PGMID, Id, Init, Visible, Type, Title, CodeType, InitCode, ComponentValue, ComponentName, SetValue, inputRequired = false }) => {
  const [ComponentVO, setComponentVO] = useState({});

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const Util = new Utility(PGMID, setAlert, true, true, true, true, true);
  const classes = Styles();

  const fCodeHelperSetValue = (id, value, name) => {
    Util.Common.fMultiFieldChange(setComponentVO, {
      CompValue: Util.Common.fTrim(value),
      CompName: Util.Common.fTrim(name),
    });
  };

  const GetHelper = () => {
    if (CodeType === 'Dept') {
      return Util.CodeHelper.helperDeptNm;
    } else if (CodeType === 'Pno') {
      return Util.CodeHelper.helperPnoNm;
    } else if (CodeType === 'Cust') {
      return Util.CodeHelper.helperCust;
    } else if (CodeType === 'Lcno') {
      return Util.CodeHelper.helperImpExpeseLcno;
    } else if (CodeType === 'Man') {
      return Util.CodeHelper.helperPnoNm;
    } else if (CodeType === 'Good') {
      return Util.CodeHelper.helperGoodNoHarf;
    } else if (CodeType === 'Whcd') {
      return Util.CodeHelper.helperWhNm;
    } else if (CodeType === 'Card') {
      return Util.CodeHelper.helperCardNo;
    } else {
      const codehelper = { ...helper.Default };
      codehelper.iInId = 'A001';
      codehelper.iInCode1 = InitCode;
      return codehelper;
    }
  };

  useEffect(() => {
    SetValue(Id, ComponentVO.CompValue, ComponentVO.CompName);
  }, [ComponentVO.CompName]);

  useEffect(() => {
    Util.Common.fMultiFieldChange(setComponentVO, {
      CompValue: undefined,
      CompName: undefined,
    });
  }, [Init, Title]);

  useEffect(() => {
    Util.Common.fMultiFieldChange(setComponentVO, {
      CompValue: ComponentValue,
      CompName: ComponentName,
    });
  }, [ComponentValue, ComponentName]);

  return (
    <>
      {Visible && Type === 'String' && (
        <Box display="flex">
          <Box className={classes.DateTitleBox}>
            <span className={classes.TitleText}>{Title}</span>
            {inputRequired && (
              <Box className={classes.TitleBoxR}>
                <FaStar size={10} />
              </Box>
            )}
          </Box>
          <TextBox
            id={Id}
            inputCls="inputCls"
            name="value"
            inputId={Util.Common.fMakeId(Id)}
            className={classes.InputBox3}
            style={{ width: 505 }}
            value={ComponentVO.CompValue}
            onChange={(value) => Util.Common.fMultiFieldChange(setComponentVO, { CompValue: value, CompName: value })}
          />
        </Box>
      )}
      {Visible && Type === 'Number' && (
        <Box display="flex">
          <Box className={classes.DateTitleBox}>
            <span className={classes.TitleText}>{Title}</span>
            {inputRequired && (
              <Box className={classes.TitleBoxR}>
                <FaStar size={10} />
              </Box>
            )}
          </Box>
          <NumberBox
            inputId={Util.Common.fMakeId(Id)}
            inputCls="inputCls"
            name="ApplyExchange"
            className={classes.Numeric}
            style={{ width: 135 }}
            spinners={false}
            precision={0}
            groupSeparator=","
            value={ComponentVO.CompValue}
            onChange={(value) => Util.Common.fMultiFieldChange(setComponentVO, { CompValue: value, CompName: value })}
          />
        </Box>
      )}
      {Visible && Type === 'Date' && (
        <Box display="flex">
          <Box className={classes.DateTitleBox}>
            <span className={classes.TitleText}>{Title}</span>
            {inputRequired && (
              <Box className={classes.TitleBoxR}>
                <FaStar size={10} />
              </Box>
            )}
          </Box>
          <Box style={{ width: 310, margin: '2.5px 0px 2.5px 10px' }}>
            <CommonDatePicker
              inputCls="inputCls"
              onHandleDateChange={(value) => Util.Common.fMultiFieldChange(setComponentVO, { CompValue: value, CompName: moment(value).format('YYYYMMDD') })}
              inputId={Util.Common.fMakeId(Id)}
              selected={ComponentVO.CompValue} // === undefined ? undefined : new Date(ComponentVO.CompValue.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
              style={{ width: 95 }}
            />
          </Box>
        </Box>
      )}
      {Visible && Type === 'Code' && (
        <Box display="flex" style={{ alignItems: 'center' }}>
          <AccountCodeHelper
            inputCls="inputCls"
            pgmid={PGMID}
            inputType={CodeType}
            id={Id}
            title={Title}
            helper={GetHelper()}
            ComponentValue={ComponentVO.CompValue}
            ComponentName={ComponentVO.CompName}
            SetValue={fCodeHelperSetValue}
            labelStyles={{ margin: '2px 10px 5px', width: 100, height: 26 }}
            inputStyles={{ margin: '2px 0px 5px 10px', width: 135, height: 26 }}
            inputRequired={inputRequired}
          />
          <TextBox className={classes.InputBox3} editable={false} value={ComponentVO.CompName} style={{ width: 360, height: 25, margin: '5px 0px 5px 10px' }} />
        </Box>
      )}
      <Alert visible={alert.visible} description={alert.desc} type={alert.type} onConfirm={() => setAlert({ visible: false })} />
    </>
  );
});

const StylesMain = {
  BoxTitle: {
    backgroundColor: '#fccf76',
    color: '#163971',
    fontWeight: 600,
    fontSize: '12px',
    width: '100%',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  Box: {
    marginLeft: 10,
    marginTop: 10,
    width: '95%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  TextArea: {
    width: '95%',
    height: 100,
    marginLeft: 10,
    display: 'flex',
    '& .textbox-text ': {
      fontSize: '12px !important',
      backgroundColor: '#e0ffff',
    },
  },
  ButtonText: {
    fontSize: 12,
    paddingBottom: 2,
    fontWeight: 500,
  },
  TextBox1: {
    width: 200,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
  TextBox2: {
    width: 200,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      backgroundColor: '#e0ffff',
    },
  },
  InputBox3: {
    margin: '5px 10px',
    width: 80,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
  Numeric: {
    margin: '3px 0px 3px 10px',
    width: 100,
    height: 25,
    '& input': {
      fontSize: '12px !important',
      textAlign: 'right',
    },
  },
  DateTitleBox: {
    margin: '5px 10px',
    backgroundColor: '#e0ecff',
    padding: 5,
    color: '#163971',
    height: 26,
    fontSize: '12px',
    display: 'flex',
    width: 100,
    alignItems: 'center',
    fontWeight: 600,
  },
  TitleText: {
    width: 100,
  },
  TitleBoxR: {
    color: '#ffa8a8',
  },
};

const Styles = createUseStyles(StylesMain);

export default Account;
