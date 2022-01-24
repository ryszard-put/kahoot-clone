import ReactDOM from 'react-dom';

import '@picocss/pico/css/pico.min.css'
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

localStorage.setItem('debug', '*');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
