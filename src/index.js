import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { createRoot } from 'react-dom/client';
import App from './components/App.js';

const root = document.getElementById('root');
const reactRoot = createRoot(root);
reactRoot.render(<App />);

