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
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3"><Vnavbar /></div>
        <div className="div4">
          <div className="dashboard-grid">
            {/* Projects Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Projects</h2>
                <p className="card-subtitle">Recent project activities</p>
              </div>
              <div className="card-content">
                <div className="project-gallery">
                  <img className="project-image" src="placeholder1.png" alt="Project 1" />
                  <img className="project-image" src="placeholder2.png" alt="Project 2" />
                  <img className="project-image" src="placeholder3.png" alt="Project 3" />
                </div>
                <span className="file-count">52 files</span>
              </div>
              <div className="card-footer">
                <select className="time-filter">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
            </div>

            {/* Tasks Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Tasks</h2>
                <p className="card-subtitle">Task completion status</p>
              </div>
              <div className="card-content">
                <div className="chart-container">
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
                </div>
              </div>
              <div className="card-footer">
                <select className="time-filter">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
            </div>

            {/* Work Log Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Work Log</h2>
                <p className="card-subtitle">Product development breakdown</p>
              </div>
              <div className="card-content">
                <div className="chart-container">
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
                </div>
              </div>
              <div className="card-footer">
                <select className="time-filter">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
            </div>

            {/* Performance Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Performance</h2>
                <p className="card-subtitle">Target vs achievement</p>
              </div>
              <div className="card-content">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData}>
                    <Line 
                      type="monotone" 
                      dataKey="achieved" 
                      stroke="#4318FF" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#6AD2FF" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                    />
                    <Tooltip formatter={(value, name) => [`${value} Projects`, name === "achieved" ? "Achieved" : "Target"]} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="card-footer">
                <select className="time-filter">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Quarter</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;