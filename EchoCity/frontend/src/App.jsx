import { useEffect, useState } from 'react';
import NavBar from './components/NavBar/NavBar';
import AnimatedRoutes from './AnimatedRoutes';
import Context from './components/Context';
import BaseAPI from './api/BaseAPI';
import UsersAPI from './api/UsersAPI';
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const initialTheme = darkMediaQuery.matches ? 'dark' : 'light';
    setTheme(initialTheme);
    document.body.classList.toggle('dark', initialTheme === 'dark');

    const systemThemeChange = e => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.body.classList.toggle('dark', newTheme === 'dark');
    };
    darkMediaQuery.addEventListener('change', systemThemeChange);

    return () => darkMediaQuery.removeEventListener('change', systemThemeChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      document.body.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  };

  const onAuthSuccess = (user, token) => {
    BaseAPI.token = token;
    setCurrentUser(user);
  };

  const signupUser = async (data) => {
    try{
      setIsSubmitting(true);
      // UsersAPI.signup returns { user, token } objects
      const { user, token } = await UsersAPI.signup(data);
      onAuthSuccess(user, token);
    } catch(err){
      console.error("Error signing up:", err)
    } finally{
      setIsSubmitting(false);
    }
  }

  const loginUser = async (data) => {
    try{
      setIsSubmitting(true);
      const { user, token } = await UsersAPI.login(data);
      onAuthSuccess(user, token);
    } catch(err){
      console.error("Login error:", err)
    } finally{
      setIsSubmitting(false);
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

  return (
    <div className={`App ${theme}`} data-testid="app-container">
      <Context.Provider value={{ currentUser, setCurrentUser, theme, toggleTheme }}>
        <NavBar logout={logout} isLoading={isLoading}/>
          <AnimatedRoutes 
            currentUser={currentUser}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            signupUser={signupUser}
            loginUser={loginUser}
            editUserProfile={editUserProfile}
          />
        </Context.Provider>
    </div>
  )
}

export default App;
