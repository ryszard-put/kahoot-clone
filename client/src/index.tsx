import ReactDOM from 'react-dom';
import {NotificationContainer} from 'react-notifications'

import '@picocss/pico/css/pico.min.css'
import './index.css';
import 'react-notifications/lib/notifications.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

localStorage.setItem('debug', '*');

ReactDOM.render(
  <><App /><NotificationContainer /></>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
