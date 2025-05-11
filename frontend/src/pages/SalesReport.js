import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCallback, useEffect, useState } from 'react';
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
  const [downloadType, setDownloadType] = useState('summary'); // 'summary', 'detailed', 'complete'

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const query = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : '';
      const res = await axios.get(`https://consultancy-1-tdn6.onrender.com/api/sales-report${query}`);
      setReport(res.data);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleCSVDownload = async () => {
    try {
      const query = fromDate && toDate ? `?from=${fromDate}&to=${toDate}` : '';
      const detailLevel = `&detail=${downloadType}`;
      const response = await axios.get(`https://consultancy-1-tdn6.onrender.com/api/export/csv${query}${detailLevel}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${downloadType}_${fromDate || 'all'}_to_${toDate || 'all'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading CSV:', err);
      alert('❌ Failed to download CSV. Please try again.');
    }
  };

  const handlePDFDownload = () => {
    const doc = new jsPDF();
    
    // Add title and date range
    doc.setFontSize(18);
    doc.text('Sales Report', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    const dateRange = fromDate && toDate 
      ? `${fromDate} to ${toDate}` 
      : 'All Time';
    doc.text(`Period: ${dateRange}`, 105, 25, { align: 'center' });
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Summary', 20, 35);
    doc.setFontSize(12);
    doc.text(`Total Sales: ₹${report.totalSales}`, 20, 45);
    doc.text(`Total Orders: ${report.totalOrders}`, 20, 52);
    doc.text(`Items Sold: ${report.totalItemsSold}`, 20, 59);
    
    // Top products table
    doc.setFontSize(14);
    doc.text('Top Selling Products', 20, 70);
    
    // Use autoTable as a function
    autoTable(doc, {
      head: [['Product', 'Quantity', 'Revenue']],
      body: report.topProducts.map(p => [p.name, p.quantity, `₹${p.revenue}`]),
      startY: 75
    });
    
    // Add category distribution if detailed or complete
    if (downloadType === 'detailed' || downloadType === 'complete') {
      const tableEndY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(14);
      doc.text('Category Distribution', 20, tableEndY);
      
      autoTable(doc, {
        head: [['Category', 'Revenue', 'Percentage']],
        body: report.categoryDistribution.map(c => [
          c.category, 
          `₹${c.revenue}`, 
          `${((c.revenue / report.totalSales) * 100).toFixed(2)}%`
        ]),
        startY: tableEndY + 5
      });
      
      // No sales trend data available
    }
    
    // Add top customers if complete
    if (downloadType === 'complete' && report.topCustomers) {
      // Check if we need a new page
      if (doc.lastAutoTable.finalY > 220) {
        doc.addPage();
        doc.setFontSize(14);
        doc.text('Top Customers', 20, 20);
        
        autoTable(doc, {
          head: [['Customer', 'Email', 'Total Spent']],
          body: report.topCustomers.map(c => [
            c.name, 
            c.email, 
            `₹${c.totalSpent}`
          ]),
          startY: 25
        });
      } else {
        const prevEndY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(14);
        doc.text('Top Customers', 20, prevEndY);
        
        autoTable(doc, {
          head: [['Customer', 'Email', 'Total Spent']],
          body: report.topCustomers.map(c => [
            c.name, 
            c.email, 
            `₹${c.totalSpent}`
          ]),
          startY: prevEndY + 5
        });
      }
    }
    
    // Add footer with generation date
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
        105, 
        285, 
        { align: 'center' }
      );
    }
    
    doc.save(`sales_report_${downloadType}_${fromDate || 'all'}_to_${toDate || 'all'}.pdf`);
  };

  // No sales trend data available

  // Handle raw data download (JSON format)
  const handleRawDataDownload = () => {
    if (!report) return;
    
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_report_raw_${fromDate || 'all'}_to_${toDate || 'all'}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) return <p className="loading-text">Loading report...</p>;
  if (!report) return <p className="error-text">Failed to load report.</p>;
  if (report.totalOrders === 0) return <p className="no-data-text">📉 No sales data found.</p>;



  return (
    <div className="report-container">
      <h2 className="title">📊 Sales Report</h2>

      <div className="filter-container">
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="input-date" />
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="input-date" />
        <button onClick={fetchReport} className="filter-button">Filter</button>
      </div>

      <div className="summary-cards">
        <div className="summary-card"><p>Total Sales</p><p>₹{report.totalSales}</p></div>
        <div className="summary-card"><p>Total Orders</p><p>{report.totalOrders}</p></div>
        <div className="summary-card"><p>Items Sold</p><p>{report.totalItemsSold}</p></div>
      </div>

      <h3 className="top-products-title">Top Selling Products</h3>
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Revenue</th></tr>
          </thead>
          <tbody>
            {report.topProducts.map((prod, i) => (
              <tr key={i}>
                <td>{prod.name}</td>
                <td>{prod.quantity}</td>
                <td>₹{prod.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="chart-section-title">Charts</h3>
      <div className="charts-container">
        <div className="chart">
          <h4>Revenue by Product</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.productSales}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h4>Category Distribution</h4>
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
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

  
      </div>

      {report.topCustomers && (
        <>
          <h3 className="top-products-title">Top Customers</h3>
          <div className="table-container">
            <table className="product-table">
              <thead><tr><th>Customer</th><th>Email</th><th>Total Spent</th></tr></thead>
              <tbody>
                {report.topCustomers.map((cust, i) => (
                  <tr key={i}>
                    <td>{cust.name}</td>
                    <td>{cust.email}</td>
                    <td>₹{cust.totalSpent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="export-section">
        <h3>Export Options</h3>
        <div className="export-detail-selector">
          <label>Detail Level:</label>
          <select value={downloadType} onChange={e => setDownloadType(e.target.value)}>
            <option value="summary">Summary (Basic Info)</option>
            <option value="detailed">Detailed (+ Category Distribution)</option>
            <option value="complete">Complete (+ Customer Data)</option>
          </select>
        </div>
        
        <div className="export-buttons">
          <button onClick={handleCSVDownload} className="export-button csv-button">
            <span className="button-icon">📄</span> Export CSV
          </button>
          <button onClick={handlePDFDownload} className="export-button pdf-button">
            <span className="button-icon">📑</span> Export PDF
          </button>
          <button onClick={handleRawDataDownload} className="export-button json-button">
            <span className="button-icon">🔢</span> Export Raw Data (JSON)
          </button>
        </div>
      </div>

      <p className="message">{report.message}</p>
    </div>
  );
};

export default SalesReport;