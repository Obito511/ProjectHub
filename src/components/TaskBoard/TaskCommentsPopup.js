import React, { useState, useEffect, useRef } from "react";
import "./TaskCommentsPopup.css";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const TaskCommentsPopup = ({ isOpen, onClose, taskId, taskTitle }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Connect to WebSocket when component mounts and disconnect when unmounted
  useEffect(() => {
    if (isOpen && taskId) {
      connectWebSocket();
      fetchComments();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [isOpen, taskId]);

  // Connect to WebSocket server
  const connectWebSocket = () => {
    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:9090/ws");
    const client = Stomp.over(socket);
    
    // Disable debug logs in production
    if (process.env.NODE_ENV === "production") {
      client.debug = null;
    }

    const headers = {
      Authorization: `Bearer ${token}`
    };

    client.connect(
      headers,
      () => {
        console.log("WebSocket connected");
        setConnected(true);
        stompClientRef.current = client;
        
        // Subscribe to comment updates for this specific task
        subscriptionRef.current = client.subscribe(
          `/topic/comments/${taskId}`,
          (message) => {
            const data = JSON.parse(message.body);
            handleWebSocketMessage(data);
          }
        );
      },
      (error) => {
        console.error("STOMP error:", error);
        setError("Connection error. Comments may not update in real-time.");
        setConnected(false);
      }
    );
  };

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (message) => {
    const { type, payload } = message;
  
    switch (type) {
      case "COMMENT_CREATED":
        setComments((prev) => {
          // Find optimistic comment by checking if id is a string and starts with "temp-"
          const tempComment = prev.find(
            (comment) =>
              comment.id &&
              typeof comment.id === "string" &&
              comment.id.startsWith("temp-")
          );
  
          // If an optimistic comment exists and its content matches, replace it
          if (tempComment && tempComment.content === payload.content) {
            return prev.map((comment) =>
              comment.id === tempComment.id ? payload : comment
            );
          }
  
          // Skip if comment already exists (check payload.id as string or number)
          if (
            prev.some((comment) =>
              comment.id
                ? String(comment.id) === String(payload.id)
                : false
            )
          ) {
            return prev;
          }
  
          // Add new comment
          return [...prev, payload];
        });
        break;
  
      case "COMMENT_UPDATED":
        setComments((prev) =>
          prev.map((comment) =>
            String(comment.id) === String(payload.id) ? payload : comment
          )
        );
        break;
  
      case "COMMENT_DELETED":
        setComments((prev) =>
          prev.filter((comment) => String(comment.id) !== String(payload))
        );
        break;
  
      default:
        console.log("Unknown message type:", type);
    }
  };

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      stompClientRef.current = null;
      setConnected(false);
    }
  };

  // Initial fetch of comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:9090/api/comments/task/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setComments(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit a new comment
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    const tempId = `temp-${Date.now()}`; // Generate temporary ID
    const optimisticComment = {
      id: tempId,
      content: newComment,
      taskId: taskId,
      createdAt: new Date().toISOString(),
      user: { /* Mock user data if needed */ }
    };
  
    // Add optimistic comment
    setComments(prev => [...prev, optimisticComment]);
    setNewComment("");
  
    try {
      if (connected && stompClientRef.current) {
        stompClientRef.current.send(
          `/app/comments/create/${taskId}`,
          {},
          JSON.stringify({ content: newComment, taskId: taskId })
        );
      } else {
        const response = await axios.post(
          "http://localhost:9090/api/comments",
          {
            content: newComment,
            taskId: taskId
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        // Replace optimistic comment with real one
        setComments(prev =>
          prev.map(comment =>
            comment.id === tempId ? response.data : comment
          )
        );
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
      // Remove optimistic comment on error
      setComments(prev => prev.filter(comment => comment.id !== tempId));
    }
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="comments-popup-overlay">
      <div className="comments-popup">
        <div className="comments-popup-header">
          <h3>Comments for "{taskTitle}"</h3>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        {!connected && (
          <div className="connection-status">
            <span className="connection-error">● Not connected in real-time</span>
          </div>
        )}
        
        <div className="comments-container">
          {loading ? (
            <div className="loading-message">Loading comments...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : comments.length === 0 ? (
            <div className="no-comments">No comments yet</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <div className="comment-user">
                    <img 
                      src={comment.user?.profilePicture || "/placeholder.jpg"}
                      alt={`${comment.user?.first_name || ''} ${comment.user?.last_name || ''}`}
                      className="user-avatar"
                    />
                    <span className="user-name">
                      {comment.user ? 
                        `${comment.user.first_name} ${comment.user.last_name}` : 
                        'User'
                      }
                    </span>
                  </div>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
              </div>
            ))
          )}
        </div>
        
        <form className="comment-form" onSubmit={handleSubmitComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="send-comment-btn">
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCommentsPopup;