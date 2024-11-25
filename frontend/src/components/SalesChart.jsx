import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const SalesChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/products/monthly-sales');
        const monthlySales = response.data.monthlySales;

        setChartData({
          labels: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ],
          datasets: [
            {
              label: 'Products Created',
              data: monthlySales,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.4,
              fill: true,
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Monthly Sales Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SalesChart;
