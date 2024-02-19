// App.js
import React, { useState } from 'react';
import Auth from './Auth';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transaction';
import Analytics from './components/Analytics';
import Logout from './components/Logout';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Import PrivateRoute
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userId, setUserId] = useState(null);

  console.log('App component currentPage:', currentPage);

  // Call this function after the user logs in
  const handleLoginSuccess = (responseData) => {
    if (!responseData || !responseData.accessToken || !responseData.userId) {
      console.error('Login response data is missing accessToken or userId:', responseData);
      return;
    }
    console.log('Login successful, responseData:', responseData);
    const userId = responseData.userId;
    console.log('Login successful, userId:', userId);
    setUserId(userId); // Set userId in the state
  };

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} setUserId={setUserId} />} />
        <Route path="/dashboard" element={
          <PrivateRoute userId={userId}>
            <Navbar setCurrentPage={setCurrentPage} />
            <main className="grow">
              {/* <Dashboard userId={userId} /> */}
              {currentPage === 'dashboard' && <Dashboard userId={userId} /> }
              {currentPage === 'transaction' && <Transactions />}
              {currentPage === 'analytics' && <Analytics />}
              {currentPage === 'logout' && <Logout />}
            </main>
          </PrivateRoute>
        } />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
