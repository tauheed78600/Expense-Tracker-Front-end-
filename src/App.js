// App.js
import React, { useState } from 'react';
import * as Components from './Components';
import Auth from './Auth';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transaction';
import Analytics from './components/Analytics';
import Logout from './components/Logout';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userId, setUserId] = useState(null);

  // Call this function after the user logs in
  const handleLoginSuccess = (userId) => {
    console.log('Login successful, userId:', userId);
    setUserId(userId);
  };


  return (  
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard" element={
          <>
            <Navbar setCurrentPage={setCurrentPage} />
            <main className="grow">
              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'transaction' && <Transactions />}
              {currentPage === 'analytics' && <Analytics />}
              {currentPage === 'logout' && <Logout />}
            </main>
          </>
        } />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
