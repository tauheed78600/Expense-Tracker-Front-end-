// ForgotPasswordModal.js
import React from 'react';

const ForgotPasswordModal = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    onSubmit(email);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
          <button type='submit'>Send Reset Link</button>
        </form>
        <button type='button' onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
