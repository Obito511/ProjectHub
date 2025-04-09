import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./TaskBoard.css";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CommentIcon from "@mui/icons-material/Comment";
import SearchIcon from "@mui/icons-material/Search";
import Vnavbar from '../Vnavbar/Vnavbar';
import Navbar from '../Navbar/Navbar';
const TaskBoard = () => {
    const [view, setView] = useState("List View");

  const [columns, setColumns] = useState({
    backlog: [
      {
        id: "1",
        title: "Food Research",
        description:
          "Food design is required for our new project. Let's research the best practices.",
        days: 12,
        comments: 5,
        attachments: 8,
        users: ["A", "B", "C", "D"],
      },
      {
        id: "2",
        title: "Mockups",
        description: "Create a 1:2 mockups for mobile iPhone 13 pro max.",
        days: 12,
        comments: 3,
        attachments: 5,
        users: ["E", "F", "G"],
      },
    ],
    inProgress: [
      {
        id: "3",
        title: "User Interface",
        description: "Design new user interface design for food delivery app.",
        days: 12,
        comments: 2,
        attachments: 4,
        users: ["K", "L", "M", "N"],
      },
    ],
    completed: [
      {
        id: "4",
        title: "Mind Mapping",
        description:
          "Mind mapping for the food delivery app for targeting young users.",
        days: 12,
        comments: 7,
        attachments: 2,
        users: ["V", "W"],
      },
    ],
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;

    const updatedColumns = { ...columns };

    const [movedTask] = updatedColumns[sourceColumnId].splice(source.index, 1);

    updatedColumns[destColumnId].splice(destination.index, 0, movedTask);

    setColumns(updatedColumns);
  };

  return (
    <div className="App">
      <div className='div0'>
           <Navbar />
          
        <div className='div2'>
            <div className='div3'><Vnavbar/></div>
            <div className='div4'>
            <DragDropContext onDragEnd={onDragEnd}>
      <div className="task-board">
        <h2>Tasks</h2>
        <div className="tasks">
          <h3>Overview</h3>
          <p className="dashboard-subtitle">Edit or modify all cards as you want</p>
          <div className="dashboard-controls">
               
                <div className="search">
                    <SearchIcon className="search-icon" />
                    <input type="text" placeholder="Search Projects" className="search-input1" />
                </div>

            <select
            className="view-selector"
            value={view}
            onChange={(e) => setView(e.target.value)}
            >
            <option>List View</option>
            <option>Grid View</option>
            </select>
          </div>
          <hr></hr>
          <div className="columns">
            {Object.entries(columns).map(([columnId, tasks]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className="title">
                      <h3>{columnId.replace(/([A-Z])/g, " $1")}</h3>
                    </div>
                    <button className="add-btn"><AddIcon className="icon" /></button>
                    <div className="task-list">
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="task-card"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="drag-handle">
                                <h4>{task.title}</h4>
                                <span>{task.days} Days</span>
                              </div>
                              <p className="disc">{task.description}</p>
                              <div className="task-info">
                                <span>
                                  <CommentIcon className="icon" /> {task.comments}
                                </span>
                                <span>
                                  <FileUploadIcon className="icon" /> {task.attachments}
                                </span>
                                <div className="task-members">
                                  <button className="add-member">
                                    <AddIcon className="icon" />
                                  </button>
                                  {task.users.map((user, idx) => (
                                    <img
                                      key={idx}
                                      src={`https://i.pravatar.cc/32?img=${idx + 1}`}
                                      alt={`User ${idx}`}
                                      className="avatar"
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
            </div>
        </div>
      </div>
    </div>
  );
    
};

export default TaskBoard;
