import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'universal-cookie';
import axios from 'axios';

function PopupModal({state, setState, content}) {
  const [show, setShow] = useState(false);
  const cookies = new Cookies();
  const [userId, setUserId] = useState(cookies.get('userId'));
  const [userData, setUserData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);



  const handleClose = () =>{
    setState(false);
    setShow(false);
  } 
  const handleShow = () => setShow(true);
  const [newUsername, setNewUsername] = useState('');
const [newEmail, setNewEmail] = useState('');
const [errorMessage, setErrorMessage] = useState('');
  const handleUpdate = async () => {
   
  const updateUserEndpoint = `http://localhost:3000/total/updateUser/${userId}`;
   
    try {
       const response = await axios.put(updateUserEndpoint, {
         username: newUsername,
         email: newEmail,
       }, {
         headers: {
           Authorization: `Bearer ${cookies.get('access_token')}`, // Use backticks for template literals
         },
       });
   
       if (response.data) {
         setUserData(response.data);
         setShow(false);
         setUpdateSuccess(true);
       } else {
         console.error('Failed to update user data');
       }
    } catch (error) {
       console.error('Error updating user data:', error);
       setErrorMessage('Failed to update user data.  Please try again.');
    } 
   };

   {errorMessage && <p className="error-message">{errorMessage}</p>}

  useEffect(()=>{
    setShow(state);
  }, [state]);

  return (
    <>
    <Modal backdrop="static" keyboard={false} show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title><h2>Update User Information</h2></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          </div>
          <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          {updateSuccess && <p className="success-message">User information updated successfully!</p>}
        </Modal.Body>
        <Modal.Footer>
        
          <Button style={{"backgroundColor":"#e26f6f"}} variant="secondary" onClick={handleUpdate}>
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



export default PopupModal;
