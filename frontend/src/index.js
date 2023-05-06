import React from 'react';
import { render } from 'react-dom';
import loadable from '@loadable/component';
import '@assets/css/index.css';

const App = loadable(() => import('@root/App'));

const root = document.getElementById('root');
render(<App />, root);
