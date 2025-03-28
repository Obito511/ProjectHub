import React from "react";
import { Card, CardContent, CardActions, Typography, Button, IconButton, Avatar, Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import "./Task.css";

const tasks = [
  {
    id: "#402235",
    title: "Make an Automatic Payment System that enables the design",
    opened: "10 days ago",
    user: "Yash Gheri",
    status: "Completed",
    priority: "low",
    time: "00:30:00",
    subtasks: [
      {
        id: "#402236",
        title: "Make an Automatic Payment System that enables the design",
        time: "00:30:00",
        status: "Completed",
        priority: "low",
        user: "Yash Gheri",
      },
      {
        id: "#402237",
        title: "Make an Automatic Payment System that enables the design",
        time: "00:30:00",
        status: "Completed",
        priority: "low",
        user: "Yash Gheri",
      },
    ],
  },
];

const TaskList = () => {
  return (
    <Box className="task-container">
      {/* Header Section */}
      <Box className="task-header">
        <Typography variant="h6">Task / Make an Automatic Payment System that enables the design</Typography>
        <Button 
    variant="contained" 
    color="primary"
    size="small"
    sx={{ 
      padding: '2px 8px',
      fontSize: '0.75rem',
      width:'120px',
      Height: '100px',
      textTransform: 'none',
      '& .MuiButton-label': {
        gap: '4px'
      }
    }}
  >
    Assign Sub Task
  </Button>
    
      </Box>

      {/* Main Task Card */}
      <Box className="task-content">
        {tasks.map((task, index) => (
          <Card key={index} className="task-item">
            <Box className="task-header-row">
              <Box>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2">
                  {task.id} Opened {task.opened} by <strong>{task.user}</strong>
                </Typography>
              </Box>
              <Box className="time-badge">
                {task.time}
              </Box>
            </Box>

            <Box className="status-priority-row">
              <span className="status-badge">{task.status}</span>
              <span className="priority-badge">{task.priority}</span>
            </Box>

            {/* Subtasks Section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <Box className="subtask-container">
                {task.subtasks.map((subtask, subIndex) => (
                  <Card key={subIndex} className="subtask-item">
                    <Box className="subtask-card-wrapper">
                      <Box className="subtask-content">
                        <Box className="subtask-header-row">
                          <Typography variant="body2">{subtask.id}</Typography>
                          <Box className="time-badge">
                            {subtask.time}
                          </Box>
                        </Box>
                        <Typography variant="body2">{subtask.title}</Typography>
                        <Box className="status-priority-row">
                          <span className="status-badge">{subtask.status}</span>
                          <span className="priority-badge">{subtask.priority}</span>
                        </Box>
                      </Box>

                      {/* Avatar and Message Icon */}
                      <CardActions className="subtask-actions">
                        <Avatar 
                          alt={subtask.user} 
                          src="https://via.placeholder.com/30" 
                          sx={{ width: 24, height: 24 }} 
                        />
                        <IconButton color="primary" size="small">
                          <ChatBubbleOutlineIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Box>
                  </Card>
                ))}
              </Box>
            )}
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TaskList;