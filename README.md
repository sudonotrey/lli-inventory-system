# LLI Pharmaceutical Inventory System

A pharmaceutical inventory management system built with React.js, Ant Design, Express.js, and Microsoft SQL Server (MSSQL).

---

## Tech Stack

**Frontend**
- React.js (Vite)
- Ant Design
- Axios
- React Router DOM
- Zustand
- Day.js

**Backend**
- Express.js
- MSSQL (`mssql` npm package)
- JSON Web Token (JWT)
- bcryptjs

**Database**
- Microsoft SQL Server (MSSQL) — SQL Server Express Edition

---

## Prerequisites

Make sure you have the following installed before running the application:

- Node.js v18 or higher — https://nodejs.org
- npm v9 or higher (comes with Node.js)
- SQL Server Express — https://www.microsoft.com/en-us/sql-server/sql-server-downloads
- SQL Server Management Studio (SSMS) — https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms

---

## Project Structure

```
lli-inventory-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── database.sql
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── category.controller.js
│   │   │   ├── supplier.controller.js
│   │   │   ├── unit.controller.js
│   │   │   ├── product.controller.js
│   │   │   └── report.controller.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── category.routes.js
│   │   │   ├── supplier.routes.js
│   │   │   ├── unit.routes.js
│   │   │   ├── product.routes.js
│   │   │   └── report.routes.js
│   │   └── app.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── MainLayout.jsx
    │   │   └── AdminRoute.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── CategoriesPage.jsx
    │   │   ├── SuppliersPage.jsx
    │   │   ├── UnitsPage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   └── ReportsPage.jsx
    │   ├── store/
    │   │   └── authStore.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Step-by-Step Setup Guide

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sudonotrey/lli-inventory-system.git

cd lli-inventory-system
```

---

### Step 2 — Configure SQL Server

**2.1 — Enable TCP/IP**

1. Open **SQL Server Configuration Manager**
   - Press `Win + R` → type `SQLServerManager16.msc` → Enter
2. Go to **SQL Server Network Configuration** → **Protocols for SQLEXPRESS**
3. Right-click **TCP/IP** → **Enable**
4. Right-click **TCP/IP** → **Properties** → **IP Addresses** tab → scroll to **IPAll**:
   - Set **TCP Port** to `1433`
   - Clear **TCP Dynamic Ports** (leave it empty)
5. Click OK

**2.2 — Start Required Services**

1. Press `Win + R` → type `services.msc` → Enter
2. Find **SQL Server (SQLEXPRESS)** → right-click → **Start**
3. Find **SQL Server Browser** → right-click → **Start**
4. Set both to **Automatic** startup (right-click → Properties → Startup type)

**2.3 — Enable SQL Server Authentication**

1. Open **SSMS** → connect to `DESKTOP-YOUR-PC\SQLEXPRESS`
2. Right-click your server → **Properties** → **Security**
3. Select **SQL Server and Windows Authentication mode**
4. Click OK
5. Restart SQL Server service in SQL Server Configuration Manager

**2.4 — Allow Port 1433 in Firewall**

Open **PowerShell as Administrator** and run:

```powershell
netsh advfirewall firewall add rule name="SQL Server 1433" protocol=TCP dir=in localport=1433 action=allow
netsh advfirewall firewall add rule name="SQL Browser 1434" protocol=UDP dir=in localport=1434 action=allow
```

---

### Step 3 — Create the Database

**3.1 — Open SSMS and connect to your SQL Server instance**

**3.2 — Generate the bcrypt hash for the admin password**

Open a terminal and run:

```bash
node -e "require('bcryptjs').hash('admin123', 10).then(console.log)"
```

Copy the output hash.

**3.3 — Run the SQL script**

1. Open `backend/src/config/database.sql` in SSMS
2. Replace `REPLACE_WITH_BCRYPT_HASH` with the hash you copied in 3.2
3. Click **Execute (F5)**

This will create the `lli_inventoryDB` database with all tables and seed data.

---

### Step 4 — Configure the Backend

**4.1 — Navigate to the backend folder**

```bash
cd backend
```

**4.2 — Install dependencies**

```bash
npm install
```

**4.3 — Configure environment variables**

Open `.env` and update with your actual SQL Server credentials:

```env
PORT=5000
DB_SERVER=YOUR-PC-NAME
DB_NAME=lli_inventoryDB
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
JWT_SECRET=your_jwt_secret_key
```

> Replace `YOUR-PC-NAME` with your actual computer name (e.g. `DESKTOP-KF1772L`).
> You can find your PC name by running `hostname` in the terminal.

**4.4 — Update db.js with your instance name**

In `src/config/db.js`, confirm these values match your setup:

