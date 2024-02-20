import ModifyExpense from "../components/ModifyExpense.js";
import "../styles/Transactions.css"
import "../styles/FilterExpense.css"
import "../styles/ModifyExpense.css"
import "../styles/NotificationPanel.css"
import { useEffect, useState } from "react";
import FilterExpense from "../components/FilterExpense.js";
import axios from 'axios';

export default function Transactions({ userId }) {
    console.log('DashBoard component rendered with userId:', userId); 
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

    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(0);
    const [remainingExpense, setRemainingExpense] = useState(0);
    const [budgetGoal, setBudgetGoal] = useState(0);
    const [displayedBudgetGoal, setDisplayedBudgetGoal] = useState(0); 

    const totalPages = () => 
    {
        return Math.round(expenses.length/itemCount);
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

    const handleSetBudgetGoal = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/expenses/budget-goal?monthly_budget=${budgetGoal}&userId=${userId}`);
            if (response.data)
            {
                alert("Budget Goal set successfully!!")
                console.log("Budget goal set successfully:", response.data);
            }
            // Update the displayed budget goal state
            setBudget(budgetGoal);
        } catch (error) {
          console.error('Error setting budget goal:', error);
        }
      };

    useEffect(() => {
        setExpenses(masterExpenses);
    }, []);


    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/expenses/${userId}`);
                // const response = await axios.get(`http://localhost:3000/expenses/3`);/'
                var newArray = [];
                console.log(response.data[0]);
                for(var index in response.data)
                {
                    var row = response.data[index];
                    //
                    row.date = row.date.slice(0, 10);
                    newArray.push([row.expenseId, row.userId,
                        row.date, row.category, row.merchant, 
                        row.amount, row.paymentMode]);
                }
                
                console.log('Expenses fetched:', newArray);
                setMasterExpenses(newArray);
                setExpenses(newArray);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };
        
        fetchExpenses();
    }, [userId])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/total/${userId}`);
                console.log("response data in monthly budget", response.data)
                setBudget(response.data.monthly_budget);
                setRemainingExpense(response.data.remaining_budget);
                localStorage.setItem("userId", response.data.userId);
                const emailId = response.data.email
                console.log("email id after response",emailId)

                if (response.data.remaining_budget <= response.data.monthly_budget *   0.1) {
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-goal-ninereached`, { email: emailId  });
                    if (response)
                    {
                        console.log("response: " , response.data)
                    alert("Budget goal has been reached for this month")
                    }
                  }
            
                  // Check if the user has exceeded their monthly budget
                  if (response.data.remaining_budget <=   0) {
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-exceeded`, { email: emailId  });
                    if (response)
                    {
                        console.log("response: " , response.data)
                        alert("Budget goal has been reached for this month")
                    }
                  }


            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const [sendExpense, setSendExpense] = useState([]);

    const modifyAddExpense = (newExpense) => {
        var newMasterExpense = [newExpense, ...masterExpenses];
        setMasterExpenses(newMasterExpense)
        setExpenses(newMasterExpense);
        setRemainingExpense(prevRemaining => prevRemaining - parseFloat(newExpense[5]));
    };

    const modifyEditExpense = (index, newExpense) => {
        setExpenses(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newExpense;
            return newArray;
        });
    }

    const modifyDeleteExpense = (index) => {
        setExpenses(prevArray => {
            const newArray = [...prevArray];
            newArray.splice(index,   1);
            return newArray;
        });
        var divExpense = document.getElementById("div-modify-expense");
        if (divExpense.style.visibility === 'visible' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'hidden';
        }
    }

    const modifyFilterExpense = (filterData) => {
        setExpenses(filterData);
    }

    const resetFilter = () => {
        console.log(masterExpenses)
        setExpenses(masterExpenses);
    }

    const handleFilterExpense = () => {
        var divExpense = document.getElementById("div-filter-expense");
        if (divExpense.style.visibility === 'hidden' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'visible';
        } else {
            divExpense.style.visibility = "hidden";
        }
    }


    const handleEditExpense = (index) => {
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
            <div id="div-modify-expense">
                
            </div>
            <div id="div-filter-expense">
                
            </div>

            <div id = "budget-options" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>Monthly Budget: {budget}</div>
                <div>
                <input
                    type="number"
                    value={budgetGoal}
                    onChange={(e) => setBudgetGoal(e.target.value)}
                    placeholder="Set Budget Goal"
                />
                <button onClick={handleSetBudgetGoal}>Set Budget Goal</button>
                </div>
                <div>Remaining Budget: {remainingExpense}</div>
            </div>

            <div id = "expense-table">
                        <div id= "expense-table-options">
                            <ModifyExpense onAddExpense={modifyAddExpense} onEditExpense={modifyEditExpense} loadExpense={sendExpense} show={show} setShow={setShow}/>
                            <FilterExpense onFilterExpense={modifyFilterExpense} expenseData={expenses} showFilter={showFilter} setShowFilter={setShowFilter}/>
                            <button className="expense-table-button expense-table-options-button" id = "reset-filter-button" onClick={resetFilter}>Reset Filter</button>
                        </div>
                        <table>
                        <tbody>
                            <tr>
                                <th className="expense-table-th expense-table-th-td expense-table-index">#</th>
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
                                        <td className="expense-table-th-td">
                                            <button className="expense-table-button" onClick={() => handleEditExpense(index)}>Edit</button>
                                            <button className="expense-table-button" onClick={() => handleDeleteExpense(index)}>Delete</button>
                                        </td>
                                    </tr>
                                        );
                                })
                        }
                        <div id="expense-table-page-selector">
                            <button className="expense-table-button expense-table-selector-button" onClick={gotoFirstPage}>{"<<"}</button>
                            <button className="expense-table-button expense-table-selector-button" onClick={decreasePageCounter}>{"<"}</button>
                            <button className="expense-table-button expense-table-selector-button" onClick={increasePageCounter}>{">"}</button>
                            <button className="expense-table-button expense-table-selector-button" onClick={gotoLastPage}>{">>"}</button>
                        </div>
                        
                        </tbody>
                        </table>
                    </div>
    </div>
  );
}