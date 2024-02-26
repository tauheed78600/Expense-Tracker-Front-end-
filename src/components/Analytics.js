// Analytics.js
import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import "../styles/Analytics.css";
import PopupModal from './PopupModal';

const Analytics = ({ userId }) => {

  const masterContent = {
    "fetchError":{
        "head": "Error",
        "body": "Could not fetch data"
    }

}
const [popupState, setPopupState] = useState(false);
const handlePopupState = (state) => {
  setPopupState(state);
}



const [content, setContent] = useState(masterContent["fetchError"]);
  const [expensesData, setExpensesData] = useState({});
  const chartRefs = {
    lineChart: null,
    barChart: null,
    pieChart: null,
    pieChart1: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expensesResponse = await axios.get(`http://localhost:3000/api/data/${userId}`);
        const categoriesResponse = await axios.get(`http://localhost:3000/api/data1/${userId}`);
        const merchantsResponse = await axios.get(`http://localhost:3000/api/data2/${userId}`);
        const paymentModesResponse = await axios.get(`http://localhost:3000/api/data3/${userId}`);

        setExpensesData({
          expenses: expensesResponse.data,
          categories: categoriesResponse.data,
          merchants: merchantsResponse.data,
          paymentModes: paymentModesResponse.data,
        });
      } catch (error) {
        setContent(masterContent["fetchError"]);
        setPopupState(true);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (expensesData.expenses) {
      createLineChart('lineChart', expensesData.expenses, 'date', 'amount');
      createBarChart('barChart', expensesData.merchants, 'merchant', 'amount');
      createPieChart('pieChart', expensesData.categories, 'category', 'totalAmount');
      createPieChart('pieChart1', expensesData.paymentModes, 'paymentMode', 'totalAmount');
    }

    // Cleanup function to destroy chart instances
    return () => {
      Object.values(chartRefs).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [expensesData]);

  const createLineChart = (canvasId, data, labelKey, valueKey) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (chartRefs[canvasId]) {
      chartRefs[canvasId].destroy();
    }
    chartRefs[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(item => item[labelKey]),
        datasets: [{
          label: 'Expenses Over Time',
          data: data.map(item => item[valueKey]),
          backgroundColor: 'rgba(75,   192,   192,   0.2)',
          borderColor: 'rgba(75,   192,   192,   1)',
          borderWidth:   1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const createBarChart = (canvasId, data, labelKey, valueKey) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (chartRefs[canvasId]) {
      chartRefs[canvasId].destroy();
    }
    chartRefs[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item[labelKey]),
        datasets: [{
          label: 'Expenses by Merchant',
          data: data.map(item => item[valueKey]),
          backgroundColor: 'rgba(255,   99,   132,   0.2)',
          borderColor: 'rgba(255,   99,   132,   1)',
          borderWidth:   1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };


  
  const createPieChart = (canvasId, data, labelKey, valueKey) => {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (chartRefs[canvasId]) {
      chartRefs[canvasId].destroy();
    }
    chartRefs[canvasId] = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item[labelKey]),
        datasets: [{
          label: 'Expenses by Category',
          data: data.map(item => item[valueKey]),
          backgroundColor: 'rgba(248,   206,   86,   0.2)',
          borderColor: 'rgba(255,   206,   86,   1)',
          borderWidth:   1
        }]
      },
      options: {
        responsive: true
      }
    });
  };

  return (
    <div className="analytics-container">
      <PopupModal state={popupState} setState={handlePopupState} content={content}/>
      <div className="chart-row">
        <div className="chart-column">
          <canvas id="lineChart" className="chart"></canvas>
        </div>
        <div className="chart-column">
          <canvas id="pieChart" className="chart"></canvas>
          <canvas id="pieChart1" className="chart"></canvas>
        </div>
      </div>
      <div className="chart-row">
        <div className="chart-column">
          <canvas id="barChart" className="chart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