```js
const config = {
  server: 'YOUR-PC-NAME',      // e.g. DESKTOP-KF1772L
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    instanceName: 'SQLEXPRESS', // your SQL Server instance name
    encrypt: false,
    trustServerCertificate: true,
  },
  port: 1433,
}
```

**4.5 — Start the backend server**

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ Connected to MSSQL
```

---

### Step 5 — Configure and Run the Frontend

Open a **new terminal** window:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

---

### Step 6 — Open the Application

Open your browser and go to:
```
http://localhost:3000
```

Login with the default admin credentials:
```
Username: admin
Password: admin123
```

---

## Testing the API (Postman)

Import and test these endpoints manually. All endpoints except login and logout require the `Authorization: Bearer <token>` header.

### Auth
```
POST   http://localhost:5000/api/auth/login
POST   http://localhost:5000/api/auth/logout
```

### Categories
```
GET    http://localhost:5000/api/categories
GET    http://localhost:5000/api/categories/:id
POST   http://localhost:5000/api/categories
PUT    http://localhost:5000/api/categories/:id
DELETE http://localhost:5000/api/categories/:id
```

### Suppliers
```
GET    http://localhost:5000/api/suppliers
GET    http://localhost:5000/api/suppliers/:id
POST   http://localhost:5000/api/suppliers
PUT    http://localhost:5000/api/suppliers/:id
DELETE http://localhost:5000/api/suppliers/:id
```

### Units
```
GET    http://localhost:5000/api/units
GET    http://localhost:5000/api/units/:id
POST   http://localhost:5000/api/units
PUT    http://localhost:5000/api/units/:id
DELETE http://localhost:5000/api/units/:id
```

### Products
```
GET    http://localhost:5000/api/products
GET    http://localhost:5000/api/products/:id
POST   http://localhost:5000/api/products
PUT    http://localhost:5000/api/products/:id
DELETE http://localhost:5000/api/products/:id
```

### Reports
```
GET    http://localhost:5000/api/reports/inventory-summary
GET    http://localhost:5000/api/reports/low-stock
GET    http://localhost:5000/api/reports/expiry
```

---

## Default Credentials

| Username | Password | Role  |
|----------|----------|-------|
| admin    | admin123 | admin |

---

## Challenges Encountered During Development

### 1. MSSQL — A New Database for Me

This was my first time working with Microsoft SQL Server. Coming from other databases, there were several key differences I had to learn:

- **T-SQL syntax** is different from standard SQL. For example, `GETDATE()` instead of `NOW()`, `IDENTITY(1,1)` instead of `AUTO_INCREMENT`, `NVARCHAR` instead of `VARCHAR` for Unicode support, and `GO` as a batch separator.
- **SQL Server instances** — MSSQL uses named instances like `DESKTOP-PC\SQLEXPRESS` instead of just a host and port. This caused the initial connection timeout (`ETIMEOUT`) because the `mssql` Node.js package requires the server name and instance name to be configured separately in `db.js`.
- **Authentication modes** — By default, SQL Server only allows Windows Authentication. I had to manually enable **SQL Server and Windows Authentication mode** in SSMS server properties and restart the service before SQL login credentials would work.
- **TCP/IP is disabled by default** — Unlike MySQL or PostgreSQL which listen on a port out of the box, SQL Server Express has TCP/IP disabled by default. I had to enable it in **SQL Server Configuration Manager**, set port 1433 manually under IPAll, and open the port in Windows Firewall.
- **SQL Server Browser service** — This service is required for named instances to be discoverable on the network. It was stopped by default and had to be started and set to automatic startup.
- **Parameterized queries** — The `mssql` package uses `.input('param', sql.DataType, value)` for parameterized queries instead of the `?` placeholder style used in MySQL. This is actually safer against SQL injection but required learning a new API.

### 2. JWT Stateless Logout

Since JWT is stateless, the server cannot truly invalidate a token on logout. The current implementation handles this by having the client discard the token. In a production system, a token blacklist or short expiry with refresh tokens would be the proper solution.

### 3. Separating Server and Instance Name in `mssql`

The biggest initial blocker was the `ETIMEOUT` connection error. The root cause was passing `DESKTOP-PC\SQLEXPRESS` as the `server` field directly. The `mssql` package requires them split into `server: 'DESKTOP-PC'` and `options: { instanceName: 'SQLEXPRESS' }` separately.

### 4. Pharma-Specific Requirements

Designing the schema for a pharmaceutical context required additional fields beyond a generic inventory system — `expiry_date`, `batch_number`, `generic_name`, `reorder_level` per product, and a separate `Units` table for pharmaceutical units of measure (tablet, capsule, vial, etc.). The expiry report logic also required MSSQL's `DATEDIFF` and `DATEADD` functions which are T-SQL specific.

---

## License

For assessment purposes only