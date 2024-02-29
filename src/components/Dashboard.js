import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css'; 
import 'material-icons/iconfont/material-icons.css';
import Cookies from 'universal-cookie';


const Dashboard = ({ userId }) => {
  const cookies = new Cookies();

  const masterContent = {
    "fetchError":{
        "head": "Error",
        "body": "Could not fetch data"
    }

}
const [popupState, setPopupState] = useState(false);

const [content, setContent] = useState(masterContent["fetchError"]);
const [userData, setUserData] = useState({});
//load user data
useEffect(() => {
const accessToken = cookies.get('access_token');
const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/total/getUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const [popupState, setPopupState] = useState(false);
 const [content, setContent] = useState(masterContent["fetchError"]);
 const [userData, setUserData] = useState({});
 const [isLoading, setIsLoading] = useState(true); // Ensure this is defined if you're using it
 const [showUpdateModal, setShowUpdateModal] = useState(false); // State for showing the update modal
 const [newUsername, setNewUsername] = useState(''); // State for the new username
 const [newEmail, setNewEmail] = useState(''); // State for the new email


    console.log("response.data", response.data)
    console.log("userId in dashboard", userId)
    setUserData(response.data);
    } catch (error) {
    setContent(masterContent["fetchError"]);
    setPopupState(true);
    }
};

fetchData();
}, [userId]);

return ( 
<div className="container">
    <div className='h1'><h1 className="userDash" style={{ marginBottom: '10' }}>User Dashboard</h1></div>
    <div className="section" id="name-section">
    <label htmlFor="name">UserName:</label>
    <div id="name" className="info">{userData.user_name || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">accessibility</span>
    </div>
    <div className='h1'>
 <h1 className="userDash" style={{ marginBottom: '10' }}>User Dashboard</h1>
 <button className="edit-btn" onClick={() => setShowUpdateModal(true)}>Edit</button>
</div>
    <div className="section" id="budget-section">
    <label htmlFor="monthly_budget">Monthly Budget:</label>
    <div id="monthly_budget" className="info">{userData.monthly_budget || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">add_shopping_cart</span>
    </div>
    <div className="section" id="username-section">
    <label htmlFor="user_name">Remaining Budget:</label>
    <div id="user_name" className="info">{userData.remaining_budget || '0'}</div>
    <span className="material-icons-outlined text-green">add_shopping_cart</span>
    </div>
    <div className="section" id="email-section">
    <label htmlFor="email">Email:</label>
    <div id="email" className="info">{userData.email || 'Loading...'}</div>
    <span className="material-icons-outlined text-green">mail</span>
    </div>
</div>
) 
}
