import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const dailyData = [
  { day: 'Mon', sales: 4500 }, { day: 'Tue', sales: 6200 }, { day: 'Wed', sales: 3800 },
  { day: 'Thu', sales: 7100 }, { day: 'Fri', sales: 8900 }, { day: 'Sat', sales: 11200 }, { day: 'Sun', sales: 9500 },
];
const weeklyData = [
  { week: 'W1', sales: 45000 }, { week: 'W2', sales: 52000 }, { week: 'W3', sales: 48000 }, { week: 'W4', sales: 61000 },
];
const monthlyData = [
  { month: 'Jan', sales: 120000 }, { month: 'Feb', sales: 190000 }, { month: 'Mar', sales: 150000 },
  { month: 'Apr', sales: 250000 }, { month: 'May', sales: 220000 }, { month: 'Jun', sales: 300000 },
];

const reportRows = [
  { period: 'Today', orders: 24, revenue: 51200, customers: 18, topProduct: 'iPhone 15' },
  { period: 'This Week', orders: 156, revenue: 342000, customers: 98, topProduct: 'Basmati Rice' },
  { period: 'This Month', orders: 620, revenue: 1250000, customers: 380, topProduct: 'Nike Shoes' },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('daily');

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Smart Retail - Sales Report', 14, 22);
    doc.setFontSize(11);
    doc.text('Generated: ' + new Date().toLocaleDateString(), 14, 32);
    autoTable(doc, {
      startY: 40,
      head: [['Period', 'Orders', 'Revenue', 'Customers', 'Top Product']],
      body: reportRows.map(r => [r.period, r.orders, '₹' + r.revenue.toLocaleString(), r.customers, r.topProduct]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [99, 102, 241] },
    });
    doc.save('SmartRetail_Report.pdf');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
    XLSX.writeFile(wb, 'SmartRetail_Report.xlsx');
  };

  const chartData = activeTab === 'daily' ? dailyData : activeTab === 'weekly' ? weeklyData : monthlyData;
  const xKey = activeTab === 'daily' ? 'day' : activeTab === 'weekly' ? 'week' : 'month';

  return (
    <AdminLayout title="Reports">
      {/* Export Buttons */}
      <div className="toolbar">
        <div className="filter-tabs">
          {['daily', 'weekly', 'monthly'].map(t => (
            <button key={t} className={`filter-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-export-pdf" onClick={exportPDF}><FileText size={16} /> Export PDF</button>
          <button className="btn-export-excel" onClick={exportExcel}><FileSpreadsheet size={16} /> Export Excel</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mini-stats">
        {reportRows.map(r => (
          <div key={r.period} className="mini-stat blue">
            <span>{r.period}</span>
            <strong>₹{r.revenue.toLocaleString()}</strong>
            <small style={{ color: '#64748b' }}>{r.orders} orders</small>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="chart-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title">
          <FileText size={18} color="#6366f1" />
          {activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly'} Sales Report
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip formatter={v => '₹' + v.toLocaleString()} />
            <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="table-card" style={{ marginTop: '1.5rem' }}>
        <h3 className="chart-title">Summary Report</h3>
        <table className="data-table">
          <thead><tr><th>Period</th><th>Total Orders</th><th>Revenue</th><th>Customers</th><th>Top Product</th></tr></thead>
          <tbody>
            {reportRows.map(r => (
              <tr key={r.period}>
                <td><strong>{r.period}</strong></td>
                <td>{r.orders}</td>
                <td><strong style={{ color: '#22c55e' }}>₹{r.revenue.toLocaleString()}</strong></td>
                <td>{r.customers}</td>
                <td>{r.topProduct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
