// Auth.js
import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import * as Components from './Components';

const Auth = ({ setCurrentPage, setUserId }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleLoginSuccess = (responseData) => {
    if (!responseData || !responseData.userId) {
      console.error('Login response data is missing userId:', responseData);
      return;
    }
    console.log('Login successful, responseData:', responseData);
    const userId = responseData.userId;
    console.log('Login successful, userId:', userId);
    localStorage.setItem('userId', userId);
    setUserId(userId); // Set userId in the state
  };

  return (
    <Components.Container>
      {isSignUp ? (
        <>
          <Components.SignUpContainer>
            <SignUpForm toggleForm={toggleForm} />
          </Components.SignUpContainer>
          <Components.OverlayContainer>
            <Components.Overlay />
            <Components.OverlayPanel>
              <Components.Title>Already have an account?</Components.Title>
              <Components.Button onClick={toggleForm}>Sign In</Components.Button>
            </Components.OverlayPanel>
          </Components.OverlayContainer>
        </>
      ) : (
        <>
          <Components.SignInContainer>
            <SignInForm toggleForm={toggleForm} setCurrentPage={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
          </Components.SignInContainer>
          <Components.OverlayContainer>
            <Components.Overlay />
            <Components.OverlayPanel>
              <Components.Title>Don't have an account?</Components.Title>
              <Components.Button onClick={toggleForm}>Sign Up</Components.Button>
            </Components.OverlayPanel>
          </Components.OverlayContainer>
        </>
      )}
    </Components.Container>
  );
};

export default Auth;
