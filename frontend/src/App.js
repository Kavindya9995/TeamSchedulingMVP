import React, {useState, useEffect} from 'react';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import api from './api';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(()=>{
    if (token) api.setToken(token);
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    api.setToken(null);
  };

  if (!token) return <Login onLogin={(t, r)=>{ 
      setToken(t); 
      setRole(r); 
      localStorage.setItem('token', t); 
      localStorage.setItem('role', r); 
      api.setToken(t); 
    }} 
  />;

  return (
    <div className="app">
      <header>
        <h1>Team Scheduling MVP</h1>
        <button onClick={logout}>Logout</button>
      </header>

      {role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />}
    </div>
  );
}


export default App;
