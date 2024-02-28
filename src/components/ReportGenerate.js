import React, { useState } from 'react';
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import PopupModal from './PopupModal';
import SpinnerComponent from './SpinnerComponent';
import { currentDate } from './currentDate';

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
    "dailyReportError": {
      "head": "Error",
      "body": "Please select a valid date!"
    },
    "monthlyReportError": {
      "head": "Error",
      "body": "Please select a valid month!"
    },
    "yearlyReportError": {
      "head": "Error",
      "body": "Please enter a valid year!"
    },
 }

 const [content, setContent] = useState(masterContent["error"]);
 const [categoryFilter, setCategoryFilter] = useState('');
 const [paymentModeFilter, setPaymentModeFilter] = useState('');
 const [merchantFilter, setMerchantFilter] = useState('');
 const [dailyReportDate, setDailyReportDate] = useState('');
 const [monthlyReportMonth, setMonthlyReportMonth] = useState('');
 const [yearlyReportYear, setYearlyReportYear] = useState('');
 const [periodStartDate, setPeriodStartDate] = useState('');
 const [periodEndDate, setPeriodEndDate] = useState('');
 const [reportType, setReportType] = useState('');


 const handleDailyReport = () => {
  if(dailyReportDate === "")
  {
    setContent(masterContent["dailyReportError"]);
    setPopupState(true);
  }
  else
  {  var filteredExpenses = expenses.filter((expense)=> {
      return expense["date"].slice(0,10) === dailyReportDate;
    });
    saveExcel(filteredExpenses);}
 };
 const handleMonthlyReport = () => {
  if(monthlyReportMonth === "")
  {
    setContent(masterContent["monthlyReportError"]);
    setPopupState(true);
  }
  else
  {  var filteredExpenses = expenses.filter((expense)=> {
      return expense["date"].slice(0,7) === monthlyReportMonth;
    });
    saveExcel(filteredExpenses);
  }
 };

 const handleYearlyReport = () => {
  if(yearlyReportYear === "")
  {
    setContent(masterContent["yearlyReportError"]);
    setPopupState(true);
  }
  else
  {
      var filteredExpenses = expenses.filter((expense)=> {
      return expense["date"].slice(0,4) === yearlyReportYear;
    });
    saveExcel(filteredExpenses);
  }
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



 

 const handleAllFieldsReport = () => {
  // If only the start date is provided, set the end date to the current date
  let endDate = periodEndDate ? new Date(periodEndDate) : currentDate();
  
  var filteredExpenses = expenses;
  if(periodStartDate !== "")
  {
    filteredExpenses = filteredExpenses.filter((expense)=>{
      return expense["date"] >= periodStartDate;
    });
  }
  if(endDate !== "")
  {
    filteredExpenses = filteredExpenses.filter((expense)=>{
      return expense["date"] <= endDate;
    });
  }
  if(categoryFilter !== "")
  {
    filteredExpenses = filteredExpenses.filter((expense)=>{
      return expense["category"] === categoryFilter;
    });
  }
  
  if(merchantFilter !== "")
  {
    filteredExpenses = filteredExpenses.filter((expense)=>{
      return expense["merchant"] === merchantFilter;
    });
  }
  if(paymentModeFilter !== "")
  {
    filteredExpenses = filteredExpenses.filter((expense)=>{
      return expense["paymentMode"] === paymentModeFilter;
    });
  }
  saveExcel(filteredExpenses);
 };
 
 
 
 
 return (
  <div>
    <SpinnerComponent state={loading} setState={setLoading} />
    <PopupModal state={popupState} setState={handlePopupState} content={content} />
    <div className="report-container">
      <div className="report-input">
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
    <div className='report-container'>
          <div className='report-input'>
            <label htmlFor="dailyReportDate">Daily Report</label>
              <input
                type="date"
                id="dailyReportDate"
                value={dailyReportDate}
                onChange={(e) => setDailyReportDate(e.target.value)}
                className="report-input"
              />
              <button className="report-button" onClick={handleDailyReport}>Daily Report</button>
          </div>
          <div className='report-input'>
            <label htmlFor="monthlyReportMonth">Monthly Report</label>
                <input
                  type="month"
                  id="monthlyReportMonth"
                  value={monthlyReportMonth}
                  onChange={(e) => setMonthlyReportMonth(e.target.value)}
                  className="report-input"
                />
                <button className="report-button" onClick={handleMonthlyReport}>Monthly Report</button>
          </div>
          <div className='report-input'>
            <label htmlFor="yearlyReportYear">Year Report</label>
                <input
                  id="yearlyReportYear"
                  value={yearlyReportYear}
                  onChange={(e) => setYearlyReportYear(e.target.value)}
                  className="report-input"
                />
                <button className="report-button" onClick={handleYearlyReport}>Yearly Report</button>
          </div>
    </div>
  </div>
);
};
export default ReportGenerate;
