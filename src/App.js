import logo from './logo.svg';
import './App.css';
import Login from './components/login/Login';
import Navbar from './components/Navbar/Navbar';

import Vnavbar from './components/Vnavbar/Vnavbar';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Login />

    </div>
  );
}

export default App;
