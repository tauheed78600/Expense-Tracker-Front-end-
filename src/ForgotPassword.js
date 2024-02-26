// ForgotPassword.js
import React, { useState } from 'react';
import * as Components from './Components';
import axios from 'axios'; // Import Axios
import PopupModal from './components/PopupModal';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }
    const masterContent = {
      "success":  {
          "head": "Success",
          "body": "Check your Email for verification Link"
      },
    "error": {
      "head": "Error",
      "body": "Could not send email"
    }}

  const [content,setContent] = useState(masterContent["error"]);


  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
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

        }
    } catch (error) {
      setContent(masterContent["error"])
      setPopupState(true);
    }
};

  return (
    <>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
    <Components.Form onSubmit={(e)=>{handleSubmit(e)}}>
      <Components.Title>Forgot Password</Components.Title>
      <Components.Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Components.Button type='submit'>Send Link</Components.Button>
    </Components.Form>
    </>
    
  );
};

export default ForgotPassword;
