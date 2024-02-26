import React, { useState } from 'react';
import * as Components from './Components';
import axios from 'axios';

const SignUpForm = () => {
  const [username, setUsername] = useState(''); // Changed from name to username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(''); 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [monthlyBudgetError, setMonthlyBudgetError] = useState('');

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Function to validate email, password, and monthly budget
  const validateForm = () => {
    let isValid = true;

    if (!username || username.trim().length ===  0) { // Changed from name to username
      setUsernameError('Username is required'); // Changed from setNameError to setUsernameError
      isValid = false;
    } else {
      setUsernameError(''); // Changed from setNameError to setUsernameError
    }

    if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length <  8) {
      setPasswordError('Password must be at least  8 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate monthly budget (if required)
    if (!monthlyBudget || parseInt(monthlyBudget,  10) <=  0) {
      setMonthlyBudgetError('Monthly budget is required and must be greater than  0');
      isValid = false;
    } else {
      setMonthlyBudgetError('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validateForm()) {
      try {
        // var monthlyBudget = 0
        
        const response = await axios.post('http://localhost:3000/total/register/', {
          email,
          password,
          monthlyBudget,
          username 
        });

        
        // Handle successful signup (e.g., clear form, show success message)
        console.log(response.data);
        setUsername(''); // Changed from setName to setUsername
        setEmail('');
        setPassword('');
        setMonthlyBudget(''); // Clear monthly budget as well
      } catch (error) {
        // Handle errors (e.g., show error message)
        console.error(error);
      }
    }
  };

  return (
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title>Create Account</Components.Title>
      <Components.Input
        type='text'
        placeholder='Username'
        value={username} // Changed from name to username
        onChange={(e) => setUsername(e.target.value)} // Changed from setName to setUsername
      />
      {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
      <Components.Input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <Components.Input
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <Components.Input
        type='number'
        placeholder='Monthly Budget'
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
      />
      {monthlyBudgetError && <p style={{ color: 'red' }}>{monthlyBudgetError}</p>}
      <Components.Button type='submit'>Sign Up</Components.Button>
    </Components.Form>
  );
};

export default SignUpForm;

