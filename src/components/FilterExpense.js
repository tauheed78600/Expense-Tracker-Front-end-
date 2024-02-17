import "../styles/FilterExpense.css";
import { useState } from "react";
import { currentDate } from "./currentDate";
export default function FilterExpense({ onFilterExpense, expenseData }) {
    const [filterState, setFilterState] = useState(false);
    const [filterData, setFilterData] = useState({
        dateFrom: "",
        dateTo: "",
        category: "",
        merchant: "",
        amount: "",
        payment_mode_filter: ""
    })
    const resetFilterData = () => {
        setFilterData({
            dateFrom: "",
            dateTo: "",
            category: "",
            merchant: "",
            amount: "",
            payment_mode_filter: ""
        });
    }
    const setDateLimitFrom = () => {
        if(filterData.dateTo !== "")
            document.getElementById("modify-filter-date-from").max = filterData.dateTo;
        else
            document.getElementById("modify-filter-date-from").max = currentDate();
    }
    const setDateLimitTo = () => {
        if(filterData.dateFrom !== "")
            document.getElementById("modify-filter-date-to").min = filterData.dateFrom;
        document.getElementById("modify-filter-date-to").max = currentDate();
    }
    
    const closeFilterExpense = () => {
        setFilterState(false);
        resetFilterData();
        var divExpense = document.getElementById("div-filter-expense");
        if(divExpense.style.visibility === 'hidden' || divExpense.style.visibility === "")
        {
            divExpense.style.visibility = 'visible';
        }
        else
        {
            divExpense.style.visibility = "hidden";
        }
    }

    const handleFilterChange = (name, value) => {
        setFilterState(true);
        setFilterData({...filterData, [name]: value})
    }

    const filterDateFrom = (arr, from) => {
        return arr.filter((row)=>row[2] >= from);
    }
    const filterDateTo = (arr, to) => {
        return arr.filter((row)=>row[2] <= to);
    }
    function filterByString(s, value) {
        return s.toLowerCase().includes(value.toLowerCase());
    }
    const filterString = (arr, index, value) => {
        return arr.filter((row) => filterByString(row[index], value));
    }
    function filterByNumber(s, value) {
        s = parseFloat(s);
        value = parseFloat(value);
        return s === value;
    }
    const filterNumber = (arr, index, value) => {
        
        return arr.filter((row) => filterByNumber(row[index], value));
    }
    const filterPayment = (arr, mode) => {
        return arr.filter((row)=>row[6] === mode)
    }


    const handleFilterSubmit = (e) => {
        e.preventDefault();
        var newArray = expenseData;
        if(!filterState)
        {
            alert("Choose Filter option");
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
        if(filterData.category)
        {
            newArray = filterString(newArray, 3, filterData.category);
        }
        if(filterData.merchant)
        {
            newArray = filterString(newArray, 4, filterData.merchant);
        }
        if(filterData.amount)
        {
            newArray = filterNumber(newArray, 5, filterData.amount);
        }
        if(filterData.payment_mode_filter)
        {
            newArray = filterPayment(newArray, filterData.payment_mode_filter);
        }
        onFilterExpense(newArray);
    }

    return (
        <>
            <button id = "close-button-filter" onClick={closeFilterExpense}>Close</button>
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

                </form>
        </>
        
    )
}