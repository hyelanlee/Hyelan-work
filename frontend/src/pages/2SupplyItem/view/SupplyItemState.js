import { useState } from 'react';
import moment from 'moment';
import useStores from '@stores/useStores';

export default function SupplyItemState() {
  const { $UserStore } = useStores();
  const [searchVO, setSearchVO] = useState({
    SchAccunit: '',
    SchFactory: '',
    SchCustCd: $UserStore.user.custcd,
    SchCustNm: $UserStore.user.custnm,
    SchGoodNo: '',
    SchStatus: '0',
    SchBalNo: '',
    SchDateType: '1',
    // SchFrDate: moment().clone().startOf('year').toDate(),
    SchFrDate: moment().subtract(1, 'month'),
    SchToDate: new Date(),
    SchNapDate: new Date(),
  });

  const [gridFocus, setGridFocus] = useState('');
  const [dateLabel, setDateLabel] = useState('발주일자');
  const [supNoList, setSupNoList] = useState('');
  const [supNo, setSupNo] = useState('');
  const [supplyDate, setSupplyDate] = useState(new Date());
  const [incompleteSupply, setIncompleteSupply] = useState([]);
  const [printView, setPrintView] = useState(false);
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [toast, setToast] = useState({ visible: false, desc: '', type: 'N', duration: 2500 });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });

  const [cboSchType] = useState([
    { value: '0', text: '작성' },
    { value: '1', text: '진행' },
    { value: '2', text: '보류' },
    { value: '3', text: '완료' },
    { value: '4', text: '모두' },
  ]);

  return {
    searchVO,
    setSearchVO,
    gridFocus,
    setGridFocus,
    cboSchType,
    alert,
    setAlert,
    confirm,
    setConfirm,
    supplyDate,
    setSupplyDate,
    supNoList,
    setSupNoList,
    supNo,
    setSupNo,
    dateLabel,
    setDateLabel,
    incompleteSupply,
    setIncompleteSupply,
    printView,
    setPrintView,
    toast,
    setToast,
  };
}
