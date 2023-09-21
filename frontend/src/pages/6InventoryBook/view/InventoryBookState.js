import { useState, createContext } from 'react';
import moment from 'moment';
import useStores from '@stores/useStores';

export default function InventoryBookState() {
  const { $UserStore } = useStores();
  const [searchVO, setSearchVO] = useState({
    Accunit: $UserStore.user.accunit,
    ReferenceDate: moment().format('YYYY-MM-DD'),
    NapDate: moment().format('YYYY-MM-DD'),
    FrDate: moment().startOf('month').format('YYYY-MM-DD'),
    ToDate: moment().format('YYYY-MM-DD'),
    CustCd: '',
    CustCdNm: '',
    Clastype: '0',
    Supply: '0',
    Factory: $UserStore.user.factory,
    Category: '0',
    SaftyStock: false,
    BoxingYn: 0,
    Class2: '',
    Class2Nm: '',
    Class3: '',
    Class3Nm: '',
    Class4: '',
    Class4Nm: '',
    Class5: '',
    Class5Nm: '',
    GoodNo: '',
  });
  const [printView, setPrintView] = useState(false);
  const [alert, setAlert] = useState({ visible: false, desc: '', type: 'N' });
  const [toast, setToast] = useState({ visible: false, desc: '', type: 'N', duration: 2500 });
  const [confirm, setConfirm] = useState({ visible: false, desc: '', id: '' });
  const [gridFocus, setGridFocus] = useState('');
  const SearchVOContext = createContext(500);

  return {
    searchVO,
    setSearchVO,
    printView,
    setPrintView,
    alert,
    setAlert,
    toast,
    setToast,
    confirm,
    setConfirm,
    gridFocus,
    setGridFocus,
    SearchVOContext,
  };
}
