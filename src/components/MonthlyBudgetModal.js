import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import PopupModal from './PopupModal';

function MonthlyBudgetModal() {
  const [show, setShow] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:3000/total/${userId}`);
            if(response.data.monthly_budget !== undefined)
                setCurrentBudget(response.data.monthly_budget);
            else
                setCurrentBudget(0);
            if(response.data.remaining_budget !== undefined)
                setRemainingBudget(response.data.remaining_budget);
            else
                setRemainingBudget(0);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    fetchUserData();
}, [show]);

  const [newBudget, setNewBudget ] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleBudgetChange = (e) => {
    setNewBudget(e.target.value);
  }

  const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }

    

    const masterContent = {
      "updateSuccess": {
          "head": "Success",
          "body": "Budget updated successfully!",
        },
        "error": {
          "head": "Error",
          "body": "Could not update budget!"
      },

  }

  const [content, setContent] = useState(masterContent["error"]);



  const handleSave = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.put(`http://localhost:3000/expenses/budget-goal?monthly_budget=${newBudget}&userId=${userId}`);
            if (response.status===200)
            {
                setContent(masterContent["updateSuccess"]);
                setPopupState(true);
                console.log("Budget goal set successfully:", response.data);
            }
            // Update the displayed budget goal state
            setCurrentBudget(newBudget);
            setRemainingBudget(newBudget-currentBudget+remainingBudget);
        } catch (error) {
          setContent(masterContent["updateSuccess"]);
          setPopupState(true);
          console.error('Error setting budget goal:', error);
        }
      };

  

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Set Budget
      </Button>
      <PopupModal state={popupState} setState={handlePopupState} content={content}/>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formBudget">
                <Form.Label column sm={4}>
                    Current Budget: {currentBudget}
                </Form.Label>
                
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBudget">
            <Form.Label column sm={4}>
                    Remaining Budget: {remainingBudget}
                </Form.Label>
                
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formBudgetInput">
                <Col sm={10}>
                <Form.Control name = "monthlyBudget" placeholder="" value={newBudget} onChange={(e)=>{handleBudgetChange(e)}}/>
                </Col>
                <Form.Label id = "monthly-budget-error" column sm={2}>
                </Form.Label>
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button style={{"backgroundColor":"#e26f6f"}} variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button style={{"backgroundColor":"#e26f6f"}} variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MonthlyBudgetModal;