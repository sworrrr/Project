import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Router,Route,Link,browserHistory} from 'react-router'
import Bisect from './bisect';
import False from './false';
import Onepoint from './onepoint';
import Newton from './newton';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
    <Route path="/bisect" component={Bisect}/>
    <Route path="/false" component={False}/>
    <Route path="/onepoint" component={Onepoint}/>
    <Route path="/newton" component={Newton}/>

  </Router>,document.getElementById('root')
);

