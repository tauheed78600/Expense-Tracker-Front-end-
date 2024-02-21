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

    const [budget, setBudget] = useState(0);
    const [remainingExpense, setRemainingExpense] = useState(0);
    const [budgetGoal, setBudgetGoal] = useState(0);
    // const [displayedBudgetGoal, setDisplayedBudgetGoal] = useState(0); 
    const [dailyReportDate, setDailyReportDate] = useState('');
    // State to hold the user's input for the monthly report month and year
    const [monthlyReportMonth, setMonthlyReportMonth] = useState('');
    const [monthlyReportYear, setMonthlyReportYear] = useState('');
    const [periodStartDate, setPeriodStartDate] = useState('');
    const [periodEndDate, setPeriodEndDate] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [paymentModeFilter, setPaymentModeFilter] = useState('');
    const [merchantFilter, setMerchantFilter] = useState('');

    
    const filterExpensesByCategory = (category) => {
        return expenses.filter(expense => expense.category === category);
      };
      
      const filterExpensesByPaymentMode = (paymentMode) => {
        return expenses.filter(expense => expense.paymentMode === paymentMode);
      };
      
      const filterExpensesByMerchant = (merchant) => {
        return expenses.filter(expense => expense.merchant === merchant);
      };
      
      const handleCategoryReport = () => {
        const filteredExpenses = filterExpensesByCategory(categoryFilter);
        saveExcel(filteredExpenses);
      };
      
      const handlePaymentModeReport = () => {
        const filteredExpenses = filterExpensesByPaymentMode(paymentModeFilter);
        saveExcel(filteredExpenses);
      };
      
      const handleMerchantReport = () => {
        const filteredExpenses = filterExpensesByMerchant(merchantFilter);
        saveExcel(filteredExpenses);
      };
      
    

    const handleSetBudgetGoal = async () => {
        try {
            const response = await axios.put(`http://localhost:3000/expenses/budget-goal?monthly_budget=${budgetGoal}&userId=${userId}`);
            console.log("inside setBudget Goal response", response.data)
            if (response.status === 400)
            {
                alert('Error setting budget goal:', response.data.message)
                console.error('Error setting budget goal:', response.data.message);
            }
            // Update the displayed budget goal state
            setBudget(budgetGoal);
        } catch (error) {
          console.error('Error setting budget goal:', error);
        }
      };

    const workSheetName = 'Worksheet-1';
    const workBookName = 'MyWorkBook';
    const myInputId = 'myInput';
    const workbook = new Excel.Workbook();

    const columns = [
        { header: 'Expense ID', key: 'expenseId' },
        { header: 'User ID', key: 'userId' },
        { header: 'Date', key: 'date' },
        { header: 'Category', key: 'category' },
        { header: 'Merchant', key: 'merchant' },
        { header: 'Amount', key: 'amount' },
        { header: 'Payment Mode', key: 'paymentMode' }
    ];

    const saveExcel = async (expenses) => {
        try {
            const myInput = document.getElementById(myInputId);
            const fileName = myInput.value || workBookName;

            // creating one worksheet in workbook
            const workbook = new Excel.Workbook();
            const worksheet = workbook.addWorksheet(workSheetName);

            // add worksheet columns
            worksheet.columns = columns;

            // updated the font for first row.
            worksheet.getRow(1).font = { bold: true };

            // loop through all of the columns and set the alignment with width.
            worksheet.columns.forEach(column => {
                column.width = column.header.length +   5;
                column.alignment = { horizontal: 'center' };
            });

            let expensesArray = Array.isArray(expenses) ? expenses : [expenses];

            // loop through data and add each one to worksheet
            expensesArray.forEach(singleData => {
                // Ensure singleData is an object with keys matching the columns
                if (typeof singleData === 'object' && singleData !== null) {
                    worksheet.addRow(singleData);
                } else {
                    console.error('Invalid expense data:', singleData);
                }
            });
            // loop through all of the rows and set the outline style.
            worksheet.eachRow({ includeEmpty: false }, row => {
                const currentCell = row._cells;
                currentCell.forEach(singleCell => {
                    const cellAddress = singleCell._address;
                    worksheet.getCell(cellAddress).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // write the content using writeBuffer
            const buf = await workbook.xlsx.writeBuffer();

            // download the processed file
            saveAs(new Blob([buf]), `${fileName}.xlsx`);
        } catch (error) {
            console.error('<<<ERRROR>>>', error);
            console.error('Something Went Wrong', error.message);
        }
    }

    const filterDailyExpenses = (date) => {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getDate() === date.getDate() &&
                   expenseDate.getMonth() === date.getMonth() &&
                   expenseDate.getFullYear() === date.getFullYear();
        });
    };

    // Function to filter expenses for a specific month
    const filterMonthlyExpenses = (month, year) => {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === month &&
                   expenseDate.getFullYear() === year;
        });
    };

    const handleDailyReport = () => {
        const inputDate = new Date(dailyReportDate);
        if (!isNaN(inputDate.getDate())) {
            const dailyExpenses = filterDailyExpenses(inputDate);
            saveExcel(dailyExpenses);
        } else {
            alert('Please enter a valid date.');
        }
    };

    // Function to handle the monthly report generation
    const handleMonthlyReport = () => {
        const inputMonth = parseInt(monthlyReportMonth,  10) -  1; // Months are  0-indexed in JavaScript
        const inputYear = parseInt(monthlyReportYear,  10);
        if (!isNaN(inputMonth) && !isNaN(inputYear)) {
            const monthlyExpenses = filterMonthlyExpenses(inputMonth, inputYear);
            saveExcel(monthlyExpenses);
        } else {
            alert('Please enter a valid month and year.');
        }
    };

    const filterPeriodExpenses = (startDate, endDate) => {
        return expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    };

    const handlePeriodReport = () => {
        const start = new Date(periodStartDate);
        const end = new Date(periodEndDate);
        if (!isNaN(start.getDate()) && !isNaN(end.getDate()) && start <= end) {
            console.log("handlePeriodExpense", start.getDate(), start.getDate())
            const periodExpenses = filterPeriodExpenses(start, end);
            saveExcel(periodExpenses);
        } else {
            alert('Please enter valid start and end dates.');
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
                setBudget(response.data.monthly_budget);
                setRemainingExpense(response.data.remaining_budget)
                const emailId = response.data.email
                console.log(emailId)    

                if (response.data.remaining_budget <= response.data.monthly_budget *   0.1) {
                    const currentMonth = new Date().getMonth();
                    const lastMonthNineReachedEmailSent = localStorage.getItem('lastMonthNineReachedEmailSent');
                    if (lastMonthNineReachedEmailSent !== currentMonth.toString()) {
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-goal-ninereached`, { email: emailId  });
                    if (response)
                    {
                        // alert("Budget goal has been  90% reached for this month");
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
                        console.log("response: " , response.data)
                        // alert("Budget goal has been reached for this month")
                        localStorage.setItem('lastMonthEmailSent', currentMonth.toString());
                    }
                  }
                }


            } catch (error) {
                console.error('Error fetching user data:', error);
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

            <div id="budget-options">
            <div>Monthly Budget: {budget}</div>
            <div>
              <input
                type="number"
                value={budgetGoal}
                onChange={(e) => setBudgetGoal(e.target.value)}
                placeholder="Set Budget Goal"
                className="budget-goal-input"
              />
              <button className="set-budget-button" onClick={handleSetBudgetGoal}>Set Budget Goal</button>
            </div>
            <div className="remaining-budget-display">Remaining Budget: {remainingExpense}</div>
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