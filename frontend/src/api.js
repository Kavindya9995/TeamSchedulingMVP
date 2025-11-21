import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api' });
export default {
  setToken: (t) => { API.defaults.headers.common['Authorization'] = t ? `Bearer ${t}` : ''; },
  register: (body) => API.post('/auth/register', body).then(r=>r.data),
  login: (body) => API.post('/auth/login', body).then(r=>r.data),
  users: {
    list: () => API.get('/users').then(r=>r.data),
    create: (b) => API.post('/users', b).then(r=>r.data)
  },
  shifts: {
    list: () => API.get('/shifts').then(r=>r.data),
    create: (b) => API.post('/shifts', b).then(r=>r.data),
    clock: (id, action) => API.post(`/shifts/${id}/clock`, { action }).then(r=>r.data)
  },
  companies: {
    me: () => API.get('/companies/me').then(r=>r.data)
  },
  time: {
  list: () => API.get('/time').then(r => r.data)
}
};
