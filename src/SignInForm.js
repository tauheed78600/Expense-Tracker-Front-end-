// SignInForm.js
import React, { useContext, useState } from 'react';
import * as Components from './Components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { AuthContext } from './AuthContext';
import SpinnerComponent from './components/SpinnerComponent';
import PopupModal from './components/PopupModal';
 
const SignInForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const masterContent = {
    "loginError": {
      "head":"Error",
      "body":"Invalid login credentials"
    }
  }
  const [popupState, setPopupState] = useState(false);
  const [content, setContent] = useState(masterContent["loginError"]);
  const handlePopupState = (state) => {
    setPopupState(state);
}

  
 
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
        setLoading(true);
        // Append email and password as query parameters to the URL
        await axios.post(`http://localhost:3000/total/login/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`).
        then((response)=>{
          login();
          console.log('Login API response:', response.data);
          localStorage.setItem('accessToken', response.data.accessToken)
          console.log(response)
          const userId = response.data.userId;
          console.log("response.data.userId",response.data.userId);
          setLoading(false);
          onLoginSuccess(response.data); 
          navigate('/dashboard');
        }).
        catch((error)=>{
          console.log(error);
          setContent(masterContent["loginError"]);
          setPopupState(true);
          setLoading(false);
        });
        
      } catch (error) {
        // Handle errors (e.g., show error message)
        console.log(error);
      }
    }
  };
 
 
  const toggleForgotPasswordModal = () => {
    navigate("/forgotPassword")
  };
 
  return (
    <>
    <SpinnerComponent state={loading} setState={setLoading}/>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
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
        <Components.Button type='submit' style={{"width":"240px"}}>Sign In</Components.Button>
        <Components.Button type='button' onClick={toggleForgotPasswordModal}
        style={{"width":"240px","paddingLeft":"0px", "paddingRight":"0px"}}>
          Forgot your password?
        </Components.Button>
      </Components.Form>
    </>
  );
};
 
export default SignInForm;