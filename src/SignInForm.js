// SignInForm.js
import React, { useContext, useState } from 'react';
import * as Components from './Components';
import axios from 'axios';
import ForgotPasswordModal from './modals/forgotPasswordModal';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';
 
const SignInForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  
 
  const validateForm = () => {
    let isValid = true;
 
    if (username.trim().length === 0) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }
 
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }
 
    return isValid;
  };
 
  const validateEmail = () => {
    let isValid = true;
 
    if (!email.includes('@')) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
 
    return isValid;
  };

  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    if (validateForm()) {
      try {
        // Append email and password as query parameters to the URL
        const response = await axios.post(`http://localhost:3000/total/login/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        login();
        console.log('Login API response:', response.data);
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem("userId", response.data.userId)
        console.log(response)
        const userId = response.data.userId;
        console.log("response.data.userId",response.data.userId);
        onLoginSuccess(response.data); 
        navigate('/dashboard');
      } catch (error) {
        // Handle errors (e.g., show error message)
        console.error(error);
      }
    }
  };
 
  const handleForgotPasswordSubmit = async () => {
    if (validateEmail()) {
      try {
const response = await axios.post('http://localhost:3000/total/forgotPassword/', {
          email,
        });
        console.log(response.data);
        setShowForgotPasswordModal(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
 
  const toggleForgotPasswordModal = () => {
    navigate("/forgotPassword")
    setShowForgotPasswordModal(!showForgotPasswordModal);
  };
 
  return (
    <>
      <Components.Form onSubmit={handleSubmit}>
        <Components.Title1>Sign In</Components.Title1>
        <Components.Input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
        <Components.Input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <Components.Button type='submit'>Sign In</Components.Button>
        {/* <Components.Button type='button' onClick={toggleForgotPasswordModal}>
          Forgot your password?
        </Components.Button> */}
      </Components.Form>
      {/* Render the Forgot Password modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={toggleForgotPasswordModal}
        onSubmit={handleForgotPasswordSubmit}
      >
        <Components.Input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        <Components.Button onClick={handleForgotPasswordSubmit}>Send Reset Link</Components.Button>
      </ForgotPasswordModal>
    </>
  );
};
 
export default SignInForm;