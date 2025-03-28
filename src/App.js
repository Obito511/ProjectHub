import logo from './logo.svg';
import './App.css';

import Login from './components/login/Login';
import Navbar from './components/Navbar/Navbar';

import Vnavbar from './components/Vnavbar/Vnavbar';

import Task from './components/Task/Task.js';
import ProjectForm from './components/CreateProject/ProjectForm.js';

import TaskBoard from "./components/TaskBoard/TaskBoard";


import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ProjectsList from './components/ProjectsList/ProjectsList';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import ProjectDashboard from './components/Projects/Projects';
import TaskForm from './components/createtask/Createtask';

function App() {
  return (
    <div className="App">

      <div className='div1'>
        <Navbar/>
        <div className='div2'>
        <ProjectForm/>
        </div>
        <div className='div3'>
        <Vnavbar/>
        </div>
      </div>
      
      


     </div>

      <div className='div0'>
           <Navbar />
          
        <div className='div2'>
            <div className='div3'><Vnavbar/></div>
            <div className='div4'><TaskForm/></div>
                
        </div>    
      </div>
    </div>

  );
}

export default App;
