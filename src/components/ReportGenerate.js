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
 const [reportType, setReportType] = useState('');
 const [date, setDate] = useState('');

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
  console.log("Filtering expenses for date:", date);
  return expenses.filter(expense => {
     const expenseDate = new Date(expense.date);
     console.log("Expense date:", expenseDate);
     return expenseDate.getDate() === date.getDate() &&
       expenseDate.getMonth() === date.getMonth() &&
       expenseDate.getFullYear() === date.getFullYear();
  });
 };

 const filterMonthlyExpenses = (date) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === date.getMonth() &&
      expenseDate.getFullYear() === date.getFullYear();
  });
};

 const handleMonthlyReport = () => {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() + 1 === parseInt(monthlyReportMonth) && expenseDate.getFullYear() === parseInt(monthlyReportYear);
    });
    saveExcel(filteredExpenses);
 };

 const handlePeriodReport = () => {
    const startDate = new Date(Date.parse(periodStartDate));
    startDate.setHours(0, 0, 0, 0); // Set the time to the start of the day

    const endDate = new Date(Date.parse(periodEndDate));
    endDate.setHours(23, 59, 59, 999); // Set the time to the end of the day

    // Adjust the endDate to include the entire day of the end date
    endDate.setDate(endDate.getDate() + 1);
    endDate.setMilliseconds(endDate.getMilliseconds() - 1);

    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate < endDate; // Use < instead of <= to exclude the end date
    });
    saveExcel(filteredExpenses);
 };

 const saveExcel = async (expenses) => {
  console.log("Expenses to be saved:", expenses);
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
        console.log("Adding expense to Excel:", expense);
        let formattedDate;
        if (expense.date instanceof Date) {
          formattedDate = expense.date.toISOString().split('T')[0];
        } else {
          formattedDate = expense.date;
        }
        const formattedExpense = {
          ...expense,
          date: formattedDate
        };
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

 




 const handleAllFieldsReport = () => {
  // If only the start date is provided, set the end date to the current date
  let endDate = periodEndDate ? new Date(periodEndDate) : new Date();
 
  // Adjust the endDate to include the entire day of the end date
  endDate.setHours(23, 59, 59, 999); // Set the time to the end of the day
 
  const filteredExpenses = expenses.filter(expense => {
     const expenseDate = new Date(expense.date);
     const matchesCategory = !categoryFilter || expense.category === categoryFilter;
     const matchesPaymentMode = !paymentModeFilter || expense.paymentMode === paymentModeFilter;
     const matchesMerchant = !merchantFilter || expense.merchant.includes(merchantFilter);
     const matchesDateRange = !periodStartDate || !periodEndDate || (
       expenseDate >= new Date(periodStartDate) &&
       expenseDate <= endDate // Use <= to include the end date
     );
     return matchesCategory && matchesPaymentMode && matchesMerchant && matchesDateRange;
  });
  saveExcel(filteredExpenses);
 };
 
 
 
 
 return (
  <div>
    <SpinnerComponent state={loading} setState={setLoading} />
    <PopupModal state={popupState} setState={handlePopupState} content={content} />
    <div className="report-container">
      <div className="report-input">
       
        {/* Conditionally render other filters based on report type */}
        {reportType === '' && (
          <>
            <label htmlFor="categoryFilter">Category:</label>
            <input
              type="text"
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="report-input"
            />
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
            <label htmlFor="merchantFilter">Merchant:</label>
            <input
              type="text"
              id="merchantFilter"
              value={merchantFilter}
              onChange={(e) => setMerchantFilter(e.target.value)}
              className="report-input"
            />
            <label htmlFor="periodStartDate">Start Date:</label>
            <input
              type="date"
              id="periodStartDate"
              value={periodStartDate}
              onChange={(e) => setPeriodStartDate(e.target.value)}
              className="report-input"
            />
            <label htmlFor="periodEndDate">End Date:</label>
            <input
              type="date"
              id="periodEndDate"
              value={periodEndDate}
              onChange={(e) => setPeriodEndDate(e.target.value)}
              className="report-input"
            />
            <button className="report-button" onClick={handleAllFieldsReport}>Generate Report Based on All Fields</button>
          </>
        )}
      </div>
    </div>
    {/* Existing UI elements for daily, monthly, and period reports */}
  </div>
);
};
export default ReportGenerate;
