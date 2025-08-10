import './App.css';
import { showBar } from './scripts';

function App() {
  return (
  
  <div className="App">

  <div className ="navBar">
      <nav>
        <ul>
          <li onClick={showBar}><a href='#'>L</a></li>
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
        </ul>
      </nav>

    </div>

  
  <form action="">
    <div className='textBox'>
      <input typeof='text' placeholder="Chat" required></input>
    </div>
  </form>

  
  </div>
  );
}

export default App;
