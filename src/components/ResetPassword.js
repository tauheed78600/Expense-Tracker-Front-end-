// ForgotPassword.js
import React, { useState } from 'react';
import * as Components from '../Components';
import axios from 'axios'; // Import Axios
import { useLocation } from 'react-router-dom';
import PopupModal from './PopupModal';

const ResetPassword = () => {
    console.log(useLocation());
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
  const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }
    const masterContent = {
        "resetSuccess":  {
            "head": "Success",
            "body": "Password reset successfully"
        },
      "resetError": {
        "head": "Error",
        "body": "Could not change password"
      }}

    const [content,setContent] = useState(masterContent["resetError"]);

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // const response = await axios.post(`http://localhost:3000/total/forgotPassword/?email=${encodeURIComponent(email)}`);
        const response = await axios.post(
            'http://localhost:3000/total/resetPassword',
            { 
                "token": token,
                "password": newPassword
             },
            { headers: { 'Content-Type': 'application/json'
         } }
        );
        if (response)
        {
            setContent(masterContent["resetSuccess"])
            setPopupState(true);

        }
    } catch (error) {
        setContent(masterContent["resetError"])
        setPopupState(true);
    }
};

  return (
    <>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
    <Components.Form onSubmit={(e)=>{handleSubmit(e)}}>
      <Components.Title>Reset Password</Components.Title>
      <Components.Input
        type='password'
        placeholder='Enter new password'
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Components.Input
        type='password'
        placeholder='Confirm new password'
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
      />
      
      <Components.Button type='submit'>Send Link</Components.Button>
    </Components.Form>
    </>
    
  );
};

export default ResetPassword;
