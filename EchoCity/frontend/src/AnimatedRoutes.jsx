import { Routes, Route, useLocation } from 'react-router-dom';
import FadeInWrapper from './components/z_helpers/FadeInWrapper/FadeInWrapper';

// COMPONENTS
import Home from './components/Home/Home';
import FormTemplate from './components/Forms/FormTemplate';
import EventList from './components/Events/EventList/EventList';
import EventDetails from './components/Events/EventDetails/EventDetails';
import ArtistPage from './components/Artists/ArtistPage/ArtistPage';
import Profile from './components/Users/Profile/Profile';
import FavoriteArtists from './components/Users/FavoriteArtists/FavoriteArtists';
import MyConcerts from './components/Users/MyConcerts/MyConcerts';
import WelcomePage from './components/Home/WelcomePage';
import ProtectedRoute from './components/ProtectedRoute';

import { loginFields, signupFields } from './components/Forms/fields';
import getDomainName from '../helpers/getDomainName';

const AnimatedRoutes = ({ currentUser, isLoading, isSubmitting, signupUser, loginUser, editUserProfile} ) => {
  const location = useLocation();

  return (
    <FadeInWrapper key={location.pathname}>
      <Routes location={location}>
        <Route 
            path='/' 
            element={currentUser ? <ProtectedRoute element={<Home />} /> : <WelcomePage />} 
          />
        <Route 
          path='/concerts' 
          element={<ProtectedRoute element={<EventList getDomainName={getDomainName} />} />}
        />
        <Route 
          path='/concerts/:id' 
          element={<ProtectedRoute element={<EventDetails getDomainName={getDomainName} />} />}
        />
        <Route 
          path='/signup' 
          element={
            <FormTemplate 
              fields={signupFields} 
              title='Sign Up to Echocity' 
              buttonText='Sign up' 
              type='signup' 
              onSubmitHandler={signupUser}
              isSubmitting={isSubmitting}
            />}
          />
        <Route 
          path='/login' 
          element={
              <FormTemplate 
                fields={loginFields} 
                title='Login to Echocity' 
                buttonText='Log In' 
                type='login' 
                onSubmitHandler={loginUser}
                isSubmitting={isSubmitting}
            />} 
          />
        <Route 
          path='/profile/edit' 
            element={
              <ProtectedRoute 
                element={
                  <FormTemplate 
                    fields={signupFields} 
                    title={`Profile Update`} 
                    buttonText='Save' 
                    type='profileEdit' 
                    onSubmitHandler={editUserProfile} 
                  />}
              />}
          />
        <Route 
          path='/users/:id' 
          element={<Profile />} 
        />
        <Route 
          path='/artists/:id' 
          element={<ArtistPage getDomainName={getDomainName} />}
        />
        <Route 
          path='/my-artists' 
          element={<FavoriteArtists getDomainName={getDomainName} />} 
        />
        <Route 
          path='/my-concerts' 
          element={<MyConcerts getDomainName={getDomainName} />} 
          />
      </Routes>
    </FadeInWrapper>
  );
};

export default AnimatedRoutes;
