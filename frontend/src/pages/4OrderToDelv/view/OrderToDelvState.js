import { useState } from 'react';
import moment from 'moment';
import useStores from '@stores/useStores';

export default function OrderToDelvState() {
  const { $UserStore } = useStores();
  const [searchVO, setSearchVO] = useState({
    SchAccunit: $UserStore.user.accunit,
    SchFactory: $UserStore.user.factory,
    SchPno: $UserStore.user.userid,
    SchCustCd: '',
    SchCustCdNm: '',
    SchFrDate: moment().subtract(1, 'month'),
    SchToDate: new Date(),
    SchDelvYn: '1',
    DeptCd: $UserStore.user.deptcd,
  });

  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });

  return {
    searchVO,
    setSearchVO,
    alert,
    setAlert,
    confirm,
    setConfirm,
  };
}
