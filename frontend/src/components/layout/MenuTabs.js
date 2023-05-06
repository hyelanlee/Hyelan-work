import React, { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useStores from '@stores/useStores';
import { observer } from 'mobx-react-lite';
import { FaRegListAlt } from 'react-icons/fa';
import { Box } from '@material-ui/core';
import { createUseStyles } from 'react-jss';
import { Tabs, TabPanel, Label } from 'rc-easyui';
import { CgCloseR } from 'react-icons/cg';

const MenuTabs = observer(() => {
  const { $UserStore, $RouteStore, $TabStore } = useStores();
  const classes = Styles();
  const history = useHistory();
  const location = useLocation();

  const refMenu = useRef();
  const refTab = useRef();

  const fMenu = () => {
    if (location.pathname !== '/main') {
      history.push('/main');
    }
  };

  const fTabSelect = (e) => {
    if ($TabStore.tabSel !== e.props.path) {
      history.push(e.props.path);
    }
  };

  const fTabClose = (currPath) => {
    const nextTabs = $TabStore.tabs.filter((item) => item.path !== currPath);
    $TabStore.fSetTab(nextTabs);
    setTimeout(() => {
      if (nextTabs.length === 0) {
        history.push('/main');
      } else {
        const lastItem = nextTabs[nextTabs.length - 1];
        history.push(lastItem.path);
      }
    }, 10);
  };

  useEffect(() => {
    $TabStore.fSetTabSel(location.pathname);
    if (location.pathname === '/main') {
      setTimeout(() => {
        if (refMenu) {
          refMenu.current.select(0);
        } else {
          setTimeout(() => {
            refMenu.current.select(0);
          }, 1000);
        }
      }, 100);
      const pan = refTab.current.getSelectedPanel();
      const idxPan = refTab.current.getPanelIndex(pan);
      refTab.current.unselect(idxPan);
    } else {
      const pgm = $RouteStore.routes.find((route) => route.path === location.pathname);
      if (pgm) {
        if ($UserStore.fCheckAuth(pgm.pgmid)) {
          if (!$TabStore.tabs.some((item) => item.path === location.pathname)) {
            const pgm2 = $RouteStore.routes.find((route) => route.path === location.pathname);
            const inTabs = $TabStore.tabs.concat({
              title: pgm2.title,
              path: location.pathname,
              close: true,
            });
            $TabStore.fSetTab(inTabs);
          }
          refMenu.current.unselect(0);
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/main') {
      const idx = $TabStore.tabs.findIndex((item) => item.path === location.pathname);
      setTimeout(() => {
        if (refTab.current && refMenu.current) {
          refTab.current.select(idx);
          refMenu.current.unselect(0);
        } else {
          setTimeout(() => {
            if (refTab.current && refMenu.current) {
              refTab.current.select(idx);
              refMenu.current.unselect(0);
            } else {
              setTimeout(() => {
                if (refTab.current && refMenu.current) {
                  refTab.current.select(idx);
                  refMenu.current.unselect(0);
                }
              }, 1500);
            }
          }, 700);
        }
      }, 100);
    }
  }, [$TabStore.tabs, location.pathname]);

  return (
    <>
      <Box style={{ width: 1688 }} display="flex" flexDirection="row">
        <Tabs ref={refMenu} className={classes.S1} style={{ width: 58, height: 35 }} onTabSelect={fMenu} tabHeight={0}>
          <TabPanel title={<FaRegListAlt size="25" />} path="/main" />
        </Tabs>
        <Tabs ref={refTab} className={classes.S1} style={{ width: 1630, height: 35 }} scrollable onTabSelect={fTabSelect} tabHeight={0}>
          {$TabStore.tabs.map((item) => (
            <TabPanel
              title={
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Label style={{ margin: '0 3px', width: '100%', fontSize: '14px' }}>{item.title}</Label>
                  <Box style={{ fontSize: '13px', marginTop: '2px', color: 'red', cursor: 'pointer' }} onClick={() => fTabClose(item.path)}>
                    <CgCloseR />
                  </Box>
                </Box>
              }
              key={item.path}
              path={item.path}
            />
          ))}
        </Tabs>
      </Box>
    </>
  );
});

const Styles = createUseStyles({
  S1: {
    '& .tabs-header': {
      borderRightWidth: '0px',
      borderLeftWidth: '0px',
    },
  },
});

export default MenuTabs;
