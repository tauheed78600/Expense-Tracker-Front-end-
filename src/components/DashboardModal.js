import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PopupModal from './PopupModal';

function DashboardModal({state, setState}) {
  const [show, setShow] = useState(false);
  const cookies = new Cookies();
  // const [userId, setUserId] = useState(cookies.get('userId'));
  const [userData, setUserData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [popupState, setPopupState] = useState('')
  const [content, setContent] = useState({})

  const masterContent = {
    "Username": {
        "head": "Success",
        "body": "Username Updated!"
    },
    "Email":{
        "head": "Success",
        "body": "Email Updated!"
    },
    "UsernameError": {
        "head": "Error",
        "body": "Username already exists"
    },
    "EmailError":{
        "head": "Error",
        "body": "Email address is not in valid format"
    },
    "budgetLimitExceeded": {
        "head": "Error",
        "body": "Budget Limit Exceeded"
    },
    "editError": {
        "head": "Error",
        "body": "Could not edit expense!"
    },
    "amountNegative": {
        "head": "Error",
        "body": "Amount cannot be negative"
    },
    "decimalError": {
        "head": "Error",
        "body": ""
    }
  }


  const handleClose = () =>{
    setState(false);
    setShow(false);
  } 
  // const handleShow = () => setShow(true);
const [newUsername, setNewUsername] = useState('');
const [newEmail, setNewEmail] = useState('');
const [errorMessage, setErrorMessage] = useState('');
const [email, setEmail] = useState('');
const [currentEmail, setCurrentEmail] = useState('');
const [currentUsername, setCurrentUsername] = useState('');


const accessToken = cookies.get("access_token")

useEffect(()=>{
  const getUserData = async() => {
    const response = await axios.get(`http://localhost:3000/total/getUser/${accessToken}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
      console.log(response)
    if(response !== undefined)
    {
      console.log(response)
      setNewUsername(response.data.user_name);
      setCurrentUsername(response.data.user_name)
      setCurrentEmail(response.data.email)
      setNewEmail(response.data.email)
      console.log(response.data.email)
    }
  }

  getUserData();
    
},[state])

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const handleUpdate = async () => {
    // await axios.post(`http://localhost:3000/total/login/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`).
      console.log("accessToken in dashboardModal", cookies.get("access_token"))
      console.log("newUsername", newUsername, "newEmail", newEmail)
      

if(newUsername !== currentUsername)
{
  const updateUserEndpointURL = `http://localhost:3000/total/updateUsername/?token=${encodeURIComponent(cookies.get('access_token'))}&username=${encodeURIComponent(newUsername)}`;
  console.log("inside first condition")
      try {
      const response = await axios.put(updateUserEndpointURL, {}, {
          headers: {
            Authorization: `Bearer ${cookies.get('access_token')}`,
          },
      });
      console.log("response in 1st condition", response.data)
   
       if (response.data) {
         setUserData(response.data);
         setShow(false);
         setUpdateSuccess(true);
         setContent(masterContent["Username"]);
         setPopupState(true)
         
       } else {
         console.error('Failed to update user data');
         setContent(masterContent["UsernameError"]);
         setPopupState(true)
       }
    } catch (error) {
       console.error('Error updating user data:', error);
       setErrorMessage('Failed to update user data.  Please try again.');
       setContent(masterContent["error"]);
       setPopupState(true)
    } 
   };

   if (emailRegex.test(newEmail) && newEmail !== currentEmail) {
    const updateUserEndpointURL = `http://localhost:3000/total/updateEmail/?token=${encodeURIComponent(cookies.get('access_token'))}&email=${encodeURIComponent(newEmail)}`;
    console.log("inside second condition")
        try {
        const response =  axios.put(updateUserEndpointURL, {}, {
            headers: {
              Authorization: `Bearer ${cookies.get('access_token')}`,
            },
        });
        console.log("response in 2nd condition", response.data)
     
         if (response.data) {
           setUserData(response.data);
           setShow(false);
           setUpdateSuccess(true);
           setContent(masterContent["Email"]);
            setPopupState(true)
         } else {
           console.error('Failed to update user data');
           setContent(masterContent["EmailError"]);
         setPopupState(true)
         }
      } catch (error) {
         console.error('Error updating user data:', error);
         setErrorMessage('Failed to update user data.  Please try again.');
         setContent(masterContent["error"]);
         setPopupState(true)
      } 
     };
      
  
  
     window.location.reload()
  
     {errorMessage && <p className="error-message">{errorMessage}</p>}
  
} 

const handlePopupState = (state) => {
  setPopupState(state);
}
  useEffect(()=>{
    setShow(state);
  }, [state]);
  useEffect(()=>{},[userData]);

  return (
    <>
    <Modal backdrop="static" keyboard={false} show={show} onHide={handleClose} animation={false} centered>
    <PopupModal state={popupState} setState={handlePopupState} content={content}/>
        <Modal.Header closeButton>
          <Modal.Title><h2>Update User Information</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">
              <Form.Label sm={4} htmlFor="username">Username:</Form.Label>
              <Col sm={8}>
                <Form.Control type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
              </Col>
            
            </Form.Group>
              
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalUsername">
              <Form.Label sm={4} htmlFor="email">Email:</Form.Label>
              <Col sm={8}>
                <Form.Control type="email" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </Col>
            </Form.Group>
          </Form>
          <div>
          
          
          </div>
          
          {updateSuccess && <p className="success-message">User information updated successfully!</p>}
        </Modal.Body>
        <Modal.Footer>
        
          <Button style={{"backgroundColor":"#e26f6f"}} variant="secondary" onClick={()=>{handleUpdate()}}>
          Update
          </Button>
          <Button style={{"backgroundColor":"#e26f6f"}} variant="secondary" onClick={handleClose}>
          Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}



export default DashboardModal;
