import ModifyExpense from "../components/ModifyExpense.js";
import "../styles/Dashboard.css";
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

    useEffect(() => {
        setExpenses(masterExpenses);
    }, []);


    useEffect(() => {
        const fetchExpenses = async () => {
          console.log('Fetching expenses for user:', userId); // Add this line
          const userId = localStorage.getItem('userId')
          console.log("userID 123456 is ", userId)
          try {
            const response = await axios.get(`http://localhost:3000/expense/${userId}`);
            console.log('API response:', response.data); // Add this line
            setExpenses(response.data);
          } catch (error) {
            console.error('Error fetching expenses:', error);
          }
        };
    
        if (userId) {
          fetchExpenses();
        }
    }, [userId]);

    const [sendExpense, setSendExpense] = useState([]);

    const modifyAddExpense = (newExpense) => {
        // Transform newExpense into an array if it's not already
        const transformedNewExpense = [
            newExpense.expenseId,
            newExpense.userId,
            newExpense.date,
            newExpense.category,
            newExpense.merchant,
            newExpense.amount,
            newExpense.paymentMode
        ];
        setExpenses(prevExpenses => [...prevExpenses, transformedNewExpense]);
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
                        {expenses.map((row, index) => {
                            // Ensure row is an array before calling slice
                            if (Array.isArray(row)) {
                                return (
                                    <tr key={index}>
                                        {row.slice(2).map((value, cellIndex) => (
                                            <td key={cellIndex}>{value}</td>
                                        ))}
                                        <td>
                                            <button onClick={() => handleEditExpense(index)}>Edit</button>
                                            <button onClick={() => handleDeleteExpense(index)}>Delete</button>
                                        </td>
                                    </tr>
                                );
                            } else {
                                // If row is not an array, log an error and return null
                                console.error('Expected row to be an array, but received:', row);
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
