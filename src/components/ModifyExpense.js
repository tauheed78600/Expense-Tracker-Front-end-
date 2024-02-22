import "../styles/ModifyExpense.css";
import { useState, useEffect, fetchData } from "react";
import axios from "axios";
import { currentDate } from "./currentDate";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getCategories } from "./categories";
import { Plus } from "lucide-react";
import PopupModal from "./PopupModal";
export default function ModifyExpense({ onAddExpense, onEditExpense, loadExpense, show, setShow})
{
    const errorMessage = {
        date: "modify-expense-date-error",
        category: "modify-expense-category-error",
        merchant: "modify-expense-merchant-error",
        amount:  "modify-expense-amount-error",
        payment_mode: "modify-expense-payment-error"
    };
    var categories = getCategories();
    const [popupState, setPopupState] = useState(false);
    const [modifyExpenseData, setModifyExpenseData] = useState(
        {
            index: "",
            userId: "",
            expenseId: "",
            date: "",
            category: "",
            merchant: "",
            amount:  "",
            payment_mode: ""
        }
    )
    useEffect(() => {
        if (loadExpense.length === 0)
        {
            setModifyExpenseData({
                index: "",
                userId: "",
                expenseId: "",
                date: "",
                category: "",
                merchant: "",
                amount: "",
                payment_mode: ""
            })
        }
        else if(loadExpense[0] !== modifyExpenseData.index
        ||loadExpense[3] !== modifyExpenseData.date
        ||loadExpense[4] !== modifyExpenseData.category
        ||loadExpense[5] !== modifyExpenseData.merchant
        ||loadExpense[6] !== modifyExpenseData.amount
        ||loadExpense[7] !== modifyExpenseData.payment_mode)
        {
            setModifyExpenseData({
                "index": loadExpense[0],
                "expenseId": loadExpense[1],
                "userId":loadExpense[2],
                "date": loadExpense[3],
                "category": loadExpense[4],
                "merchant": loadExpense[5],
                "amount": loadExpense[6],
                "payment_mode": loadExpense[7]
            })
        }
        /*if(loadExpense[0].split("-")[2].length != 2 )
            loadExpense[0] = swapDate(loadExpense[0]);*/
    }, [loadExpense]);
    const swapDate = (date) => {
        date = date.split("-");
        var temp = date[0];
        date[0] = date[2];
        date[2] = temp;
        date = date.join("-");
        return date
    }
    const setDateLimit = () => {
        document.getElementById("modify-expense-date").max = currentDate();
    }

    const resetData = () => {
        setModifyExpenseData(
            {
                index: "",
                userId: "",
                expenseId: "",
                date: "",
                category: "",
                merchant: "",
                amount:  "",
                payment_mode: ""
            }
        );
    }

    
    const handleModifyExpenseChange = (name, value) => {
        if(value === "")
        {
            document.getElementById(errorMessage[name]).innerHTML = name + " cannoty be empty!";
        }
        else
        {
            document.getElementById(errorMessage[name]).innerHTML = "";
        }
        setModifyExpenseData({...modifyExpenseData, [name] : value});
    }
    const handleModifyExpense = (e) => {
        e.preventDefault();
        var flag = true;
        const skipVal = {
            index: 1,
            userId: 1,
            expenseId: 1,
            date: 0,
            category: 0,
            merchant: 0,
            amount:  0,
            payment_mode: 0
        }
        for(const val in modifyExpenseData)
        {
            if(skipVal[val] === 0 && modifyExpenseData[val] === "")
            {
                flag = false;
            }
        }
        if(!flag)
        {
            setContent(masterContent["error"]);
            setPopupState(true);
            return;
        }
        if(modifyExpenseData.amount !== "" && isNaN(modifyExpenseData.amount))
        {
            setContent(masterContent["amountError"]);
            setPopupState(true);
            return;
        }
        var apiURL = "http://localhost:3000/expenses/addExpense";
        const userId = localStorage.getItem('userId');
        const expenseData = {
            // Assuming you want to set the expenseId to  1
            userId:  userId, // Assuming you want to set the userId to  1
            date: modifyExpenseData.date,
            category: modifyExpenseData.category,
            merchant: modifyExpenseData.merchant,
            amount: modifyExpenseData.amount,
            paymentMode: modifyExpenseData.payment_mode
        };
        var updateRow = [];
        if(loadExpense.length === 0)
        {
            axios.post(apiURL,expenseData, ).then((response) => {
                setContent(masterContent["add"]);
                setPopupState(true);
                updateRow = [modifyExpenseData.userId, response.data.expenseId,
                    modifyExpenseData.date, modifyExpenseData.category, modifyExpenseData.merchant,
                    modifyExpenseData.amount, modifyExpenseData.payment_mode]
                onAddExpense(updateRow);
                resetData();
                closeModifyExpense();
                
            }).catch((error) => {

                setContent(masterContent["budgetLimitExceeded"]);
                setPopupState(true);
            });
        }
        else
        {
            console.log("modifyExpenseData", modifyExpenseData.expenseId)
            apiURL = "http://localhost:3000/expenses/updateExpense";
            
            const expenseData = {
            // Assuming you want to set the expenseId to  1
                userId:  userId, // Assuming you want to set the userId to  1
                date: modifyExpenseData.date,
                category: modifyExpenseData.category,
                merchant: modifyExpenseData.merchant,
                amount: modifyExpenseData.amount,
                paymentMode: modifyExpenseData.payment_mode,
                expenseId: modifyExpenseData.expenseId
            };
            axios.put(apiURL, expenseData,).then((response) => {
                setContent(masterContent["update"]);
                setPopupState(true);
                updateRow = [userId, modifyExpenseData.expenseId,
                    modifyExpenseData.date, modifyExpenseData.category, modifyExpenseData.merchant,
                    modifyExpenseData.amount, modifyExpenseData.payment_mode]
                onEditExpense(modifyExpenseData.index, updateRow);
                closeModifyExpense();
                resetData();
                localStorage.removeItem('expenseId');

            }).catch((error) => {
                console.log("inside catch", error)
            });
        }
        
    }
    const handleClose = () => {
        resetData();
        setShow(false);}
    const handleShow = () => setShow(true);

    const closeModifyExpense = () => {
        handleClose();
    }

    const handlePopupState = (state) => {
        setPopupState(state);
    }

    const masterContent = {
        "add": {
            "head": "Success",
            "body": "Expense added successfully!"
        },
        "update":{
            "head": "Success",
            "body": "Expense updated successfully!"
        },
        "error": {
            "head": "Error",
            "body": "One or more fields empty!"
        },
        "amountError":{
            "head": "Error",
            "body": "Amount is not a number!"
        },
        "budgetLimitExceeded": {
            "head": "Error",
            "body": "Budget Limit Exceeded"
        }

    }

    const [content, setContent] = useState(masterContent["error"]);
    

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                <Plus/>
            </Button>
            <PopupModal state={popupState} setState={handlePopupState} content={content}/>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Expense Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalDate">
                        <Form.Label column sm={2}>
                        Date
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control id ="modify-expense-date" onClick={setDateLimit} name = "date" type="date" placeholder="" value={modifyExpenseData.date} 
                        onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/>
                        <Form.Label id = "modify-expense-date-error" column sm={12}>
                        </Form.Label>
                        </Col>
                        
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalCategory">
                        <Form.Label column sm={2}>
                            Category
                        </Form.Label>
                        <Col sm={10}>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {modifyExpenseData.category !== "" ? modifyExpenseData.category : "Choose Category"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {
                                        categories.map((cat, index) => {
                                            return (
                                                <Dropdown.Item name = "category" value={cat} key = {index} 
                                                onClick={(e)=>{handleModifyExpenseChange(e.target.name, cat)}}>
                                                    {cat}</Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                            <Form.Label id = "modify-expense-category-error" column sm={12}>
                        </Form.Label>
                        </Col>
                        
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalMerchant">
                        <Form.Label column sm={2}>
                        Merchant
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control name = "merchant" placeholder="" value={modifyExpenseData.merchant} 
                        onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/>
                        <Form.Label id = "modify-expense-merchant-error" column sm={12}>
                        </Form.Label>
                        </Col>
                        
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalAmount">
                        <Form.Label column sm={2}>
                        Amount
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control name = "amount" placeholder="" value={modifyExpenseData.amount} 
                        onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/>
                        <Form.Label id = "modify-expense-amount-error" column sm={12}>
                        </Form.Label>
                        </Col>
                        
                    </Form.Group>
                    <fieldset>
                        <Form.Group as={Row} className="mb-3">
                        <Form.Label as="legend" column sm={2}>
                            Payment Mode
                        </Form.Label>
                        <Col sm={10}>
                            <Form.Check
                            type="radio"
                            label="Credit"
                            value="Credit"
                            checked={modifyExpenseData.payment_mode === 'Credit'} 
                            onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode1"
                            />
                            <Form.Check
                            type="radio"
                            label="Debit"
                            value="Debit"
                            checked={modifyExpenseData.payment_mode === 'Debit'} 
                            onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode2"
                            />
                            <Form.Check
                            type="radio"
                            label="UPI"
                            value="UPI"
                            checked={modifyExpenseData.payment_mode === 'UPI'} 
                            onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode3"
                            />
                            <Form.Check
                            type="radio"
                            label="Cash"
                            value="Cash"
                            checked={modifyExpenseData.payment_mode === 'Cash'} 
                            onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode4"
                            />
                            <Form.Label id = "modify-expense-payment-error" column sm={12}>
                        </Form.Label>
                        </Col>
                        
                        </Form.Group>
                    </fieldset>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleModifyExpense}>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}