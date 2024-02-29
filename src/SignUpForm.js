import React, { useState, useRef, useEffect } from 'react';
import * as Components from './Components';
import axios from 'axios';
import SpinnerComponent from './components/SpinnerComponent';
import ReCAPTCHA from "react-google-recaptcha";
import PopupModal from './components/PopupModal';
import "./styles/SignUpForm.css";

const SignUpForm = () => {
  const [username, setUsername] = useState(''); // Changed from name to username
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(''); 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [monthlyBudgetError, setMonthlyBudgetError] = useState('');
  const [loading, setLoading] = useState(false);
  const captchaRef = useRef(null);
  const timerId = useRef(null);

  const masterContent = {
    "signupError": {
      "head":"Error",
      "body":"Could not sign up!"
    },
    "signupSuccess": {
      "head":"Success",
      "body":"New account created!"
    },
    "captchaError": {
      "head":"Error",
      "body":"Please verify CAPTCHA!"
    },
    "detailError": {
      "head":"Error",
      "body":"Please fill the required fields correctly!"
    },
    "serverError": {
      "head":"Error",
      "body":"Could not reach server!"
    }
  }

  const [popupState, setPopupState] = useState(false);
  const [content, setContent] = useState(masterContent["signupError"]);
  const handlePopupState = (state) => {
    setPopupState(state);
}

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

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      isValid = false;
  } else if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase character');
      isValid = false;
  } else if (!/[!@#\$%\^&\*_]/.test(password)) {
      setPasswordError('Password must contain at least one special character');
      isValid = false;
  }
  else if (!/\d/.test(password)) {
    setPasswordError('Password must contain at least one number');
    isValid = false;
}
   else {
      setPasswordError('');
      isValid = true;
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

  useEffect(() => {
    if (content.head === "Success") {
        timerId.current = setTimeout(() => {
            setPopupState(false);
            window.location.reload();
        }, 3000);
    }

    return () => {
        //Clearing a timeout
        clearTimeout(timerId.current);
    };
}, [content]);

  const handleSubmit = async (event) => {
    const token = captchaRef.current.getValue();
    event.preventDefault();

    if (validateForm()) {
      if(!token)
      {
          setContent(masterContent["captchaError"]);
          setPopupState(true);
      }
      else
      {
      try {
        setLoading(true);
        // var monthlyBudget = 0
        
        const response = await axios.post('http://localhost:3000/total/register/', {
          email,
          password,
          monthlyBudget,
          username 
        });
        console.log(response);
        if(response.status === 201)
        {
          setLoading(false);
          setContent(masterContent["signupSuccess"]);
          setPopupState(true);
          // Handle successful signup (e.g., clear form, show success message)
        console.log(response.data);
        setUsername(''); // Changed from setName to setUsername
        setEmail('');
        setPassword('');
        setMonthlyBudget(''); // Clear monthly budget as well
        }
        else {
          setLoading(false);
          setContent(masterContent["signupError"]);
          setPopupState(true);
        }
        
        
        
      } catch (error) {
        setLoading(false);
        // Handle errors (e.g., show error message)
        setContent(masterContent["serverError"]);
        setPopupState(true);
        setLoading(false);
      }
    }}
    else
    {
      setContent(masterContent["detailError"]);
      setPopupState(true);
    }
    captchaRef.current.reset();
  };

  return (
    <>
    <SpinnerComponent state={loading} setState={setLoading}/>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
    <Components.Form onSubmit={handleSubmit}>
      <Components.Title id = "signup-title" style={{"marginLeft":"0px"}}>Create Account</Components.Title>
      <Components.Input
      id='signup-input'
        type='text'
        placeholder='Username'
        value={username} // Changed from name to username
        onChange={(e) => setUsername(e.target.value)} // Changed from setName to setUsername
      />
      {usernameError && <p style={{ color: 'red' }}>{usernameError}</p>}
      <Components.Input
      id='signup-input'
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <Components.Input
      id='signup-input'
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      <Components.Input
      id='signup-input'
        type='number'
        placeholder='Monthly Budget'
        value={monthlyBudget}
        onChange={(e) => setMonthlyBudget(e.target.value)}
        style={{"marginBottom":"20px"}}
      />
      {monthlyBudgetError && <p style={{ color: 'red' }}>{monthlyBudgetError}</p>}
      <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_KEY} ref={captchaRef}/>
      <Components.Button id="button-signup"type='submit'>Sign Up</Components.Button>
    </Components.Form>
    </>
    
  );
};

export default SignUpForm;

