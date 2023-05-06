import React, { useState, useEffect } from 'react';
import useStores from '@stores/useStores';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import SecStorage from '@lib/SecStorage';
import { Box } from '@material-ui/core';
import { MenuButton, Menu, MenuSep, LinkButton } from 'rc-easyui';
import { FaUserEdit, FaUser } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io5';
import imgKsLogo from '@assets/images/img_ks_logo.png';

const Header = observer(() => {
  const { $UserStore, $TabStore } = useStores();
  const history = useHistory();

  const [dbType, setDbType] = useState('');

  const fProfile = () => {
    history.push('/profile');
  };

  const fGetDbType = async () => {
    let result = await axios.get('/@api/auth/selectByDbType', {});
    const rdata = result.data;
    setDbType(rdata);
  };

  const fLogout = async () => {
    try {
      const secureStorage = SecStorage($UserStore.storekey);
      await $UserStore.fClearUser();
      await $UserStore.fSetAuth([]);
      await $TabStore.fSetTab([]);
      await secureStorage.removeItem('user_keysung');
      await secureStorage.removeItem('auth_keysung');
      await axios.post('/@api/auth/workByLogout');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  useEffect(() => {
    const testHost = ['develop.ehansun.co.kr:7005', 'test5.ehansun.co.kr'];
    if (testHost.indexOf(window.location.host) != -1) {
      fGetDbType();
    }
  }, []);

  const UserMenu = () => (
    <Menu noline>
      <LinkButton plain onClick={fProfile}>
        <Box style={{ width: 130, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <FaUserEdit size={17} />
          <Box style={{ marginLeft: 7 }}>사용자정보 변경</Box>
        </Box>
      </LinkButton>
      <MenuSep />
      <LinkButton plain onClick={fLogout}>
        <Box style={{ width: 130, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <IoLogOut size={17} />
          <Box style={{ marginLeft: 7 }}>로그아웃</Box>
        </Box>
      </LinkButton>
    </Menu>
  );

  return (
    <>
      <Box style={{ width: 1910, border: '1px solid #95b8e7', borderBottomWidth: 0, padding: 0 }} display="flex">
        <Box style={{ width: 900, height: 40, backgroundColor: '#fff' }} display="flex" alignItems="center" justifyContent="flex-start">
          <img src={imgKsLogo} alt="logo" style={{ width: 125, height: 31, marginLeft: 20 }} />
          <Box style={{ marginLeft: 15, paddingTop: 8, color: '#424242', fontSize: 13 }}>{process.env.VITE_APP_VERSION}</Box>
        </Box>
        <Box style={{ width: 600, height: 40 }} display="flex" alignItems="center" justifyContent="flex-start">
          {dbType === 'KSBack' && <Box style={{ fontSize: 17, fontWeight: 700, color: '#f00' }}>개발용 DB</Box>}
          {dbType === 'Han_Key' && <Box style={{ fontSize: 17, fontWeight: 700, color: '#0c6' }}>운영용 DB</Box>}
        </Box>
        <Box style={{ width: 395, height: 40, backgroundColor: '#fff' }} display="flex" alignItems="center" justifyContent="flex-end">
          <MenuButton plain menu={UserMenu} style={{ height: 38 }}>
            <Box style={{ height: 38, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <FaUser size={14} />
              <Box style={{ marginLeft: 5, fontSize: 13, paddingBottom: 2 }}>{`${$UserStore.user ? $UserStore.user.username : ''}님`}</Box>
            </Box>
          </MenuButton>
        </Box>
      </Box>
    </>
  );
});

export default Header;
