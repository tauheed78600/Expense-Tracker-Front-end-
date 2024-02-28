import "../styles/FilterExpense.css";

import { useEffect, useState } from "react";
import { currentDate } from "./currentDate";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import { getCategories } from "./categories";
import { Filter } from "lucide-react";
import PopupModal from "./PopupModal";
export default function FilterExpense({ onFilterExpense, expenseData, showFilter, setShowFilter }) {
    const masterContent = {
        "amountError":{
            "head": "Error",
            "body": "Amount is not a number!"
        },
        "filterError": {
            "head": "Error",
            "body": "Choose at least one filter option!"
        }

    }
    const [content, setContent] = useState(masterContent["filterError"]);
    const [filterState, setFilterState] = useState(false);
    var categories = getCategories();
    const [popupState, setPopupState] = useState(false);
    const [filterData, setFilterData] = useState({
        dateFrom: "",
        dateTo: "",
        category: "",
        merchant: "",
        amount: "",
        payment_mode_filter: ""
    })

    //reset the filter
    const resetFilterData = () => {
        set_Selected_categories([]);
        setFilterData({
            dateFrom: "",
            dateTo: "",
            category: "",
            merchant: "",
            amount: "",
            payment_mode_filter: ""
        });
    }

    //set date limit from on filter
    const setDateLimitFrom = () => {
        if(filterData.dateTo !== "")
            document.getElementById("modify-filter-date-from").max = filterData.dateTo;
        else
            document.getElementById("modify-filter-date-from").max = currentDate();
    }

    //set date limit to on filter
    const setDateLimitTo = () => {
        if(filterData.dateFrom !== "")
            document.getElementById("modify-filter-date-to").min = filterData.dateFrom;
        document.getElementById("modify-filter-date-to").max = currentDate();
    }

    
    //store filter data on input change
    const handleFilterChange = (name, value) => {
        var flag = false;
        if(value === "")
        {
            for(const val in filterData)
            {
                if(filterData[val] !== "")
                {
                    flag = true;
                    break;
                }
            }
        }
        if(flag || value !== "")
            setFilterState(true);
        else
            setFilterState(false);
        setFilterData({...filterData, [name]: value})
    }

    //filter date from. Takes array and date from as parameter.
    const filterDateFrom = (arr, from) => {
        return arr.filter((row)=>row.date >= from);
    }

    //filter date to. Takes array and date to as parameter.
    const filterDateTo = (arr, to) => {
        return arr.filter((row)=>row.date <= to);
    }

    //checks if string2 is presen in string1
    function filterByString(string1, string2) {
        return string1.toLowerCase().includes(string2.toLowerCase());
    }

    //filters array on basis of key and checks it against value
    const filterString = (arr, key, value) => {
        return arr.filter((row) => filterByString(row[key], value));
    }

    //checks if n and value are numerically equal
    function filterByNumber(n, value) {
        n = parseFloat(n);
        value = parseFloat(value);
        return n === value;
    }

    //filters array on basis of value of key being equal to value
    const filterNumber = (arr, key, value) => {
        
        return arr.filter((row) => filterByNumber(row[key], value));
    }

    //filters array on basis of payment mode
    const filterPayment = (arr, mode) => {
        return arr.filter((row)=>row.paymentMode === mode)
    }

    //handles submit request, validates filter inputs and sets expense data to filtered data
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        var newArray = expenseData;
        if(!filterState && selected_categories.length === 0)
        {
            setContent(masterContent["filterError"]);
            setPopupState(true);
            return;
        }
        if(filterData.amount !== "" && isNaN(filterData.amount))
        {
            setContent(masterContent["amountError"]);
            setPopupState(true);
            return;
        }
        if(filterData.dateFrom)
        {
            newArray = filterDateFrom(newArray, filterData.dateFrom);
        }
        if(filterData.dateTo)
        {
            newArray = filterDateTo(newArray, filterData.dateTo);
        }
        if(selected_categories.length > 0)
        {
            var copyArray = [];
            var temp = [];
            for(var i = 0; i < selected_categories.length; i++)
            {
                copyArray = filterString(newArray, "category", selected_categories[i]);
                temp = temp.concat(copyArray);
            }
            newArray = temp;
            
                
        }
        if(filterData.merchant)
        {
            newArray = filterString(newArray, "merchant", filterData.merchant);
        }
        if(filterData.amount)
        {
            newArray = filterNumber(newArray, "amount", filterData.amount);
        }
        if(filterData.payment_mode_filter)
        {
            newArray = filterPayment(newArray, filterData.payment_mode_filter);
        }
        onFilterExpense(newArray);
        setShowFilter(false);
        set_Selected_categories([]);
    }

    //on closing filter form
    const handleClose = () => {
        resetFilterData();
        setShowFilter(false);
    }
    const handleShow = () => setShowFilter(true);

    const handlePopupState = (state) => {
        setPopupState(state);
    }

    //stores multiple selected categories from dropdown category button
    const [selected_categories, set_Selected_categories] =  
        useState([]); 

        const toggleCat = (option) => { 
            if (selected_categories.includes(option)) { 
                set_Selected_categories( 
                    selected_categories.filter((item) =>  
                        item !== option)); 
            } else { 
                set_Selected_categories( 
                    [...selected_categories, option]); 
            } 
        }; 
    
    useEffect(()=>{
        if(!showFilter)
        {
            resetFilterData();
            set_Selected_categories([]);
        }
    }, [showFilter]);

        


    return (
        <>
            <PopupModal state={popupState} setState={handlePopupState} content={content}/>
            <Button variant="primary" onClick={handleShow}>
                <Filter/>
            </Button>

            <Modal show={showFilter} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Filter Expenses</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalDateFrom">
                        <Form.Label column sm={2}>
                        Date From
                        </Form.Label>
                        <Col sm={4}>
                        <Form.Control id = "modify-filter-date-from" name = "dateFrom" type="date" 
                        placeholder="" value={filterData.dateFrom} onClick={setDateLimitFrom}
                        onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/>
                        </Col>
                        
                        <Form.Label column sm={2}>
                        Date To
                        </Form.Label>
                        <Col sm={4}>
                        <Form.Control id= "modify-filter-date-to" name = "dateTo" type="date" 
                        placeholder="" value={filterData.dateTo} onClick={setDateLimitTo}
                        onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/>
                        </Col>
                        
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalDateTo">
                        <Form.Label id = "modify-expense-date-error" column sm={2}>
                        </Form.Label>
                        <Form.Label id = "modify-expense-date-error" column sm={2}>
                        </Form.Label>
                    </Form.Group>
                    
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalCategory">
                        <Form.Label column sm={2}>
                            Category
                        </Form.Label>
                        <Col sm={10}>
                            <Dropdown>
                                <Dropdown.Toggle style={{"backgroundColor":"#e26f6f"}} variant="success" id="dropdown-basic">
                                    Choose Category
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: '150px', overflowY: 'auto' }}> 
                                {categories.map((cat, index) => ( 
                                        <Form.Check
                                        key={index}
                                        type="checkbox"
                                        label={cat}
                                        checked={selected_categories.includes(cat)}
                                        onClick={()=>toggleCat(cat)
                                        }
                                        />
                                    ))} 
                                </Dropdown.Menu> 

                                {/*<Dropdown.Menu style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {
                                        categories.map((cat, index) => {
                                            return (
                                                <Dropdown.Item name = "category" value={cat} key = {index} 
                                                onClick={(e)=>{handleFilterChange(e.target.name, cat)}}>
                                                    {cat}</Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>*/}
                            </Dropdown>
                        </Col>
                        <Form.Label id = "modify-expense-category-error" column sm={2}>
                        </Form.Label>
                    </Form.Group>


                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalMerchant">
                        <Form.Label column sm={2}>
                        Merchant
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control name = "merchant" placeholder="" value={filterData.merchant} 
                        onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/>
                        </Col>
                        <Form.Label id = "modify-expense-merchant-error" column sm={2}>
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formHorizontalAmount">
                        <Form.Label column sm={2}>
                        Amount
                        </Form.Label>
                        <Col sm={10}>
                        <Form.Control name = "amount" placeholder="" value={filterData.amount} 
                        onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/>
                        </Col>
                        <Form.Label id = "modify-expense-amount-error" column sm={2}>
                        </Form.Label>
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
                            checked={filterData.payment_mode === 'Credit'} 
                            onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode1"
                            />
                            <Form.Check
                            type="radio"
                            label="Debit"
                            value="Debit"
                            checked={filterData.payment_mode === 'Debit'} 
                            onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode2"
                            />
                            <Form.Check
                            type="radio"
                            label="UPI"
                            value="UPI"
                            checked={filterData.payment_mode === 'UPI'} 
                            onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode3"
                            />
                            <Form.Check
                            type="radio"
                            label="Cash"
                            value="Cash"
                            checked={filterData.payment_mode === 'Cash'} 
                            onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}
                            name="payment_mode"
                            id="mode4"
                            />
                        </Col>
                        </Form.Group>
                    </fieldset>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button style={{"backgroundColor":"#e26f6f"}} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button style={{"backgroundColor":"#e26f6f"}} variant="primary" onClick={handleFilterSubmit}>
                    Submit
                </Button>
                </Modal.Footer>
            </Modal>
            {/*<button id = "close-button-filter" onClick={closeFilterExpense}>Close</button>
                <form>
                    <label>Filter Options</label><br/>
                    <label>From</label>
                    <input name = "dateFrom" id = "modify-filter-date-from" type ="date" 
                    value={filterData.dateFrom} onClick = {setDateLimitFrom} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/><br/>
                    <label id = "modify-filter-date-from-error"></label><br/>

                    <label>To</label>
                    <input name = "dateTo" id = "modify-filter-date-to" type ="date" 
                    value={filterData.dateTo} onClick = {setDateLimitTo} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/><br/>
                    <label id = "modify-filter-date-from-error"></label><br/>

                    <label>Category</label>
                    <input name = "category" value={filterData.category} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/><br/>
                    <label id = "modify-expense-category-error"></label><br/>

                    <label>Merchant</label>
                    <input name = "merchant" value={filterData.merchant} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/><br/>
                    <label id = "modify-expense-merchant-error"></label><br/>

                    <label>Amount</label>
                    <input name = "amount" value={filterData.amount} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}}/><br/>
                    <label id = "modify-expense-amount-error"></label><br/>

                    <label>Payment Mode</label>
                    <input type="radio" className="filter-mode" name="payment_mode_filter" value="Credit" 
                    checked={filterData.payment_mode_filter === 'Credit'} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}} />
                    <label id="filter-mode1">Credit</label>

                    <input type="radio" className="filter-mode" name="payment_mode_filter" value="Debit" 
                    checked={filterData.payment_mode_filter === 'Debit'} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}} />
                    <label id="filter-mode2">Debit</label>

                    <input type="radio" className="filter-mode" name="payment_mode_filter" value="UPI" 
                    checked={filterData.payment_mode_filter === 'UPI'} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}} />
                    <label id="filter-mode3">UPI</label>

                    <input type="radio" className="filter-mode" name="payment_mode_filter" value="Cash" 
                    checked={filterData.payment_mode_filter === 'Cash'} 
                    onChange={(e)=>{handleFilterChange(e.target.name, e.target.value)}} />
                    <label id="filter-mode4">Cash</label><br/>

                    <label id = "modify-filter-payment-error"></label>

                    <input type = "submit" onClick = {handleFilterSubmit}/>

    </form>*/}
        </>
        
    )
}