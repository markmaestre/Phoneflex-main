import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);

  // Fetch sales data for all months
  const fetchSalesData = async () => {
    const response = await fetch('/api/sales');
    const data = await response.json();
    setSalesData(data);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: salesData.map(item => item.date), // months
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map(item => item.totalSales), // total sales
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Order Count',
        data: salesData.map(item => item.orderCount), // order count
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div>
      <h3>Sales Chart</h3>

      {/* Display the chart */}
      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;
