import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    // await axios.post(`http://localhost:3000/total/login/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`).
console.log("accessToken in dashboardModal", cookies.get("access_token"))
console.log("newUsername", newUsername, "newEmail", newEmail)
const updateUserEndpointURL = `http://localhost:3000/total/updateUser/?token=${encodeURIComponent(cookies.get('access_token'))}&username=${encodeURIComponent(newUsername)}&email=${encodeURIComponent(newEmail)}`;

try {
 const response = await axios.post(updateUserEndpointURL, {}, {
    headers: {
      Authorization: `Bearer ${cookies.get('access_token')}`,
    },
 });
   
       if (response.data) {
         setUserData(response.data);
         setShow(false);
         setUpdateSuccess(true);
         window.location.reload()
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
  useEffect(()=>{},[userData]);

  return (
    <>
    <Modal backdrop="static" keyboard={false} show={show} onHide={handleClose} animation={false} centered>
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
