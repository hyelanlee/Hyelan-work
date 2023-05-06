import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import RootStore from '@stores/RootStore';
import RootLayout from '@pages/layout/RootLayout';
import '@assets/css/app.css';

const rootStore = new RootStore();

const App = () => {
  return (
    <Provider {...rootStore}>
      <BrowserRouter>
        <RootLayout />
      </BrowserRouter>
    </Provider>
  );
};
export default App;
