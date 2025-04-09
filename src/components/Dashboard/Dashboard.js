import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './Dashboard.css';
import Vnavbar from "../Vnavbar/Vnavbar";
import Navbar from "../Navbar/Navbar";

const Dashboard = () => {
  const pieData = [
    { name: 'Completed', value: 32, color: '#4CAF50' },
    { name: 'On Hold', value: 25, color: '#FF9800' },
    { name: 'On Progress', value: 25, color: '#2196F3' },
    { name: 'Pending', value: 18, color: '#F44336' },
  ];

  const donutData = [
    { name: 'Product 1', value: 20, color: '#FF6384' },
    { name: 'Product 2', value: 30, color: '#36A2EB' },
    { name: 'Product 3', value: 25, color: '#FFCE56' },
    { name: 'Product 4', value: 15, color: '#4BC0C0' },
    { name: 'Product 5', value: 10, color: '#9966FF' },
  ];

  const lineData = [
    { month: 'Oct 2021', achieved: 7, target: 5 },
    { month: 'Nov 2021', achieved: 6, target: 5 },
    { month: 'Dec 2021', achieved: 5, target: 6 },
    { month: 'Jan 2022', achieved: 8, target: 7 },
    { month: 'Feb 2022', achieved: 6, target: 8 },
    { month: 'Mar 2022', achieved: 7, target: 6 },
  ];

  return (
    <>
    <Navbar />
    <div className="main-layout">
      <Vnavbar />
    <div className="dashboard">
      {/* Projects Panel */}
      <div className="card projects-panel">
        <h2>Projects</h2>
        <div className="project-images">
  <img src="placeholder1.png" alt="Project 1" />
  <img src="placeholder2.png" alt="Project 2" />
  <img src="placeholder3.png" alt="Project 3" />
</div>
        <span className="file-count">52 files</span>
      </div>

      {/* Tasks Panel */}
      <div className="card tasks-panel">
        <h2>Tasks</h2>
        <PieChart width={200} height={200}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`pie-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <select className="dropdown">
          <option>This Week</option>
        </select>
      </div>

      {/* Work Log Panel (Donut Chart) */}
      <div className="card work-log-panel">
        <h2>Work Log</h2>
        <PieChart width={200} height={200}>
          <Pie
            data={donutData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            label
          >
            {donutData.map((entry, index) => (
              <Cell key={`donut-cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
        <select className="dropdown">
          <option>This Week</option>
        </select>
      </div>

      {/* Performance Panel */}
      <div className="card performance-panel">
        <h2>Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <Line type="monotone" dataKey="achieved" stroke="#FF0000" />
            <Line type="monotone" dataKey="target" stroke="#0000FF" />
            <Tooltip formatter={(value, name) => [`${value} Projects`, name]} />
          </LineChart>
        </ResponsiveContainer>
        <select className="dropdown">
          <option>This Week</option>
        </select>
      </div>
    </div>
    </div>
      </>
  );
};

export default Dashboard;
