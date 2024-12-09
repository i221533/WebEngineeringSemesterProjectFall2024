import React from "react";
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const pieData = [
  { name: "Pending", value: 40 },
  { name: "Shipped", value: 30 },
  { name: "Delivered", value: 20 },
  { name: "Canceled", value: 10 },
];
const pieColors = ["#FFBB28", "#FF8042", "#0088FE", "#00C49F"];

const lineData = [
  { month: "Jan", sales: 4000, traffic: 2400 },
  { month: "Feb", sales: 3000, traffic: 1398 },
  { month: "Mar", sales: 2000, traffic: 9800 },
  { month: "Apr", sales: 2780, traffic: 3908 },
  { month: "May", sales: 1890, traffic: 4800 },
  { month: "Jun", sales: 2390, traffic: 3800 },
  { month: "Jul", sales: 3490, traffic: 4300 },
];

const kpiData = [
  { label: "Total Sales", value: "$5000" },
  { label: "Total Orders", value: "200" },
  { label: "Active Users", value: "120" },
  { label: "Inventory Value", value: "$20,000" },
];

const recentOrders = [
  { id: 1, customer: "John Doe", date: "2024-12-01", status: "Pending", total: "$150" },
  { id: 2, customer: "Jane Smith", date: "2024-12-02", status: "Shipped", total: "$200" },
  { id: 3, customer: "Mike Johnson", date: "2024-12-03", status: "Delivered", total: "$75" },
  { id: 4, customer: "Emily Davis", date: "2024-12-04", status: "Canceled", total: "$50" },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-bold">{kpi.label}</h2>
            <p className="text-2xl text-gray-700">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Line Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Sales and Traffic Trends</h3>
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            <Line type="monotone" dataKey="traffic" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">Order ID</th>
              <th className="py-2 px-4 border">Customer</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-2 px-4 border">{order.id}</td>
                <td className="py-2 px-4 border">{order.customer}</td>
                <td className="py-2 px-4 border">{order.date}</td>
                <td className="py-2 px-4 border">{order.status}</td>
                <td className="py-2 px-4 border">{order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
