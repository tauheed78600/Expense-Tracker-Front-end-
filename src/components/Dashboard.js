import ModifyExpense from "../components/ModifyExpense.js";
import "../styles/Dashboard.css"
import "../styles/FilterExpense.css"
import "../styles/ModifyExpense.css"
import "../styles/NotificationPanel.css"
import { useEffect, useState } from "react";
import FilterExpense from "../components/FilterExpense.js";
import axios from 'axios';

export default function DashBoard({ userId }) {
    console.log('DashBoard component rendered with userId:', userId); 
    const tableHead = ["Date", "Category", "Merchant", "Amount", "Payment Mode", "Modify"];
    const [sortButtonState, setSortButtonState] = useState({
        "Date": false,
        "Category": false,
        "Merchant": false,
        "Amount": false,
        "Payment Mode": false
    });
    const [masterExpenses, setMasterExpenses] = useState([
        ["1", "2", "2024-02-15", "Fuel", "HP", "150", "UPI"],
        ["3", "4", "2024-02-15", "Food", "KFC", "450", "Debit"],
        ["4", "5", "2024-01-11", "Shopping", "Myntra", "1500", "Cash"]
    ]);

    const [expenses, setExpenses] = useState([]);
    const [budget, setBudget] = useState(0);
    const [remainingExpense, setRemainingExpense] = useState(0);
    const [budgetGoal, setBudgetGoal] = useState(0);
    const [displayedBudgetGoal, setDisplayedBudgetGoal] = useState(0); 

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
                // const response = await axios.get(`http://localhost:3000/expenses/3`);/
                setExpenses(response.data);
                console.log('Expenses fetched:', response.data);
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
                localStorage.setItem("userId", response.data.userId)
                const emailId = response.data.email
                console.log(emailId)

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
        // Transform newExpense into an array if it's not already
        /*const transformedNewExpense = [
            newExpense.expenseId,
            newExpense.userId,
            newExpense.date,
            newExpense.category,
            newExpense.merchant,
            newExpense.amount,
            newExpense.paymentMode
        ];*/
        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
        console.log(expenses);
        console.log(remainingExpense);
        setRemainingExpense(prevRemaining => prevRemaining - parseFloat(newExpense[5]));
        var divExpense = document.getElementById("div-modify-expense");
        if (divExpense.style.visibility === 'visible' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'hidden';
        }
    };
    const modifyEditExpense = (index, newExpense) => {
        setExpenses(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newExpense;
            return newArray;
        });
        var divExpense = document.getElementById("div-modify-expense");
        if (divExpense.style.visibility === 'visible' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'hidden';
        }
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

    const handleAddExpense = () => {
        var divExpense = document.getElementById("div-modify-expense");
        setSendExpense([]);
        if (divExpense.style.visibility === 'hidden' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'visible';
        } else {
            divExpense.style.visibility = "hidden";
        }
    }

    const handleEditExpense = (index) => {
        var divExpense = document.getElementById("div-modify-expense");
        setSendExpense([index, ...expenses[index]]);
        if (divExpense.style.visibility === 'hidden' || divExpense.style.visibility === "") {
            divExpense.style.visibility = 'visible';
        } else {
            divExpense.style.visibility = "hidden";
        }
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
    <>
      <div id="div-modify-expense">
        <ModifyExpense onAddExpense={modifyAddExpense} onEditExpense={modifyEditExpense} loadExpense={sendExpense} />
      </div>
      <div id="div-filter-expense">
        <FilterExpense onFilterExpense={modifyFilterExpense} expenseData={expenses} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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

      <div id="expense-table">
        <button onClick={handleAddExpense}>Add Expense</button><br />
        <button onClick={handleFilterExpense}>Filter</button>
        <button onClick={resetFilter}>Reset Filter</button>
        <table>
          <tbody>
            <tr>
              {tableHead.map((head, index) => (
                <th key={index} style={{ userSelect: "none" }} onClick={() => { sortTableBy(head); }}>
                  {head}
                </th>
              ))}
            </tr>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.date}</td>
                <td>{expense.category}</td>
                <td>{expense.merchant}</td>
                <td>{expense.amount}</td>
                <td>{expense.paymentMode}</td>
                <td>
                  <button onClick={() => handleEditExpense(index)}>Edit</button>
                  <button onClick={() => handleDeleteExpense(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}