// Auth.js
import React, { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import * as Components from './Components';

const Auth = ({ setCurrentPage, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
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
            <SignInForm toggleForm={toggleForm} setCurrentPage={setCurrentPage} onLoginSuccess={onLoginSuccess} />
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
