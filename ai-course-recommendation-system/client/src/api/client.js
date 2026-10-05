import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('eduai_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      // Don't auto-redirect if on login or public view
      if (!window.location.pathname.includes('login')) {
        // optionally handle auth expiration
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email })
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getAllUsers: () => api.get('/users/all')
};

export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  importCsv: (csvData) => api.post('/courses/import-csv', { csvData })
};

export const recommendationAPI = {
  getRecommendations: () => api.get('/recommendations'),
  sendFeedback: (courseId, action) => api.post('/recommendations/feedback', { courseId, action }),
  getMetrics: () => api.get('/recommendations/metrics')
};

export const skillAPI = {
  getSkillGap: (careerTitle) => api.get('/skills/gap', { params: { careerTitle } }),
  calculateCustomGap: (userSkills, careerTitle) => api.post('/skills/gap', { userSkills, careerTitle })
};

export const roadmapAPI = {
  getRoadmap: () => api.get('/roadmaps'),
  generateRoadmap: (careerGoal) => api.post('/roadmaps', { careerGoal }),
  updateStep: (stepNumber, status, isCompleted) => api.patch(`/roadmaps/step/${stepNumber}`, { status, isCompleted })
};

export const enrollmentAPI = {
  getEnrollments: () => api.get('/enrollments'),
  enroll: (courseId, status = 'in_progress', targetDate, notes) => api.post('/enrollments', { courseId, status, targetDate, notes }),
  updateProgress: (id, data) => api.patch(`/enrollments/${id}`, data),
  removeEnrollment: (id) => api.delete(`/enrollments/${id}`)
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics')
};

export const assistantAPI = {
  sendMessage: (message) => api.post('/assistant/chat', { message }),
  getHistory: () => api.get('/assistant/history'),
  clearHistory: () => api.delete('/assistant/history')
};

export const careerAPI = {
  getCareers: () => api.get('/careers'),
  getCareer: (title) => api.get(`/careers/${title}`)
};

export default api;
