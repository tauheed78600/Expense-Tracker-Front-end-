// ForgotPassword.js
import React, { useState } from 'react';
import * as Components from './Components';
import axios from 'axios'; // Import Axios
import PopupModal from './components/PopupModal';
import SpinnerComponent from './components/SpinnerComponent';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
    const [popupState, setPopupState] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePopupState = (state) => {
        setPopupState(state);
    }
    const masterContent = {
      "success":  {
          "head": "Success",
          "body": "Check your E-mail for verification Link"
      },
    "error": {
      "head": "Error",
      "body": "Could not send E-mail"
    },
    "notValidEmail": {
      "head": "Error",
      "body": "Not a valid E-mail"
    }
  }

  const [content,setContent] = useState(masterContent["error"]);

  function validEmail(value) {
    var re = /\S+@\S+\.\S+/;
    if(re.test(value))
    {
      return true;  
    }
    else
    {
      return false
    }
  }

  const checkEmail = (value) => {
    var element = document.getElementById("forgot-password-email");
    setEmail(value);
    if(validEmail(value))
    {
      element.innerHTML = ""; 
    }
    else
    {
      element.innerHTML = "Not a valid E-Mail!";
    }
  }


  // Function to handle the form submission
  const handleSubmit = async (event) => {

    event.preventDefault();
    if(!validEmail(email))
    {
      setContent(masterContent["notValidEmail"]);
      setPopupState(true);
    }
    else
    {
      try {
        setLoading(true);
          // const response = await axios.post(`http://localhost:3000/total/forgotPassword/?email=${encodeURIComponent(email)}`);
          const response = await axios.post(
              'http://localhost:3000/total/forgotPassword',
              { email },
              { headers: { 'Content-Type': 'application/json' } }
          );
          if (response)
          {
              setContent(masterContent["success"])
              setPopupState(true);
              setLoading(false);
          }
      } catch (error) {
        setContent(masterContent["error"])
        setPopupState(true);
        setLoading(false);
      }
    }
};

  return (
    <>
    <SpinnerComponent state={loading} setState={setLoading}/>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
    <Components.Form onSubmit={(e)=>{handleSubmit(e)}}>
      <Components.Title>Forgot Password</Components.Title>
      <Components.Input
        placeholder='Enter your E-mail address'
        value={email}
        onChange={(e) => checkEmail(e.target.value)}
      />
      <label id="forgot-password-email"></label>
      <Components.Button type='submit'>Send Link</Components.Button>
    </Components.Form>
    </>
    
  );
};

export default ForgotPassword;
