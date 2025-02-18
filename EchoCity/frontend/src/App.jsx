import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, data } from 'react-router-dom'

// COMPONENTS
import Home from './components/Home/Home';
import NavBar from './components/NavBar/NavBar';
import FormTemplate from './components/Forms/FormTemplate';
import EventList from './components/EventList/EventList';
import ArtistPage from './components/ArtistPage/ArtistPage';
import Profile from './components/Profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Context from './components/Context';

// APIs
import TicketMasterAPI from './api/ticketmasterAPI';
import BaseAPI from './api/BaseAPI';
import UsersAPI from './api/UsersAPI';

import { loginFields, signupFields } from './components/Forms/fields';
import getDomainName from '../helpers/getDomainName';
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onAuthSuccess = (user, token) => {
    BaseAPI.token = token;
    setCurrentUser(user);
  };

  const signupUser = async (data) => {
    try{
      // UsersAPI.signup returns { user, token } objects
      const { user, token } = await UsersAPI.signup(data);
      onAuthSuccess(user, token);
    } catch(err){
      console.error("Error signing up:", err)
    }
  }

  const loginUser = async (data) => {
    try{
      const { user, token } = await UsersAPI.login(data);
      onAuthSuccess(user, token);
    } catch(err){
      console.error("Login error:", err)
    }
  };

  const editUserProfile = async(data) => {
    try{
      const updatedUser = await UsersAPI.editUserProfile(currentUser.id, data);
      setCurrentUser(updatedUser);
    } catch(err){
      console.error("Profile Edit error", err)
    };
  };

  useEffect(() => {
    const authenticateUser = async () => {
      const authRes = await UsersAPI.authenticate();
      if(authRes?.token){
        const { user, token } = authRes;
        onAuthSuccess(user, token);
      };
  
      setIsLoading(false);
    };

    authenticateUser();
  }, []);

  const logout = async () => {
    await UsersAPI.logout();
    BaseAPI.token = null;
    setCurrentUser(null);
  };

  if(isLoading){
    return <div>Loading...</div>
  }

  return (
    <div className='App'>
      <BrowserRouter>
      <Context.Provider value={{ currentUser, setCurrentUser }}>
        <NavBar logout={logout} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route 
              path='/events' 
              element={<ProtectedRoute element={<EventList getDomainName={getDomainName} />} />}
            />
            <Route path='/signup' element={<FormTemplate fields={signupFields} title='Sign Up to Echocity!' buttonText='Sign up' type='signup' onSubmitHandler={signupUser} />} />
            <Route path='/login' element={<FormTemplate fields={loginFields} title='Login to Echocity!' buttonText='Log In' type='login' onSubmitHandler={loginUser} />} />
            <Route path='/users/:username/edit' element={<FormTemplate fields={signupFields} title={`Profile Update`} buttonText='Save' type='profileEdit' onSubmitHandler={editUserProfile} />} />
            <Route path='/users/:id' element={<Profile />} />
            <Route path='/artists/:id' element={<ArtistPage getDomainName={getDomainName} />} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
    </div>
  )
}

export default App;
