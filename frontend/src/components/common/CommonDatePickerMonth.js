import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import { ko } from 'date-fns/locale';

const CommonDatePicker = observer(({ style, disabled, editable = true, selected, inputId, onHandleDateChange, inputRequired = false }) => {
  const classes = Styles();
  return (
    <>
      <Box className={inputRequired ? (selected ? classes.defaultStyle : classes.requiredStyle) : classes.defaultStyle}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
          <DatePicker
            invalidDateMessage="날짜를 확인하세요."
            inputFormat="yyyy-MM"
            mask="____-__"
            value={selected}
            views={['year', 'month']}
            disabled={disabled}
            // onError={(errValue) => {
            //   if (onHandleError) {
            //     onHandleError(errValue);
            //   }
            // }}
            onChange={(newValue) => {
              onHandleDateChange(newValue);
            }}
            renderInput={(params) => <TextField id={inputId} {...params} inputProps={{ ...params.inputProps, readOnly: !editable, className: 'inputCls', style }} />}
          />
        </LocalizationProvider>
      </Box>
    </>
  );
});

const Styles = createUseStyles({
  defaultStyle: {
    '& .MuiOutlinedInput-input': {
      padding: '0 4px',
      fontSize: '12px',
      width: '70px',
      height: 'auto',
      overflow: 'hidden',
      verticalAlign: 'middle',
      lineHeight: 'normal',
      fontWeight: '500',
      fontFamily: 'Noto Sans KR',
    },

    '& .MuiOutlinedInput-root': {
      padding: '0',
    },

    '& .MuiInputAdornment-root': {
      height: '25px',
      margin: '0',
      paddingRight: '4px',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      padding: '0',
      borderWidth: '1px!important',
      borderColor: '#95B8E7!important',
    },

    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#e4e4e4!important',
    },

    '& .MuiOutlinedInput-root.Mui-disabled input:disabled': {
      backgroundColor: '#e4e4e4!important',
    },
  },
  requiredStyle: {
    '& .MuiOutlinedInput-input': {
      padding: '0 4px',
      fontSize: '12px',
      width: '70px',
      height: 'auto',
      overflow: 'hidden',
      verticalAlign: 'middle',
      lineHeight: 'normal',
      fontWeight: '500',
      fontFamily: 'Noto Sans KR',
    },

    '& .MuiOutlinedInput-root': {
      padding: '0',
      backgroundColor: '#fff3f3',
    },

    '& .MuiInputAdornment-root': {
      height: '25px',
      margin: '0',
      paddingRight: '4px',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      padding: '0',
      borderWidth: '1px!important',
      borderColor: '#ffa8a8!important',
    },

    '& .MuiOutlinedInput-root.Mui-disabled': {
      backgroundColor: '#e4e4e4!important',
    },

    '& .MuiOutlinedInput-root.Mui-disabled input:disabled': {
      backgroundColor: '#e4e4e4!important',
    },
  },
});

export default CommonDatePicker;