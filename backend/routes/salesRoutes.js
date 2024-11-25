const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Route to fetch sales data for all months
router.get('/sales', async (req, res) => {
  try {
    // Aggregate orders by month and sum up the totalPrice, also count the number of orders
    const salesData = await Order.aggregate([
      {
        $project: {
          year: { $year: "$orderDate" },
          month: { $month: "$orderDate" },
          totalPrice: 1,
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 }, // Count the number of orders
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month (ascending)
      },
    ]);

    // Format the result into a format suitable for the chart
    const result = salesData.map(item => ({
      date: `${item._id.year}-${item._id.month < 10 ? '0' + item._id.month : item._id.month}`,
      totalSales: item.totalSales,
      orderCount: item.orderCount, // Add order count
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch sales data.' });
  }
});

module.exports = router;
