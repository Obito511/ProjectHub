import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import commentWebSocketService from './commentWebSocketService';

/**
 * Custom hook for handling comments with WebSocket real-time updates
 * @param {number} taskId - The task ID to get comments for
 * @param {string} token - JWT authentication token
 * @returns {Object} Comments data and functions
 */
const useComments = (taskId, token) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch initial comments
  const fetchComments = useCallback(async () => {
    if (!taskId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/comments/task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments(response.data);
      console.log ("commmments " + response.data);
      setCommentCount(response.data.length);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err.message || 'Failed to fetch comments');
      setLoading(false);
    }
  }, [taskId, token]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message) => {
    const { type, payload } = message;
    
    switch (type) {
      case "COMMENT_CREATED":
        setComments(prev => {
          // Check if comment already exists
          if (prev.some(comment => comment.id === payload.id)) {
            return prev; // Skip adding duplicate
          }
          return [...prev, payload];
        });
        break;
      case "COMMENT_UPDATED":
        setComments(prev => 
          prev.map(comment => comment.id === payload.id ? payload : comment)
        );
        break;
      case "COMMENT_DELETED":
        setComments(prev => 
          prev.filter(comment => comment.id !== payload)
        );
        break;
      default:
        console.log("Unknown message type:", type);
    }
  };
  // Add a new comment
  const addComment = useCallback((commentText) => {
    const newComment = {
      taskId,
      content: commentText,
      // Other fields will be set by the server
    };
    
    // Use WebSocket to send the comment
    commentWebSocketService.sendComment(taskId, newComment);
  }, [taskId]);

  // Update a comment
  const updateComment = useCallback((commentId, commentText) => {
    const updatedComment = {
      id: commentId,
      taskId,
      content: commentText,
    };
    
    // Use WebSocket to update the comment
    commentWebSocketService.updateComment(taskId, commentId, updatedComment);
  }, [taskId]);

  // Delete a comment
  const deleteComment = useCallback((commentId) => {
    // Use WebSocket to delete the comment
    commentWebSocketService.deleteComment(taskId, commentId);
  }, [taskId]);

  // Connect to WebSocket and subscribe to comments
  useEffect(() => {
    if (!taskId || !token) return;

    // Connect to WebSocket and subscribe to task comments
    const setupWebSocket = async () => {
      try {
        await commentWebSocketService.connect(token);
        commentWebSocketService.subscribeToTaskComments(taskId, handleWebSocketMessage);
      } catch (err) {
        console.error('WebSocket connection error:', err);
        setError('Failed to establish real-time connection');
      }
    };

    setupWebSocket();
    fetchComments();

    // Cleanup function
    return () => {
      commentWebSocketService.unsubscribeFromTaskComments(taskId);
    };
  }, [taskId, token, fetchComments, handleWebSocketMessage]);

  return {
    comments,
    loading,
    error,
    commentCount,
    addComment,
    updateComment,
    deleteComment,
    refreshComments: fetchComments
  };
};

export default useComments;