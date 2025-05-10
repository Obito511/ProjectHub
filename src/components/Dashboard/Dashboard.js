import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from 'recharts';
import './Dashboard.css';
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from '../Navbar/Navbar';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects for the current user
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    fetch('http://localhost:9090/api/projects/member/my-projects', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error fetching projects: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        if (data.length > 0) {
          setSelectedProjectId(data[0].idprojet);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Fetch tasks for the selected project
  useEffect(() => {
    if (selectedProjectId) {
      const token = localStorage.getItem('token');
      setLoading(true);
      
      fetch(`http://localhost:9090/api/tasks/project/${selectedProjectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error fetching tasks: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setTasks(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setError('Failed to load tasks. Please try again later.');
          setLoading(false);
        });
    }
  }, [selectedProjectId]);

  // Process tasks for status pie chart
  useEffect(() => {
    if (tasks.length > 0) {
      const statusCount = tasks.reduce((acc, task) => {
        const status = task.statusName || 'Unassigned';
        console.log("taskkkkkkk ::   "+task.statusName);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statusColors = {
        'Completed': '#4CAF50',
        'Done': '#4CAF50',
        'On Hold': '#FF9800',
        'In Progress': '#2196F3',
        'On Progress': '#2196F3',
        'Pending': '#F44336',
        'To Do': '#F44336',
        'Unassigned': '#CCCCCC',
      };

      const newStatusData = Object.keys(statusCount).map((status) => ({
        name: status,
        value: statusCount[status],
        color: statusColors[status] || '#9C27B0',
      }));

      setStatusData(newStatusData);
    } else {
      setStatusData([]);
    }
  }, [tasks]);

  // Process tasks for type donut chart
  useEffect(() => {
    if (tasks.length > 0) {
      const typeCount = tasks.reduce((acc, task) => {
        const type = task.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const typeColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC249', '#EA80FC'
      ];

      const newTypeData = Object.keys(typeCount).map((type, index) => ({
        name: type,
        value: typeCount[type],
        color: typeColors[index % typeColors.length],
      }));

      setTypeData(newTypeData);
    } else {
      setTypeData([]);
    }
  }, [tasks]);

  // Process tasks for priority breakdown
  useEffect(() => {
    if (tasks.length > 0) {
      const priorityCount = tasks.reduce((acc, task) => {
        const priority = task.priority?.name || 'Not Set';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {});

      const priorityColors = {
        'High': '#F44336',
        'Critical': '#D32F2F',
        'Medium': '#FF9800',
        'Normal': '#FFC107',
        'Low': '#4CAF50',
        'Not Set': '#9E9E9E',
      };

      const newPriorityData = Object.keys(priorityCount).map((priority) => ({
        name: priority,
        value: priorityCount[priority],
        color: priorityColors[priority] || '#9E9E9E',
      }));

      setPriorityData(newPriorityData);
    } else {
      setPriorityData([]);
    }
  }, [tasks]);

  // Generate task progress data (completed vs. remaining tasks over time)
  useEffect(() => {
    if (tasks.length > 0) {
      // Get current date and calculate dates for last 6 months
      const currentDate = new Date();
      const months = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date();
        monthDate.setMonth(currentDate.getMonth() - i);
        const monthLabel = monthDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        months.push(monthLabel);
      }

      // For each month, calculate tasks that were created and completed
      const progressDataByMonth = months.map(month => {
        // Simulate data since we don't have historical data
        // In a real app, you would use actual creation and completion dates
        const completed = Math.floor(Math.random() * (tasks.length / 2)) + 1;
        const pending = Math.floor(Math.random() * tasks.length) + 1;
        
        return {
          month,
          completed,
          pending
        };
      });

      setProgressData(progressDataByMonth);
    } else {
      // Default empty data
      setProgressData([]);
    }
  }, [tasks]);

  // Handle project selection
  const handleProjectChange = (event) => {
    setSelectedProjectId(Number(event.target.value));
  };

  // Handle filter changes
  const handleFilterChange = (event, chartType) => {
    // In a real application, you would filter data based on time period
    console.log(`Filter changed for ${chartType}: ${event.target.value}`);
    // For now, just log the change
  };

  return (
    <div className="div0">
      <Navbar />
      <div className="div2">
        <div className="div3">
          <Vnavbar />
        </div>
        <div className="div4">
          {/* Project Selector */}
          <div className="project-selector">
            <label htmlFor="project-select">Select Project</label>
            <div className="custom-select-wrapper">
              <select
                id="project-select"
                value={selectedProjectId || ''}
                onChange={handleProjectChange}
                disabled={loading || projects.length === 0}
              >
                {loading ? (
                  <option>Loading...</option>
                ) : projects.length === 0 ? (
                  <option>No projects available</option>
                ) : (
                  projects.map((project) => (
                    <option key={project.idprojet} value={project.idprojet}>
                      {project.nom}
                    </option>
                  ))
                )}
              </select>
              <span className="custom-arrow"></span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="dashboard-grid">
            {/* Projects Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Projects</h2>
                <p className="card-subtitle">Recent project activities</p>
              </div>
              <div className="card-content">
                <div className="project-gallery">
                  {projects.slice(0, 3).map((project, index) => (
                    <div key={project.idprojet} className="project-card1">
                      <img
                        className="project-image"
                        src="proj.png"
                        alt={project.nom}
                      />
                      <div className="project-name">{project.nom}</div>
                    </div>
                  ))}
                </div>
                <span className="file-count">{projects.length} projects</span>
                {selectedProjectId && projects.find(p => p.idprojet === selectedProjectId) && (
                  <div className="selected-project-info">
                    <h3>{projects.find(p => p.idprojet === selectedProjectId).nom}</h3>
                    <p>{projects.find(p => p.idprojet === selectedProjectId).description || 'No description available'}</p>
                  </div>
                )}
              </div>
              <div className="card-footer">
                <select 
                  className="time-filter" 
                  onChange={(e) => handleFilterChange(e, 'projects')}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>

            {/* Tasks Status Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Task Status</h2>
                <p className="card-subtitle">Task completion status</p>
              </div>
              <div className="card-content">
                <div className="chart-container">
                  {loading ? (
                    <div className="loading">Loading chart data...</div>
                  ) : statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`status-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} Tasks`, name]}
                        />
                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="no-data">No tasks available for this project</div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <select 
                  className="time-filter"
                  onChange={(e) => handleFilterChange(e, 'status')}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>

            {/* Task Types Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Task Types</h2>
                <p className="card-subtitle">Task type breakdown</p>
              </div>
              <div className="card-content">
                <div className="chart-container">
                  {loading ? (
                    <div className="loading">Loading chart data...</div>
                  ) : typeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={typeData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          label
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`type-cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} Tasks`, name]}
                        />
                        <Legend layout="vertical" verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="no-data">No tasks available for this project</div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <select 
                  className="time-filter"
                  onChange={(e) => handleFilterChange(e, 'types')}
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                </select>
              </div>
            </div>

            {/* Performance Card */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2 className="card-title">Performance</h2>
                <p className="card-subtitle">Task completion over time</p>
              </div>
              <div className="card-content">
                {loading ? (
                  <div className="loading">Loading chart data...</div>
                ) : progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        name="Completed Tasks"
                        stroke="#4318FF"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="pending"
                        name="Pending Tasks"
                        stroke="#6AD2FF"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="no-data">No performance data available</div>
                )}
              </div>
              <div className="card-footer">
                <select 
                  className="time-filter"
                  onChange={(e) => handleFilterChange(e, 'performance')}
                >
                  <option value="month">Last 6 Months</option>
                  <option value="quarter">Last Year</option>
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