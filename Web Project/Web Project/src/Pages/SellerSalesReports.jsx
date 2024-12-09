import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  FileText,
  Download,
  Filter,
  PieChart,
  List 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

// Mock data service (replace with actual API calls)
const salesDataService = {
  async fetchComprehensiveSalesData() {
    return {
      totalRevenue: 156430,
      averageOrderValue: 52,
      totalOrders: 3020,
      commissionEarned: 15643,
      topProducts: [
        { name: 'Product A', sales: 45000, quantity: 450 },
        { name: 'Product B', sales: 38000, quantity: 380 },
        { name: 'Product C', sales: 25000, quantity: 250 }
      ],
      monthlyBreakdown: [
        { month: 'Jan', revenue: 120000, orders: 900, profit: 18000 },
        { month: 'Feb', revenue: 156430, orders: 3020, profit: 23464 },
        { month: 'Mar', revenue: 185000, orders: 3500, profit: 27750 }
      ],
      salesByCategory: [
        { name: 'Electronics', value: 45000 },
        { name: 'Clothing', value: 38000 },
        { name: 'Home & Kitchen', value: 25000 },
        { name: 'Books', value: 15000 }
      ]
    };
  },

  async fetchDetailedSalesReport(startDate, endDate) {
    return {
      sales: Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        date: format(new Date(2024, 1, i + 1), 'yyyy-MM-dd'),
        productName: `Product ${String.fromCharCode(65 + (i % 3))}`,
        amount: Math.floor(Math.random() * 500) + 50,
        commission: Math.floor(Math.random() * 50) + 10,
        status: ['Completed', 'Processing', 'Shipped'][i % 3]
      })),
      totalSales: 15430,
      totalCommission: 1543
    };
  }
};

const SellerSalesReports = () => {
  const [salesData, setSalesData] = useState({
    totalRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    commissionEarned: 0,
    topProducts: [],
    monthlyBreakdown: [],
    salesByCategory: []
  });

  const [detailedReport, setDetailedReport] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [activeTab, setActiveTab] = useState('summary');
  const [activeView, setActiveView] = useState('cards');
  const [isGraphicalView, setIsGraphicalView] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await salesDataService.fetchComprehensiveSalesData();
        setSalesData(data);
      } catch (error) {
        console.error('Failed to fetch sales data', error);
      }
    };

    fetchSalesData();
  }, []);

  const downloadReport = (formatType) => {
    const dataToExport = activeTab === 'summary' 
      ? salesData.monthlyBreakdown 
      : detailedReport;

    if (dataToExport.length === 0) {
      alert('No data available to download.');
      return;
    }

    if (formatType === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
      XLSX.writeFile(workbook, `Sales_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } else if (formatType === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const csvContent = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `Sales_Report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchDetailedReport = async () => {
    try {
      const report = await salesDataService.fetchDetailedSalesReport(
        selectedDateRange.startDate, 
        selectedDateRange.endDate
      );
      setDetailedReport(report.sales);
    } catch (error) {
      console.error('Failed to fetch detailed report', error);
    }
  };

  const renderTopProducts = () => (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-2">Top Products</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Total Sales</th>
            <th className="border px-4 py-2">Quantity Sold</th>
          </tr>
        </thead>
        <tbody>
          {salesData.topProducts.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">${product.sales.toLocaleString()}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Seller Sales Dashboard</h1>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded ${
            activeTab === 'summary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`px-4 py-2 rounded ${
            activeTab === 'detailed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Detailed Report
        </button>
        <button
          onClick={() => setIsGraphicalView(!isGraphicalView)}
          className={`px-4 py-2 rounded ${
            isGraphicalView ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isGraphicalView ? 'Show Data' : 'Visualize Graphically'}
        </button>
        <div>
          <button
            onClick={() => downloadReport('excel')}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Download Excel
          </button>
          <button
            onClick={() => downloadReport('csv')}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div>
          {isGraphicalView ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData.monthlyBreakdown}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="orders" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-bold">Total Revenue</h3>
                <p>${salesData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-bold">Total Orders</h3>
                <p>{salesData.totalOrders}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-bold">Avg. Order Value</h3>
                <p>${salesData.averageOrderValue}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded shadow">
                <h3 className="font-bold">Commission Earned</h3>
                <p>${salesData.commissionEarned}</p>
              </div>
            </div>
          )}
          {renderTopProducts()}
        </div>
      )}

      {activeTab === 'detailed' && (
        <div>
          <div className="mb-4 flex gap-4">
            <input
              type="date"
              value={format(selectedDateRange.startDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDateRange({ ...selectedDateRange, startDate: new Date(e.target.value) })}
              className="border p-2 rounded"
            />
            <input
              type="date"
              value={format(selectedDateRange.endDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDateRange({ ...selectedDateRange, endDate: new Date(e.target.value) })}
              className="border p-2 rounded"
            />
            <button onClick={fetchDetailedReport} className="bg-blue-500 text-white px-4 py-2 rounded">
              Fetch Report
            </button>
          </div>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Sale ID</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Product Name</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Commission</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {detailedReport.map((sale) => (
                <tr key={sale.id}>
                  <td className="border px-2 py-1">{sale.id}</td>
                  <td className="border px-2 py-1">{sale.date}</td>
                  <td className="border px-2 py-1">{sale.productName}</td>
                  <td className="border px-2 py-1">${sale.amount}</td>
                  <td className="border px-2 py-1">${sale.commission}</td>
                  <td className="border px-2 py-1">{sale.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerSalesReports;
