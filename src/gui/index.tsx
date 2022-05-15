import React from 'react';
import './index.scss';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import APIListeners from './electronAPI/api';
import Dashboard from './features/dashboard/Dashboard';
import Header from './features/header/Header';

const App = () => (
  <RecoilRoot>
    <APIListeners />
    <Header />
    <Dashboard />
  </RecoilRoot>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
