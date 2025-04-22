import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    Cell, Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import './SalesReport.css';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SalesReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const query = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : '';
      const res = await axios.get(`http://localhost:5000/api/sales-report${query}`);
      setReport(res.data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCSVDownload = async () => {
    try {
      const query = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : '';
      const response = await axios.get(`http://localhost:5000/api/export/csv${query}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${fromDate || 'all'}_to_${toDate || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
      alert('❌ Failed to download CSV. Please try again.');
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  if (loading) return <p className="loading-text">Loading report...</p>;
  if (!report) return <p className="error-text">Failed to load report.</p>;
  if (report.totalOrders === 0) return <p className="no-data-text">📈 No sales data found.</p>;

  return (
    <div className="report-container">
      <h2 className="title">📊 Sales Report</h2>

      <div className="filter-container">
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="input-date" />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="input-date" />
        <button onClick={fetchReport} className="filter-button">Filter</button>
        <button onClick={handleCSVDownload} className="csv-button" disabled={loading}>
          {loading ? 'Preparing CSV...' : 'Export CSV'}
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <p className="summary-title">Total Sales</p>
          <p className="summary-value">₹{report.totalSales}</p>
        </div>
        <div className="summary-card">
          <p className="summary-title">Total Orders</p>
          <p className="summary-value">{report.totalOrders}</p>
        </div>
        <div className="summary-card">
          <p className="summary-title">Items Sold</p>
          <p className="summary-value">{report.totalItemsSold}</p>
        </div>
      </div>

      <h3 className="top-products-title">Top Selling Products</h3>
      <div className="table-container">
        <table className="product-table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Product</th>
              <th className="table-cell">Quantity</th>
              <th className="table-cell">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {report.topProducts.map((prod, i) => (
              <tr key={i} className="table-row">
                <td className="table-cell">{prod.name}</td>
                <td className="table-cell">{prod.quantity}</td>
                <td className="table-cell">₹{prod.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h4 className="chart-title">Revenue by Product</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.productSales}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h4 className="chart-title">Category Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={report.categoryDistribution}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {report.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="message">{report.message}</p>
    </div>
  );
};

export default SalesReport;
