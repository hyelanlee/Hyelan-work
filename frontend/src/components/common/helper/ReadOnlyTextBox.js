import React from 'react';
import { observer } from 'mobx-react-lite';
import { createUseStyles } from 'react-jss';
import { TextBox } from 'rc-easyui';

const ReadOnlyTextBox = observer(({ inputId, inputName, inputValue, inputStyle = undefined }) => {
  const classes = Styles();

  return (
    <>
      <TextBox
        key={inputId}
        name={inputName}
        inputId={inputId}
        value={inputValue}
        className={classes.ReadOnlyBox}
        style={inputStyle === undefined ? { marginTop: 3, width: 150 } : inputStyle}
        disabled
        readonly
      />
    </>
  );
});

const Styles = createUseStyles({
  ReadOnlyBox: {
    marginRight: 5,
    width: 120,
    height: 25,
    '& input': {
      fontSize: '12px !important',
    },
  },
});

export default ReadOnlyTextBox;
