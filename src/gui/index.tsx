import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import APIListeners from './electronAPI/api';
import Dashboard from './features/dashboard/dashboard';

const App = () => (
  <RecoilRoot>
    <APIListeners />
    <Dashboard />
  </RecoilRoot>
);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);
