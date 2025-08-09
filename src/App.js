import './App.css';
import { BarTrue } from './scripts';

function App() {
  return (
  
  <div className="App">

  <div className ="navBar">
      <nav>
        <ul>
          <li><a href='#'>A</a></li>
          <li onClick={BarTrue}><a href='#'>B</a></li>
          <li><a href='#'>C</a></li>
          <li><a href='#'>D</a></li>
        </ul>
      </nav>
    </div>
  </div>
  );


  
}

export default App;
