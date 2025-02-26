import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

// COMPONENTS
import NavBar from './components/NavBar/NavBar';
import AnimatedRoutes from './AnimatedRoutes';

import Context from './components/Context';

// APIs
import BaseAPI from './api/BaseAPI';
import UsersAPI from './api/UsersAPI';

import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkMediaQuery.matches ? 'dark' : 'light');

    const systemThemeChange = e => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    darkMediaQuery.addEventListener('change', systemThemeChange);

    return () => darkMediaQuery.removeEventListener('change', systemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
  };

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
        <Context.Provider value={{ currentUser, setCurrentUser, theme, toggleTheme }}>
          <NavBar logout={logout} />
            <AnimatedRoutes 
              currentUser={currentUser}
              signupUser={signupUser}
              loginUser={loginUser}
              editUserProfile={editUserProfile}
            />
          </Context.Provider>
      </BrowserRouter>
    </div>
  )
}

export default App;
