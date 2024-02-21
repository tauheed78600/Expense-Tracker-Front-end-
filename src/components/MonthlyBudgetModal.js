import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

function MonthlyBudgetModal() {
  const [show, setShow] = useState(false);
  const [budget, setBudget] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Set Budget
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="formBudget">
                <Form.Label column sm={2}>
                    Current Budget
                </Form.Label>
                <Form.Label column sm={2}>
                    Remaining Budget
                </Form.Label>
                <Col sm={10}>
                <Form.Control name = "monthlyBudget" placeholder="" value={budget}/>
                </Col>
                <Form.Label id = "monthly-budget-error" column sm={2}>
                </Form.Label>
            </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MonthlyBudgetModal;