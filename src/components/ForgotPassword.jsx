import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }

    const content = {
        "head": "Error",
        "body": "Check your Email for verification Link"
    };

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
                
                setPopupState(true);

            }
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Error sending reset link. Please try again.');
        }
    };

    return (
        <>
        <PopupModal state={popupState} setState={handlePopupState} content={content}/>
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
        </>
        
    );
};

export default ForgotPassword;
