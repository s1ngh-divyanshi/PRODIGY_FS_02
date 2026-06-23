# 📊 Employee Management System (EMS)

A full-stack, containerized web application with **Role-Based Access Control (RBAC)**. Standard users have view-only access; administrators have full CRUD privileges for employee records.

🔗 **Live Link:** [prodigy-fs-02-murex.vercel.app](https://prodigy-fs-02-murex.vercel.app)  
⚡ **API Base:** `https://prodigy-fs-02-v2-133734452521.asia-south1.run.app`

---

## 🚀 Key Features

* 🔒 **Dynamic RBAC:** UI adapts automatically based on token payload (`admin` vs `user`), completely hiding write operations from standard accounts.
* 🛡️ **Server-Side Validation:** Enforces strict regex validation for emails and complex passwords directly at the API gateway.
* 📋 **Live Data Control:** Real-time search filter, alphabetical rendering, and modal confirm dialogs.
* 📦 **Cloud-Native Architecture:** Complete separation of concerns with environment variables and decoupled frontend/backend services.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (v18+), Axios, CSS3 (Modern Dark Mode)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose ODM
* **Deployment:** Docker, Google Cloud Run (Backend), Vercel (Frontend)

---

## 🔒 Security & Validation Specs

* **Authentication:** **JSON Web Tokens (JWT)** with 1-hour expiration; **Bcrypt.js** for secure password hashing.
* **Email Rules:** Strict structural pattern matching.
* **Password Policy:** Minimum 8 characters, requiring at least one uppercase letter, one lowercase letter, and one number.
* **CORS Safe-Handshake:** Dynamically whitelists local environments and Vercel production edge subdomains while turning away unauthorized traffic.

---

## 💻 Quick Start (Local Setup)

### 1. Clone & Prerequisites
Ensure **Node.js (v16+)** is installed.
```bash
git clone [https://github.com/s1ngh-divyanshi/PRODIGY_FS_02.git](https://github.com/s1ngh-divyanshi/PRODIGY_FS_02.git)
cd PRODIGY_FS_02
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `backend/.env` file:

```text
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_key
```

```bash
npm start
```

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

---

## 📈 Architecture Evolution

1. **Decoupled Infrastructure:** Transformed a monolithic framework into an automated microservice cluster spanning distinct cloud environments.
2. **Preflight Optimization:** Resolved `500/CORS` mismatch issues by introducing non-crashing adaptive preflight handshake bridges.
3. **Data Normalization:** Built robust alignment layers between incoming request bodies and MongoDB schemas to support clean, field-specific error rendering on the frontend UI.