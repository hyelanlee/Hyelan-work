import React, { useEffect } from 'react';
import axios from 'axios';
import useStores from '@stores/useStores';
import { observer } from 'mobx-react-lite';

const Interceptor = observer(() => {
  const { $CommonStore } = useStores();

  useEffect(() => {
    let loadState = false;
    axios.defaults.headers.common['Cache-Control'] = 'no-cache';
    axios.defaults.headers.common['Pragma'] = 'no-cache';
    axios.defaults.headers.get['If-Modified-Since'] = '0';
    axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
    axios.interceptors.request.use(
      (config) => {
        loadState = true;
        setTimeout(function () {
          if (loadState) {
            $CommonStore.fSetLoading(true);
          }
        }, 600);
        return config;
      },
      (error) => {
        loadState = true;
        setTimeout(function () {
          if (loadState) {
            $CommonStore.fSetLoading(true);
          }
        }, 600);
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 추가
    axios.interceptors.response.use(
      (response) => {
        loadState = false;
        $CommonStore.fSetLoading(false);
        return response;
      },
      (error) => {
        loadState = false;
        $CommonStore.fSetLoading(false);
        return Promise.reject(error);
      },
    );
  }, []);

  return <></>;
});

export default Interceptor;
