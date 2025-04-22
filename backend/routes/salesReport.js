const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// Helper to format dates
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

// 🧾 Full Sales Report Endpoint
router.get('/sales-report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date('2000-01-01');
    const end = endDate ? new Date(endDate) : new Date();

    const orders = await Order.find({
      placedAt: { $gte: start, $lte: end },
    });

    // Basic Stats
    const totalOrders = orders.length;
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalItemsSold = orders.reduce((acc, order) => acc + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);

    // Product Insights
    const productSalesMap = new Map();
    for (const order of orders) {
      for (const item of order.items) {
        if (!productSalesMap.has(item.name)) {
          productSalesMap.set(item.name, { quantity: 0, revenue: 0 });
        }
        const data = productSalesMap.get(item.name);
        data.quantity += item.quantity;
        data.revenue += item.quantity * item.price;
        productSalesMap.set(item.name, data);
      }
    }

    const productSales = Array.from(productSalesMap.entries()).map(([name, stats]) => ({ name, ...stats }));
    const topProducts = productSales.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // Category Pie Chart Data
    const products = await Product.find();
    const categorySalesMap = new Map();
    for (const item of productSales) {
      const productInfo = products.find(p => p.name === item.name);
      if (productInfo) {
        const cat = productInfo.category;
        if (!categorySalesMap.has(cat)) categorySalesMap.set(cat, 0);
        categorySalesMap.set(cat, categorySalesMap.get(cat) + item.revenue);
      }
    }
    const categoryDistribution = Array.from(categorySalesMap.entries()).map(([category, revenue]) => ({ category, revenue }));

    // Low stock alerts
    const lowStock = products.filter(p => p.stock <= 5);

    res.status(200).json({
      totalSales,
      totalOrders,
      totalItemsSold,
      topProducts,
      productSales,
      categoryDistribution,
      lowStock,
      message: `Sales Report from ${formatDate(start)} to ${formatDate(end)}`,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// 📥 Export Report to CSV
router.get('/export/csv', async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email'); // optional user details

    const csvData = orders.map(order => {
      const itemNames = order.items.map(item => item.name).join(', ');
      const itemPrices = order.items.map(item => item.price).join(', ');
      const itemQuantities = order.items.map(item => item.quantity).join(', ');

      return {
        OrderID: order._id,
        CustomerID: order.userId?._id || 'N/A',
        CustomerName: order.userId?.name || 'N/A',
        CustomerEmail: order.userId?.email || 'N/A',
        TotalAmount: order.totalAmount,
        PlacedAt: order.placedAt,
        ItemNames: itemNames,
        ItemPrices: itemPrices,
        Quantities: itemQuantities,
        ItemCount: order.items.length
      };
    });

    const fields = [
      'OrderID',
      'CustomerID',
      'CustomerName',
      'CustomerEmail',
      'TotalAmount',
      'PlacedAt',
      'ItemNames',
      'ItemPrices',
      'Quantities',
      'ItemCount'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(csvData);

    const filePath = path.join(__dirname, '../exports/sales_report.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath);
  } catch (err) {
    console.error('CSV Export Error:', err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;
