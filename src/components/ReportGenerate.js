import React, { useState } from 'react';
import axios from 'axios';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import PopupModal from './PopupModal';
import SpinnerComponent from './SpinnerComponent';
import { currentDate } from './currentDate';
import { getCategories } from './categories';
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import "../styles/ReportGenerate.css";

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
 const [paymentModeFilter, setPaymentModeFilter] = useState('');
 const [merchantFilter, setMerchantFilter] = useState('');
 const [dailyReportDate, setDailyReportDate] = useState('');
 const [monthlyReportMonth, setMonthlyReportMonth] = useState('');
 const [yearlyReportYear, setYearlyReportYear] = useState('');
 const [periodStartDate, setPeriodStartDate] = useState('');
 const [periodEndDate, setPeriodEndDate] = useState('');
 const [reportType, setReportType] = useState('');
 const categories = getCategories();
 



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
  let endDate = periodEndDate ? periodEndDate : currentDate();
  endDate = endDate.slice(0,10);
  
  
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
  if(selected_categories.length !== 0)
  {
    var temp = [];
    for(var i = 0; i < selected_categories.length; i++)
    {
      temp = temp.concat(filteredExpenses.filter((expense)=>{
        return expense["category"] === selected_categories[i];
      }));
    }
    filteredExpenses = temp;
    console.log(filteredExpenses)
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

 const [selected_categories, set_Selected_categories] =  
        useState([]); 

        const toggleCat = (option) => { 
          console.log(option)
            if (selected_categories.includes(option)) { 
                set_Selected_categories( 
                    selected_categories.filter((item) =>  
                        item !== option)); 
            } else { 
                set_Selected_categories( 
                    [...selected_categories, option]); 
            } 
        }; 
 
 
 
 
 return (
  <div>
    <SpinnerComponent state={loading} setState={setLoading} />
    <PopupModal state={popupState} setState={handlePopupState} content={content} />
    <div className="report-container">
    <div className='report-input'>
        {
          <>
            <Form id= "report-form">
            <Form.Group as={Row} className="mb-3" controlId="formHorizontal">
                <Form.Label column sm={2} style={{"marginTop":"40px"}}>
                    Category
                </Form.Label>
                <Col sm={10}>
                <Dropdown>
                <Dropdown.Toggle style={{"width":"200px","backgroundColor":"#e26f6f", "marginLeft":"50px", "marginTop":"40px"}} variant="success" id="dropdown-basic">
                    Choose Category
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '150px', overflowY: 'auto', 'width':"220px" }}> 
                    {categories.map((cat, index) => ( 
                            <Form.Check
                            key={index}
                            type="checkbox"
                            label={<span style={{"margin-left":"10px"}}>{cat}</span>}
                            checked={selected_categories.includes(cat)}
                            onClick={()=>toggleCat(cat)}
                            style={{"width":'20px', "margin":"10px","textWrap":"nowrap"}}
                            />
                        ))} 
                    </Dropdown.Menu> 
                </Dropdown>
                </Col>
                <Form.Label id = "modify-expense-category-error" column sm={2}>
                </Form.Label>
                    </Form.Group>
            </Form>
            
            
            
            
          </>
        }
        </div>
        <div className='report-input'>
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
        </div>
        <div className='report-input'>
        <label htmlFor="merchantFilter">Merchant:</label>
        <input
          type="text"
          id="merchantFilter"
          value={merchantFilter}
          onChange={(e) => setMerchantFilter(e.target.value)}
          className="report-input"
        />
        </div>
    </div>

    <div className="report-container" style={{"height":"140px"}}>
      <div className='report-input'>
        <label htmlFor="periodStartDate" style={{"marginRight":"20px"}}>Start Date:</label>
        <input
          type="date"
          id="periodStartDate"
          value={periodStartDate}
          onChange={(e) => setPeriodStartDate(e.target.value)}
          className="report-input"
        />
        </div>
        <div className='report-input'>
        <label htmlFor="periodEndDate" style={{"marginRight":"20px"}}>End Date:</label>
        <input
          type="date"
          id="periodEndDate"
          value={periodEndDate}
          onChange={(e) => setPeriodEndDate(e.target.value)}
          className="report-input"
        />
        </div>
       
      </div>
    <div className='report-container' style={{"display":"flex", "justifyContent":"center", "backgroundColor":"white", "boxShadow":"none"}}>
    <button className="report-button" onClick={handleAllFieldsReport}>Generate Report Based on All Fields</button>
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
