import ModifyExpense from "../components/ModifyExpense.js";
import "../styles/Dashboard.css"
import "../styles/FilterExpense.css"
import "../styles/ModifyExpense.css"
import "../styles/NotificationPanel.css"
import { useEffect, useState } from "react";
import FilterExpense from "../components/FilterExpense.js";
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/expenses/${userId}`);
                // saveExcel(response.data);
                setExpenses(response.data);
                
                console.log('Expenses fetched:', response.data);
            } catch (error) {
                console.error('Error fetching expenses:', error);
                console.error('<<<ERRROR>>>', error);
                console.error('Something Went Wrong', error.message);
            }
            finally {
                // removing worksheet's instance to create new one
                
              }
        };
        
        fetchExpenses();
    }, [userId])

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
        const fetchUserData = async () => {
          
            try {
                const response = await axios.get(`http://localhost:3000/total/${userId}`);
                console.log("response data in monthly budget", response.data)
                setBudget(response.data.monthly_budget);
                setRemainingExpense(response.data.remaining_budget)
                localStorage.setItem("userId", response.data.userId)
                const emailId = response.data.email
                console.log(emailId)    

                if (response.data.remaining_budget <= response.data.monthly_budget *   0.1) {
                    const currentMonth = new Date().getMonth();
                    const lastMonthNineReachedEmailSent = localStorage.getItem('lastMonthNineReachedEmailSent');
                    if (lastMonthNineReachedEmailSent !== currentMonth.toString()) {
                    const response = await axios.post(`http://localhost:3000/total/send-email/budget-goal-ninereached`, { email: emailId  });
                    if (response)
                    {
                        alert("Budget goal has been  90% reached for this month");
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
                        alert("Budget goal has been reached for this month")
                        localStorage.setItem('lastMonthEmailSent', currentMonth.toString());
                    }
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



    const generatePDF = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/expenses/generate-pdf?userId=${userId}`, {
            responseType: 'blob', // Important: set the response type to 'blob'
          });
      
          // Use response.data directly as it's already a Blob
          const url = window.URL.createObjectURL(response.data);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'Monthly_Expenses_Report.pdf');
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } catch (error) {
          console.error('Error generating PDF:', error);
        }
      };
      
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
        console.log("index", index)
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
         
          <div className="budget-display">
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
          <div id="expense-table">
            <button className="add-expense-button" onClick={handleAddExpense}>Add Expense</button><br />
            <button className="filter-expense-button" onClick={handleFilterExpense}>Filter</button>
            <button className="reset-filter-button" onClick={resetFilter}>Reset Filter</button>
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
                      <button className="edit-expense-button" onClick={() => handleEditExpense(expense.expenseId)}>Edit</button>
                      <button className="delete-expense-button" onClick={() => handleDeleteExpense(expense.expenseId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
                }      

