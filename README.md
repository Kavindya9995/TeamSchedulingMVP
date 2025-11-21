# TeamSchedulingMVP
Team Management web App


**Structure**
- `/backend` — Node.js + Express backend using SQLite
- `/frontend` — React frontend (Create-React-App style)

**Features implemented**
- Company registration (creates company + manager user)
- Login (JWT)
- Manager can create users and shifts
- Employees see assigned shifts and can Clock In / Clock Out
- Simple role enforcement (manager vs employee)
- SQLite DB file stored in backend folder

**How to run (locally)**

1. Backend:
```bash
cd backend
npm install
# optional: set JWT_SECRET env var
node server.js
```
Server default: `http://localhost:4000`

2. Frontend:
```bash
cd frontend
npm install
npm start
```
Then open `http://localhost:3000` and register a company or login.

**Notes**
- This is a minimal demo to show architecture and workflows.
- Security, validation, and production hardening are intentionally minimal to keep the code short and readable.

**Included file**
- The original assignment PDF provided by the user: `/mnt/data/Assessment32.pdf`. fileciteturn0file0

