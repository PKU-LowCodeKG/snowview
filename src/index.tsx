import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { appReducer } from './redux/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';
import $ from "jquery"

require('../node_modules/js-snackbar/dist/snackbar.css');
require('./assets/css/snowgraph.css');

// 全局配置 AJAX
$.ajaxSetup({
  xhrFields: {
    withCredentials: true, // 确保发送 Cookie
  },
  crossDomain: true, // 告诉 jQuery 这是跨域请求
});

const store = createStore(appReducer, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
