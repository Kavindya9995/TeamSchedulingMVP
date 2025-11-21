// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import './EmployeeDashboard.css';

// function getUserFromToken() {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) return null;
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload;
//   } catch {
//     return null;
//   }
// }

// export default function EmployeeDashboard() {
//   const [shifts, setShifts] = useState([]);
//   const user = getUserFromToken();  // ⭐ get logged-in user info

//   useEffect(() => { load(); }, []);
  
//   async function load() {
//     setShifts(await api.shifts.list());
//   }

//   const clock = async (id, action) => {
//     await api.shifts.clock(id, action);
//     alert('OK');
//   };

//   return (
//     <div className="emp-container">
//       <h2 className="emp-title">Employee Dashboard</h2>

//       <h3 className="emp-subtitle">Your Shifts</h3>
      
//       <div className="shift-grid">
//         {shifts
//           .filter(s => s.assigned_user_id === user?.id)   // ⭐ SHOW ONLY EMPLOYEE'S SHIFTS
//           .map(s => (
//             <div className="shift-card" key={s.id}>
//               <h4 className="shift-title">{s.title}</h4>

//               <p className="shift-time">
//                 <strong>Start:</strong> {s.start}<br />
//                 <strong>End:</strong> {s.end}
//               </p>

//               <div className="shift-actions">
//                 <button className="clock-in" onClick={() => clock(s.id, 'in')}>Clock In</button>
//                 <button className="clock-out" onClick={() => clock(s.id, 'out')}>Clock Out</button>
//               </div>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import api from '../api';
import './EmployeeDashboard.css';

function getUserFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function EmployeeDashboard() {
  const [shifts, setShifts] = useState([]);
  const [timeEntries, setTimeEntries] = useState([]);
  const [activeShiftId, setActiveShiftId] = useState(null);
  const [timer, setTimer] = useState(0);
  const user = getUserFromToken();

  // Load shifts and time entries on mount
  useEffect(() => { load(); }, []);

  async function load() {
    const shiftsData = await api.shifts.list();
    setShifts(shiftsData);

    const timeData = await api.time.list();
    setTimeEntries(timeData);

    // Check if any shift is currently active
    const last = timeData.find(t => t.user_id === user?.id && !t.clock_out);
    if (last) {
      setActiveShiftId(last.shift_id);

      const pastSeconds = last.total_seconds || 0;
      const now = new Date();
      const clockIn = new Date(last.clock_in);
      const diff = Math.floor((now - clockIn) / 1000);

      setTimer(pastSeconds + diff);
    }
  }

  // Timer increment
  useEffect(() => {
    let interval;
    if (activeShiftId) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeShiftId]);

  const clock = async (shiftId, action) => {
    const res = await api.shifts.clock(shiftId, action); // backend updates total_seconds
    await load(); // refresh shifts and time entries after clock in/out

    if (action === 'in') {
      const entry = timeEntries.find(t => t.shift_id === shiftId && t.user_id === user.id);
      setTimer(entry?.total_seconds || 0);
      setActiveShiftId(shiftId);
    }

    if (action === 'out') {
      setActiveShiftId(null);
      setTimer(0);
    }
  };

  const getShiftSeconds = (shiftId) => {
    const entry = timeEntries.find(t => t.shift_id === shiftId && t.user_id === user.id);
    if (!entry) return 0;

    if (activeShiftId === shiftId) {
      return timer; // running timer
    } else {
      return entry.total_seconds || 0; // previous total
    }
  };

  const formatTime = (sec) => {
    if (typeof sec !== 'number' || isNaN(sec)) sec = 0;
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="emp-container">
      <h2 className="emp-title">Employee Dashboard</h2>
      <h3 className="emp-subtitle">Your Shifts</h3>

      <div className="shift-grid">
        {shifts
          .filter(s => s.assigned_user_id === user?.id)
          .map(s => (
            <div className="shift-card" key={s.id}>
              <h4 className="shift-title">{s.title}</h4>
              <p className="shift-time">
                <strong>Start:</strong> {s.start}<br />
                <strong>End:</strong> {s.end}
              </p>

              <p className="timer">Worked: {formatTime(getShiftSeconds(s.id))}</p>

              <div className="shift-actions">
                <button
                  className="clock-in"
                  onClick={() => clock(s.id, 'in')}
                  disabled={activeShiftId && activeShiftId !== s.id}
                >
                  Clock In
                </button>

                <button
                  className="clock-out"
                  onClick={() => clock(s.id, 'out')}
                  disabled={activeShiftId !== s.id}
                >
                  Clock Out
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
