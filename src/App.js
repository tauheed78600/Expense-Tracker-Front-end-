// App.js
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Analytics from './components/Analytics';
import ReportGenerate from './components/ReportGenerate';
import Navbar from './components/Navbar';
import axios from 'axios'; // Import axios for making API calls
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [expenses, setExpenses] = useState([]); // Add state for expenses

  useEffect(() => {
    // Check for accessToken in localStorage
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem("userId")
    if (accessToken) {
      setIsAuthenticated(true);
      // Fetch expenses for the authenticated user
      const fetchExpenses = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/expenses/${userId}`);
          console.log("response in report", response.data)
          setExpenses(response.data);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      };
      fetchExpenses();
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]); // Re-run the effect when isAuthenticated changes

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
    localStorage.setItem('accessToken', responseData.accessToken); // Store accessToken in localStorage
  };

  return (
    <Router>
      <Routes>
        
        <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} setUserId={setUserId} />} />
        <Route path="/dashboard" element={
          localStorage.getItem('accessToken') ? (
            <div className="app-container">
              <Navbar setCurrentPage={setCurrentPage} />
              <main className="grow">
                {currentPage === 'dashboard' && <Dashboard userId={localStorage.getItem("userId")} expenses={expenses} setExpenses={setExpenses} /> }
                {currentPage === 'transactions' && <Transactions userId={localStorage.getItem("userId")} />}
                {currentPage === 'analytics' && <Analytics userId={localStorage.getItem("userId")} />}
                {currentPage === 'reportgenerate' && <ReportGenerate expenses={expenses}/>}
                {/* {currentPage === 'report-generate' && <ReportGenerate expenses={expenses} />} */}
              </main>
            </div>
          ) : (
            <Navigate to="/auth" /> // Redirect to /auth if not authenticated
          )
        } />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
