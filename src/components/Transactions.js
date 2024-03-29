import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Transactions.css'; 
import 'material-icons/iconfont/material-icons.css';


const Transactions = ({ userId }) => {
const [userData, setUserData] = useState({});

useEffect(() => {
const fetchData = async () => {
    try {
    const response = await axios.get(`http://localhost:3000/total/getUser/${userId}`);
    console.log("response.data in getUsers", response.data)
    setUserData(response.data);
    } catch (error) {
    console.error('Error fetching user data:', error);
    }
};

fetchData();
}, [userId]);

const updateField = () => {
// TODO Implement the logic to update the user data
console.log('Update field function called');
};

return (
<div className="container">
    <h1>User Dashboard</h1>
    <div className="section" id="name-section">
    <label htmlFor="name">UserName:</label>
    <div id="name" className="info">{userData.user_name || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">insert_emoticon</span>
    </div>
    <div className="section" id="budget-section">
    <label htmlFor="monthly_budget">Monthly Budget:</label>
    <div id="monthly_budget" className="info">{userData.monthly_budget || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">add_shopping_cart</span>
    </div>
    <div className="section" id="username-section">
    <label htmlFor="user_name">Remaining Budget:</label>
    <div id="user_name" className="info">{userData.remaining_budget || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">accessibility</span>
    </div>
    <div className="section" id="email-section">
    <label htmlFor="email">Email:</label>
    <div id="email" className="info">{userData.email || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">mail</span>
    </div>
    <div className="update-section">
    <label htmlFor="update_option">Select section to update:</label>
    <select id="update_option">
        <option value="name">Name</option>
        <option value="monthly_budget">Monthly Budget</option>
        <option value="user_name">User Name</option>
        <option value="email">Email</option>
    </select>
    <button className="update-btn" onClick={updateField}>Update</button>
    </div>
</div>
);
};

export default Transactions;
