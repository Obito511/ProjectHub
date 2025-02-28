import logo from './logo.svg';
import './App.css';

import Login from './components/login/Login';
import Navbar from './components/Navbar/Navbar';

import Vnavbar from './components/Vnavbar/Vnavbar';


import ProfilePage from './components/ProfilePage/ProfilePage';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ProjectsList from './components/ProjectsList/ProjectsList';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Login />
            <ProfilePage />


     </div>
  );
}

export default App;
