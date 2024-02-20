import "../styles/ModifyExpense.css";
import { useState, useEffect, fetchData } from "react";
import axios from "axios";
import { currentDate } from "./currentDate";

export function closeModifyExpense() {
    document.getElementById("div-modify-expense").style.visibility = "hidden";
}

export default function ModifyExpense({ onAddExpense, onEditExpense, loadExpense })
{
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

    
    const handleModifyExpenseChange = (name, value) => {
        setModifyExpenseData({...modifyExpenseData, [name] : value});
    }

    // const sendAddExpenseRequest = () => {
        
    //     return axios.post(apiURL, formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     })
    //     .then((response) => {
    //       alert("Expense Modified Successfully!");
    //     })
    //     .catch((error) => {
    //       alert(error.message);
    //     });
    //   };
      
    const handleModifyExpense = (e) => {
        e.preventDefault();
        const formData = new FormData();
        var apiURL = "";
        var updateRow = [];
        const userId = localStorage.getItem("userId")
        if(loadExpense.length === 0)
        {

            apiURL = "http://localhost:3000/expenses/addExpense";
           
            

           const expenseData = {
                // Assuming you want to set the expenseId to  1
                userId:  userId, // Assuming you want to set the userId to  1
                date: modifyExpenseData.date,
                category: modifyExpenseData.category,
                merchant: modifyExpenseData.merchant,
                amount: modifyExpenseData.amount,
                paymentMode: modifyExpenseData.payment_mode
            };
            axios.post(apiURL, expenseData, ).then((response) => {
                alert("Expense Added Successfully!");
                updateRow = [modifyExpenseData.userId, modifyExpenseData.expenseId, 
                    modifyExpenseData.date, modifyExpenseData.category, modifyExpenseData.merchant, 
                    modifyExpenseData.amount, modifyExpenseData.payment_mode]
                console.log("updateRow", updateRow)
                onAddExpense(updateRow);
                console.log(response)
                // Assuming onAddExpense is a function to update the UI
                onAddExpense(response.data);
            }).catch((error) => {
                alert(error.message);
            });
            
        }
        else
        {

            apiURL = "http://localhost:3000/expenses/updateExpense";

            const expenseData = {
            // Assuming you want to set the expenseId to  1
                userId:  userId, // Assuming you want to set the userId to  1
                date: modifyExpenseData.date,
                category: modifyExpenseData.category,
                merchant: modifyExpenseData.merchant,
                amount: modifyExpenseData.amount,
                paymentMode: modifyExpenseData.payment_mode
            };
            axios.put(apiURL, expenseData,).then((response) => {
                alert("Expense Updated Successfully!");
                updateRow = [modifyExpenseData.userId, modifyExpenseData.expenseId, 
                    modifyExpenseData.date, modifyExpenseData.category, modifyExpenseData.merchant, 
                    modifyExpenseData.amount, modifyExpenseData.payment_mode]
                onEditExpense(modifyExpenseData.index, updateRow);
                // Assuming onEditExpense is a function to update the UI
                onEditExpense(modifyExpenseData.index, response.data);
            }).catch((error) => {
                alert(error.message);
            });
            
        }
        
    }

    return (
        <>
            <button id = "close-button-modify" onClick={closeModifyExpense}>Close</button>
            <form onSubmit={handleModifyExpense}>

                <label>Date</label>
                <input name = "date" id = "modify-expense-date" type ="date" 
                value={modifyExpenseData.date} onClick = {setDateLimit} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/><br/>
                <label id = "modify-expense-date-error"></label><br/>

                <label>Category</label>
                <input name = "category" value={modifyExpenseData.category} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/><br/>
                <label id = "modify-expense-category-error"></label><br/>

                <label>Merchant</label>
                <input name = "merchant" value={modifyExpenseData.merchant} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/><br/>
                <label id = "modify-expense-merchant-error"></label><br/>

                <label>Amount</label>
                <input name = "amount" value={modifyExpenseData.amount} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}}/><br/>
                <label id = "modify-expense-amount-error"></label><br/>

                <label>Payment Mode</label>
                <input type="radio" id="mode1" name="payment_mode" value="Credit" 
                checked={modifyExpenseData.payment_mode === 'Credit'} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}} />
                <label htmlFor="mode1">Credit</label>

                <input type="radio" id="mode2" name="payment_mode" value="Debit" 
                checked={modifyExpenseData.payment_mode === 'Debit'} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}} />
                <label htmlFor="mode2">Debit</label>

                <input type="radio" id="mode3" name="payment_mode" value="UPI" 
                checked={modifyExpenseData.payment_mode === 'UPI'} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}} />
                <label htmlFor="mode3">UPI</label>

                <input type="radio" id="mode4" name="payment_mode" value="Cash" 
                checked={modifyExpenseData.payment_mode === 'Cash'} 
                onChange={(e)=>{handleModifyExpenseChange(e.target.name, e.target.value)}} />
                <label id ="cash">Cash</label><br/>

                <label id = "modify-expense-payment-error"></label>
                <input type="submit"/>
            </form>
        </>
    )
}