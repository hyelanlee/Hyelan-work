import { useState } from 'react';
import moment from 'moment';
import useStores from '@stores/useStores';

export default function QcDelv() {
  const { $UserStore } = useStores();
  const [searchVO, setSearchVO] = useState({
    SchAccunit: $UserStore.user.accunit,
    SchFactory: $UserStore.user.factory,
    SchPno: $UserStore.user.userid,
    SchPnoNm: $UserStore.user.username.trim(),
    SchQcComplate: '1',
    SchFrDate: moment().subtract(1, 'month'),
    SchToDate: new Date(),
    SchQcDate: new Date(),
    SchSupNo: '',
    SchCustCd: '',
    SchCustNm: '',
  });

  const [codeClassInputs, setCodeClassInputs] = useState({
    visible: false,
    description: '',
    value: '',
    datas: {},
    id: '',
    viewId: '',
    selectedData: {},
  });

  const [gridFocus, setGridFocus] = useState('');
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });

  return {
    searchVO,
    setSearchVO,
    alert,
    setAlert,
    confirm,
    setConfirm,
    gridFocus,
    setGridFocus,
    codeClassInputs,
    setCodeClassInputs,
  };
}
