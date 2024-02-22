import ModifyExpense from "../components/ModifyExpense.js";
import "../styles/Transactions.css"
import "../styles/FilterExpense.css"
import "../styles/ModifyExpense.css"
import "../styles/NotificationPanel.css"
import { useEffect, useState } from "react";
import FilterExpense from "../components/FilterExpense.js";
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import MonthlyBudgetModal from "./MonthlyBudgetModal.js";
import {
    RotateCcw,
    Pencil,
    Delete,
    ArrowBigRight,
    ArrowBigLeft
  } from "lucide-react";

import PopupModal from "./PopupModal.js";


export default function Transactions({ userId }) {

    const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }

    

    const masterContent = {
        "budgetExceededError": {
          "head": "Error",
          "body": "Budget goal has been reached for this month"
      },
      "ninetyError": {
        "head": "Error",
        "body": "Budget goal has been  90% reached for this month"
      },
      "delete": {
        "head": "Error",
        "body": "Successfully deleted!"
      },
      "deleteError": {
        "head": "Error",
        "body": "Could not delete expense!"
      } 


  }

  const [content, setContent] = useState(masterContent["budgetExceededError"]);
    const tableHead = ["Date", "Category", "Merchant", "Amount", "Payment Mode", "Modify"];
    

    const itemCount = 10;
    const [pageCounter, setPageCounter] = useState(1);

    const [sortButtonState, setSortButtonState] = useState({
        "Date": false,
        "Category": false,
        "Merchant": false,
        "Amount": false,
        "Payment Mode": false
    });
    const [masterExpenses, setMasterExpenses] = useState([
    ]);

    const[dummyRowLength, setDummyRowLength] = useState(0);

    const getDummyRows = () => {
        var rows = [];
        for(var i = 0; i < dummyRowLength; i++)
        {
            var row = [];
            for(var j = 0; j < 6; j++)
            {
                row.push("");
            }
            rows.push(row);
        }
        return rows;
    }

    const [expenses, setExpenses] = useState([]);
    

    const totalPages = () => 
    {
        return Math.max(Math.ceil(expenses.length/itemCount), 1);
    }

    const gotoFirstPage = () => {
        setPageCounter(prevState=> 1);
    }
    const gotoLastPage= () => {
        setPageCounter(prevState => totalPages());
    }
    
    const increasePageCounter = () => {
        var total = totalPages();
        setPageCounter(prevState => Math.min(total, prevState+1) );
    }
    const decreasePageCounter = () => {
        setPageCounter(prevState => Math.max(1, prevState-1) );
    }

    const [show, setShow] = useState(false);
    const [showFilter, setShowFilter] = useState(false);



    useEffect(() => {
        
        setExpenses(masterExpenses);
    }, []);

    useEffect(()=> {
        if(pageCounter > totalPages())
        {
            setPageCounter(pageCounter => Math.min(totalPages(), pageCounter));
        }
        setDummyRowLength(itemCount-expenses.length%itemCount);
    }, [expenses]);


    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/expenses/${userId}`);
                
                // const response = await axios.get(`http://localhost:3000/expenses/3`);/'
                var newArray = [];
                for(var index in response.data)
                {
                    var row = response.data[index];
                    //
                    row.date = row.date.slice(0, 10);
                    newArray.push([row.expenseId, row.userId,
                        row.date, row.category, row.merchant, 
                        row.amount, row.paymentMode]);
                }
                setMasterExpenses(newArray);
                setExpenses(newArray);
                const emailId = response.data.email   

                if (response.data.remaining_budget <= response.data.monthly_budget *   0.1) {
                    const currentMonth = new Date().getMonth();
                    const lastMonthNineReachedEmailSent = localStorage.getItem('lastMonthNineReachedEmailSent');
                    if (lastMonthNineReachedEmailSent !== currentMonth.toString()) {
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-goal-ninereached`, { email: emailId  });
                    if (response)
                    {
                        setContent(masterContent["ninetyError"]);
                        setPopupState(true);
                        // Store the current month in local storage to prevent sending the email again
                        localStorage.setItem('lastMonthNineReachedEmailSent', currentMonth.toString());
                    }
                  }
                }
            
                  // Check if the user has exceeded their monthly budget
                  if (response.data.remaining_budget <=   0) {
                    const currentMonth = new Date().getMonth();
                    const lastMonthEmailSent = localStorage.getItem('lastMonthEmailSent');
                    if (lastMonthEmailSent !== currentMonth.toString()){
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-exceeded`, { email: emailId  });
                    if (response)
                    {
                        setContent(masterContent["budgetExceededError"]);
                        setPopupState(true);
                        localStorage.setItem('lastMonthEmailSent', currentMonth.toString());
                    }
                  }
                }


            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        
        fetchExpenses();
    }, [userId]);

    

    const [sendExpense, setSendExpense] = useState([]);

    const modifyAddExpense = (newExpense) => {
        var newMasterExpense = [newExpense, ...masterExpenses];
        setMasterExpenses(newMasterExpense);
        setExpenses(newMasterExpense);
    };

    const modifyEditExpense = (index, newExpense) => {
        setExpenses(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newExpense;
            return newArray;
        });
    }

    const modifyDeleteExpense = (index) => {
        axios.delete('http://localhost:3000/expenses/deleteExpense', {
            data: {
            expense_id: index,
            user_id: localStorage.getItem("userId")
        }}).
        then((response) => {
            setContent(masterContent["delete"]);
            setPopupState(true);
            setExpenses(prevArray => {
                const newArray = [...prevArray];
                newArray.splice(index,   1);
                return newArray;
            });
            
        }).catch((error) => {
            setContent(masterContent["deleteError"]);
            setPopupState(true);
        });
        
    }

    const modifyFilterExpense = (filterData) => {
        setExpenses(filterData);
    }

    const resetFilter = () => {
        setExpenses(masterExpenses);
    }



    const handleEditExpense = (index) => {
        
        index = index+(pageCounter-1)*itemCount;
        setShow(true);
        setSendExpense([index, ...expenses[index]]);
    }

    const handleDeleteExpense = (index) => {

        modifyDeleteExpense(index);
    }

    function sortByColumn(arr, columnIndex) {
        return arr.sort((a, b) => {
            const aValue = columnIndex ===   5 ? parseFloat(a[columnIndex]) : a[columnIndex];
            const bValue = columnIndex ===   5 ? parseFloat(b[columnIndex]) : b[columnIndex];

            if (aValue < bValue) {
                return -1;
            }
            if (aValue > bValue) {
                return   1;
            }
            return   0;
        });
    }

    function sortByColumnReverse(arr, columnIndex) {
        return arr.sort((a, b) => {
            const aValue = columnIndex ===   5 ? parseFloat(a[columnIndex]) : a[columnIndex];
            const bValue = columnIndex ===   5 ? parseFloat(b[columnIndex]) : b[columnIndex];

            if (aValue > bValue) {
                return -1;
            }
            if (aValue < bValue) {
                return -1;
            }
            return   0;
        });
    }

    const sortTableBy = (value) => {
        const indexValueMap = {
            "Date":   2,
            "Category":   3,
            "Merchant":   4,
            "Amount":   5,
            "Payment Mode":   6
        };
        if (!indexValueMap[value]) {
            return;
        }
        var newArray = expenses;
        if (!sortButtonState[value]) {
            newArray = sortByColumn(newArray, indexValueMap[value]);
            setSortButtonState({ ...sortButtonState, [value]: true });
        } else {
            newArray = sortByColumnReverse(newArray, indexValueMap[value]);
            setSortButtonState({ ...sortButtonState, [value]: false });
        }

        if (newArray !== expenses) {
            setExpenses(newArray);
        }
    }
     return (
        <div id = "transaction-div">
            <PopupModal state={popupState} setState={handlePopupState} content={content}/>
            <div id = "expense-table">
                        <div id= "expense-table-options">
                            <ModifyExpense onAddExpense={modifyAddExpense} onEditExpense={modifyEditExpense} 
                            loadExpense={sendExpense} show={show} setShow={setShow}/>
                            <FilterExpense onFilterExpense={modifyFilterExpense} 
                            expenseData={expenses} showFilter={showFilter} setShowFilter={setShowFilter}/>
                            <button className="expense-table-button expense-table-options-button" 
                            id = "reset-filter-button" onClick={resetFilter}><RotateCcw/></button>
                            <MonthlyBudgetModal/>
                        </div>
                        <table>
                        <tbody>
                            <tr>
                                <th className="expense-table-index">#</th>
                                {
                                    tableHead.map((head, index) => (
                                        <>
                                            
                                            <th className = "expense-table-th expense-table-th-td" key = {index} onClick={()=>{sortTableBy(head)}}>
                                                {head}
                                            </th>
                                        </>
                                        
                                        )
                                    )
                                }
                            </tr>
                            
                            {
                                expenses.slice((pageCounter-1)*itemCount, pageCounter*itemCount).map((row, index) => {
                                    row = row.slice(2);
                                return (
                                    <tr key={index} >
                                        <td className="expense-table-index expense-table-th-td">{index+1+(pageCounter-1)*itemCount}</td>
                                        {
                                            row.map((value, cellIndex) => {
                                            return (
                                            <td className="expense-table-th-td" key={cellIndex}>{value}</td>
                                        )})
                                        }
                                        <td className="expense-table-th-td expense-table-edit-delete">
                                            <button className="expense-table-button" onClick={() => handleEditExpense(index)}><Pencil/></button>
                                            <button className="expense-table-button" onClick={() => handleDeleteExpense(index)}><Delete/></button>
                                        </td>
                                    </tr>
                                        );
                                })
                        }
                        {
                            pageCounter === totalPages() && pageCounter !== 1 && getDummyRows().map((row, index) => {
                                return (
                                    <tr key = {(itemCount-dummyRowLength)+index}>
                                        <td className="expense-table-index expense-table-th-td" key={0} >{""}</td>
                                        {
                                            row.map((value, cellIndex) => {
                                                return (
                                                    <td className="expense-table-th-td" key={cellIndex+1}>{value}</td>
                                                )
                                                
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                        
                        
                        </tbody>
                        
                        </table>
                        {expenses.length > 10 &&    <div id="page-selector">
                                            {pageCounter !== 1 && <button className="expense-table-button expense-table-selector-button" onClick={gotoFirstPage}>1</button>}
                                            <button className="expense-table-button expense-table-selector-button" style={{"fontSize":"14px"}} onClick={decreasePageCounter}>{"<"}</button>
                                            <button className="expense-table-button expense-table-selector-button" style={{"text-decoration": "underline"}}>{pageCounter}</button>
                                            <button className="expense-table-button expense-table-selector-button" style={{"fontSize":"14px"}} onClick={increasePageCounter}>{">"}</button>
                                            {pageCounter !== totalPages() && <button className="expense-table-button expense-table-selector-button" onClick={gotoLastPage}>{totalPages()}</button>}
                                        </div>}  
                    </div>
    </div>
  );
}