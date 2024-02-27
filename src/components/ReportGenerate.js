import React, { useState } from 'react';
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import PopupModal from './PopupModal';
import SpinnerComponent from './SpinnerComponent';

const ReportGenerate = ({ expenses }) => {

  const [popupState, setPopupState] = useState(false);
    const handlePopupState = (state) => {
        setPopupState(state);
    }
    const [loading, setLoading] = useState(false);

    

    const masterContent = {
        "error": {
          "head": "Error",
          "body": "Please enter a valid date!"
      },

  }

  const [content, setContent] = useState(masterContent["error"]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentModeFilter, setPaymentModeFilter] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('');
  const [dailyReportDate, setDailyReportDate] = useState('');
  const [monthlyReportMonth, setMonthlyReportMonth] = useState('');
  const [monthlyReportYear, setMonthlyReportYear] = useState('');
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');

  const filterExpensesByCategory = (category) => {
    return expenses.filter(expense => expense.category === category);
  };

  const filterExpensesByPaymentMode = (paymentMode) => {
    return expenses.filter(expense => expense.paymentMode === paymentMode);
  };

  const filterExpensesByMerchant = (merchant) => {
    return expenses.filter(expense => expense.merchant === merchant);
  };

  const handleDailyReport = () => {
    const inputDate = new Date(dailyReportDate);
    if (!isNaN(inputDate.getDate())) {
        const dailyExpenses = filterDailyExpenses(inputDate);
        saveExcel(dailyExpenses);
    } else {
        setContent(masterContent["error"]);
        setPopupState(true);
    }
};

const filterDailyExpenses = (date) => {
  return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getDate() === date.getDate() &&
             expenseDate.getMonth() === date.getMonth() &&
             expenseDate.getFullYear() === date.getFullYear();
  });
};

  const handleMonthlyReport = () => {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() +  1 === parseInt(monthlyReportMonth) && expenseDate.getFullYear() === parseInt(monthlyReportYear);
    });
    saveExcel(filteredExpenses);
  };

  const handlePeriodReport = () => {
    const startDate = new Date(Date.parse(periodStartDate));
    startDate.setHours(0,   0,   0,   0); // Set the time to the start of the day
  
    const endDate = new Date(Date.parse(periodEndDate));
    endDate.setHours(23,   59,   59,   999); // Set the time to the end of the day
  
    // Adjust the endDate to include the entire day of the end date
    endDate.setDate(endDate.getDate() +   1);
    endDate.setMilliseconds(endDate.getMilliseconds() -   1);
  
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate < endDate; // Use < instead of <= to exclude the end date
    });
    saveExcel(filteredExpenses);
  };
  
  
  const saveExcel = async (expenses) => {
    try {
      setLoading(true);
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Expenses');
  
      worksheet.columns = [
        { header: 'Date', key: 'date' },
        { header: 'Category', key: 'category' },
        { header: 'Merchant', key: 'merchant' },
        { header: 'Amount', key: 'amount' },
        { header: 'Payment Mode', key: 'paymentMode' }
      ];
  
      expenses.forEach(expense => {
        // Check if expense.date is a Date object
        let formattedDate;
        if (expense.date instanceof Date) {
          // If it's a Date object, format it as a string in the format YYYY-MM-DD
          formattedDate = expense.date.toISOString().split('T')[0];
        } else {
          // If it's not a Date object, assume it's a string and format it directly
          formattedDate = expense.date;
        }
        // Create a new object with the formatted date
        const formattedExpense = {
          ...expense,
          date: formattedDate
        };
        // Add the formatted expense to the worksheet
        worksheet.addRow(formattedExpense);
      });
  
      const buf = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buf]), 'Expenses_Report.xlsx');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error generating Excel report:', error);
    }
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

  return (
    <div>
      <SpinnerComponent state={loading} setState={setLoading}/>
      <PopupModal state={popupState} setState={handlePopupState} content={content}/>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="categoryFilter">Category:</label>
<select
      id="categoryFilter"
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
      className="report-input"
    >
      <option value="">Select a category</option>
      <option value="Supermarket">Supermarket</option>
      <option value="Gas Station">Gas Station</option>
      <option value="Restaurant">Restaurant</option>
      <option value="Online Retailer">Online Retailer</option>
      <option value="Airline">Airline</option>
      <option value="Healthcare Provider">Healthcare Provider</option>
      <option value="Salons and Spa">Salons and Spa</option>
      <option value="Home Improvement">Home Improvement</option>
      <option value="Store">Store</option>
      <option value="Subscription Service">Subscription Service</option>
      <option value="Miscellaneous">Miscellaneous</option>
      <option value="Other">Other</option>
    </select>

          <button className="report-button" onClick={handleCategoryReport}>Generate Category Report</button>
        </div>
      </div>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="paymentModeFilter">Payment Mode:</label>
              <select
      id="paymentModeFilter"
      value={paymentModeFilter}
      onChange={(e) => setPaymentModeFilter(e.target.value)}
      className="report-input"
    >
      <option value="">Select a payment mode</option>
      <option value="Credit">Credit</option>
      <option value="Debit">Debit</option>
      <option value="UPI">UPI</option>
      <option value="Cash">Cash</option>
    </select>
          <button className="report-button" onClick={handlePaymentModeReport}>Generate Payment Mode Report</button>
        </div>
      </div>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="merchantFilter">Merchant:</label>
          <input
            type="text"
            id="merchantFilter"
            value={merchantFilter}
            onChange={(e) => setMerchantFilter(e.target.value)}
            className="report-input"
          />
          <button className="report-button" onClick={handleMerchantReport}>Generate Merchant Report</button>
        </div>
      </div>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="dailyReportDate">Daily Report Date:</label>
          <input
            type="date"
            id="dailyReportDate"
            value={dailyReportDate}
            onChange={(e) => setDailyReportDate(e.target.value)}
            className="report-input"
          />
          <button className="report-button" onClick={handleDailyReport}>Generate Daily Report</button>
        </div>
      </div>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="monthlyReportMonth">Monthly Report Month:</label>
          <input
            type="number"
            id="monthlyReportMonth"
            value={monthlyReportMonth}
            onChange={(e) => setMonthlyReportMonth(e.target.value)}
            min="1"
            max="12"
            className="report-input"
          />
          <label htmlFor="monthlyReportYear">Monthly Report Year:</label>
          <input
            type="number"
            id="monthlyReportYear"
            value={monthlyReportYear}
            onChange={(e) => setMonthlyReportYear(e.target.value)}
            min="1900"
            max="2099"
            className="report-input"
          />
          <button className="report-button" onClick={handleMonthlyReport}>Generate Monthly Report</button>
        </div>
      </div>
      <div className="report-container">
        <div className="report-input">
          <label htmlFor="periodStartDate">Period Report Start Date:</label>
          <input
            type="date"
            id="periodStartDate"
            value={periodStartDate}
            onChange={(e) => setPeriodStartDate(e.target.value)}
            className="report-input"
          />
          <label htmlFor="periodEndDate">Period Report End Date:</label>
          <input
            type="date"
            id="periodEndDate"
            value={periodEndDate}
            onChange={(e) => setPeriodEndDate(e.target.value)}
            className="report-input"
          />
          <button className="report-button" onClick={handlePeriodReport}>Generate Period Report</button>
        </div>
      </div>
    </div>
  );
  }  

export default ReportGenerate;
