import React, { /* useState, */ useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Dialog, LinkButton } from 'rc-easyui';
import shortid from 'shortid';
import { createUseStyles } from 'react-jss';
import imgKsMark from '@assets/images/img_ks_mark.png';

const ImageViewer = ({ visible, docNo, docSource, Factory = 'A00', docSeq = 1, buffer, totalCnt, confirmText = '확인', onConfirm, onPrev, onNext }) => {
  const classes = Styles();
  const refConfirm = useRef(null);

  // const [topLeft, setTopLeft] = useState({
  //   top: 0,
  //   left: 0,
  // });

  const Title = () => {
    return (
      <Box key={TitleId} style={{ display: 'flex', alignItems: 'center' }}>
        <img src={imgKsMark} alt="logo" style={{ padding: 5, width: 27 }} />
        <pre disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
          증빙자료 확인
        </pre>
        <pre disabled style={{ margin: '3px 3px', fontWeight: 'bold', color: '#898989' }}>
          {docSource}
        </pre>
        <pre disabled style={{ margin: '3px 3px', fontWeight: 'bold', color: '#898989' }}>
          {docNo}
        </pre>
        <pre disabled style={{ margin: '3px 3px', fontWeight: 'bold', color: '#898989' }}>
          {Factory}
        </pre>
      </Box>
    );
  };

  const fGetStyle = () => {
    let result = {
      maxWidth: 960,
      maxheight: 576,
    };

    return result;
  };

  const fArrayBufferToBase64 = (_buffer) => {
    let base64 = btoa(new Uint8Array(_buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    return base64;
  };

  let deg = 0;
  const fRotate1 = () => {
    deg += 90;
    if (deg === 360) {
      deg = 0;
    }
    document.querySelector('#DelvImage').style.transform = `rotate(${deg}deg)`;
  };

  const fRotate2 = () => {
    deg -= 90;
    if (deg === -360) {
      deg = 0;
    }
    document.querySelector('#DelvImage').style.transform = `rotate(${deg}deg)`;
  };

  const onImgLoad = (e) => {
    console.log('window.innerWidth, window.innerHeight : ', window.innerWidth, window.innerHeight);
    console.log('e.target.offsetWidth, e.target.offsetHeight : ', e.target.offsetWidth, e.target.offsetHeight);
    console.log('top : ', (window.innerWidth - e.target.offsetWidth) / 2);
    console.log('left: ', (window.innerHeight - e.target.offsetHeight) / 2 / 2);
    // setTopLeft({
    //   top: (window.innerWidth - e.target.offsetWidth) / 2),
    //   left: (window.innerHeight - e.target.offsetHeight) / 2 / 2)
    // });
  };

  useEffect(() => {
    if (visible) {
      refConfirm.current.focus();
      let mask = document.getElementsByClassName('window-mask');
      mask[mask.length - 1].style = 'z-index: 99998';
    }
  }, [visible]);

  useEffect(() => {
    if (docSeq > 1 && document.querySelector('#DelvImage')) {
      document.querySelector('#DelvImage').style.transform = `rotate(0deg)`;
    }
  }, [docSeq]);

  if (!visible) return null;
  return (
    <Dialog title={<Title />} style={fGetStyle()} bodyCls="f-column" closable={false} modal className={classes.S1}>
      <Box className="f-full">
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <Box style={{ margin: '10px', height: '100%' }}>
            <img src={`data:image/png;base64,${fArrayBufferToBase64(buffer.data)}`} onLoad={onImgLoad} id="DelvImage" name="DelvImage" alt="DelvImage" style={{ width: '100%', maxHeight: '576px' }} />
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <Box style={{ width: '50%', display: 'flex', alignItems: 'center', margin: 10 }}>
              <LinkButton style={{ width: '80px', marginRight: 3 }} className="c6" onClick={onPrev}>
                PREV
              </LinkButton>
              <pre disabled style={{ margin: '3px 10px', fontWeight: 'bold', color: '#898989' }}>
                {docSeq} / {totalCnt}
              </pre>
              <LinkButton style={{ width: '80px' }} className="c6" onClick={onNext}>
                NEXT
              </LinkButton>
            </Box>
            <Box style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: 10 }}>
              <LinkButton style={{ width: '80px', marginRight: 3 }} className="c6" onClick={fRotate2}>
                - 90
              </LinkButton>
              <LinkButton style={{ width: '80px', marginRight: 3 }} className="c6" onClick={fRotate1}>
                + 90
              </LinkButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="dialog-button">
        <LinkButton ref={refConfirm} style={{ width: '80px' }} className="c6" onClick={onConfirm}>
          {confirmText}
        </LinkButton>
      </Box>
    </Dialog>
  );
};

const TitleId = shortid.generate();

const Styles = createUseStyles({
  S1: {
    zIndex: '99999 !important',
  },
});

export default ImageViewer;
