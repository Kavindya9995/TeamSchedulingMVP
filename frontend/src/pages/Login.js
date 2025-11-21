import React, {useState} from 'react';
import api from '../api';

export default function Login({onLogin}){
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'', companyName:''});
  const [error, setError] = useState('');

  const handle = (e) => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        const data = await api.login({ email: form.email, password: form.password });
        onLogin(data.token, data.role);
      } else {
        const data = await api.register({
          companyName: form.companyName,
          name: form.name,
          email: form.email,
          password: form.password
        });
        onLogin(data.token, 'manager');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
  <div className="login-wrapper">
    <div className="login-card">
      <h2>{mode==='login' ? 'Login' : 'Register Company'}</h2>

      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={submit}>
        {mode==='register' && <>
          <input name="companyName" placeholder="Company name" onChange={handle} value={form.companyName}/>
          <input name="name" placeholder="Your name" onChange={handle} value={form.name}/>
        </>}

        <input name="email" placeholder="Email" onChange={handle} value={form.email}/>
        <input name="password" type="password" placeholder="Password" onChange={handle} value={form.password}/>

        <button type="submit">Submit</button>
      </form>

      <p>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          Switch to {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  </div>
);

}
