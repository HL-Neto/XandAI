import './App.css';
import { BarTrue, showBar } from './scripts';

function App() {
  return (
  
  <div className="App">

  <div className ="navBar">
      <nav>
        <ul>
          <li onClick={showBar}><a href='#'>Logo</a></li>
          <li><a href='#'>A</a></li>
          <li><a href='#'>B</a></li>
          <li><a href='#'>C</a></li>
          
        </ul>
      </nav>
    </div>
  
    <div className = "hisChat">
      <nav>
        <ul>
          <li><a href='#'>chat</a></li>
          <li><a href='#'>1</a></li>
          <li><a href='#'>2</a></li>
          <li><a href='#'>3</a></li>
        </ul>
      </nav>

    </div>
  
  
  
  
  
  
  
  </div>



  
  );


  
}

export default App;
