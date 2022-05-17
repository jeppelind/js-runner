import React from 'react';
import './index.scss';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import APIListeners from './electronAPI/api';
import Header from './features/header/Header';
import Content from './features/content/Content';

const App = () => (
  <RecoilRoot>
    <APIListeners />
    <Header />
    <Content />
  </RecoilRoot>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
