// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', 
});

export const fetchTasks = () => api.get('/tasks');
export const addTask = (taskData) => api.post('/tasks', taskData);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);
export const getHelperEmail = () => api.get('/helperEmail');

export default api;