import React, { useEffect, useState } from 'react';
import api from '../api';
import './ManagerDashboard.css';

export default function ManagerDashboard() {
  const [users, setUsers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ title: '', start: '', end: '', assigned_user_id: '' });

  useEffect(() => { load(); }, []);

  async function load() {
    setUsers(await api.users.list());
    setShifts(await api.shifts.list());
  }

  const createUser = async () => {
    const email = prompt('Email for new user (password default "changeme")');
    const name = prompt('Name for user');
    if (!email || !name) return;
    await api.users.create({ name, email, password: 'changeme', role: 'employee' });
    load();
  };

  const createShift = async (e) => {
    e.preventDefault();
    await api.shifts.create({ ...form, assigned_user_id: form.assigned_user_id || null });
    setForm({ title: '', start: '', end: '', assigned_user_id: '' });
    load();
  };

  return (
    <div className="mgr-container">
      <h2 className="mgr-title">Manager Dashboard</h2>

      {/* USERS TABLE */}
      <section className="mgr-section">
        <div className="section-header">
          <h3>Employees</h3>
          <button className="add-btn" onClick={createUser}>+ Add Employee</button>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* CREATE SHIFT */}
      <section className="mgr-section">
        <h3>Create Shift</h3>

        <form className="shift-form" onSubmit={createShift}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          {/* <input 
            placeholder="Start (YYYY-MM-DD HH:MM)"
            value={form.start}
            onChange={e => setForm({...form, start:e.target.value})}
          />
          <input 
            placeholder="End (YYYY-MM-DD HH:MM)"
            value={form.end}
            onChange={e => setForm({...form, end:e.target.value})}
          /> */}
          <input
            type="datetime-local"
            value={form.start}
            onChange={e => setForm({ ...form, start: e.target.value })}
          />

          <input
            type="datetime-local"
            value={form.end}
            onChange={e => setForm({ ...form, end: e.target.value })}
          />

          <select
            value={form.assigned_user_id}
            onChange={e => setForm({ ...form, assigned_user_id: e.target.value })}
          >
            <option value="">Unassigned</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <button type="submit" className="create-btn">Create</button>
        </form>
      </section>


      {/* SHIFTS TABLE */}
      <section className="mgr-section">
        <h3>Shifts</h3>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Start</th>
              <th>End</th>
              <th>Assigned Employee</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map(s => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.start}</td>
                <td>{s.end}</td>
                <td>{s.assigned_user_id
                  ? users.find(u => u.id === s.assigned_user_id)?.name || "Unknown"
                  : "—"
                }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
