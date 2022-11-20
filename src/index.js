import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './Home';
import './fonts/SilversPersonalUseRegular-ZV22x.ttf'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
<body>
    <Home />
    <App />
</body>
  </React.StrictMode>
);

