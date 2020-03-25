import React,{Component} from 'react';
import './App.css';
import a1 from './p11n.png';
import { render } from '@testing-library/react';

class App extends Component {
  render(){
    return (
      <div className="App">
        <header className="App-header"></header>
        <div className="App-Navbar"><p><font color="white" ><font size="8">The Lesson</font></font></p></div>
        <div className="App-MainContent">
          <div className="App-lesson">
            <div class="dropdown1">
              <img src={a1} alt="Cinque Terre" width="250" height="260" />
              <div class="dropdown-content1">
                <a href="/bisect">Bisecttion Method</a>
                <a href="/false">False-Positon Method</a>
                <a href="/onepoint">Onepoint Iteration Method</a>
                <a href="/newton">Newton-Raphson Method</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default App;
