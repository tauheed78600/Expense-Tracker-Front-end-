// ForgotPassword.js
import React, { useState } from 'react';
import * as Components from './Components';
import axios from 'axios'; // Import Axios

const ForgotPassword = () => {
  const [email, setEmail] = useState(''); // State to hold the email

  // Function to handle the form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Perform the POST request with Axios
    try {
      const response = await axios.post('http://your-backend-url/forgot-password', {
        email,
      });

      // Handle successful password reset request (e.g., show success message)
      console.log(response.data);
      setEmail(''); // Clear the email input field
    } catch (error) {
      // Handle errors (e.g., show error message)
      console.error(error);
    }
  };

  return (
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title>Forgot Password</Components.Title>
      <Components.Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Components.Button type='submit'>Send Link</Components.Button>
    </Components.Form>
  );
};

export default ForgotPassword;
