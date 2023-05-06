import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { TextBox } from 'rc-easyui';

const TextEdit = observer((props) => {
  useEffect(() => {
    if (props.maxLength) {
      document.getElementById(props.Util.Common.fMakeId(props.name)).maxLength = props.maxLength;
    }
  }, []);

  return (
    <>
      <TextBox
        inputCls={props.inputCls}
        key={props.inputId}
        name={props.name}
        inputId={props.inputId}
        value={props.value}
        className={props.className}
        style={props.style}
        onChange={props.onChange}
        disabled={props.disabled}
      />
    </>
  );
});

export default TextEdit;
