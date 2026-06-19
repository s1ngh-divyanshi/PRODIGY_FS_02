# Employee Management System 🏢

A full-stack web application designed to allow administrators to securely perform CRUD (Create, Read, Update, Delete) operations on employee records. Built with the MERN stack, this system features robust JWT authentication, Role-Based Access Control (RBAC), and a custom responsive dark-mode UI.

This project was developed as **Task 02** for the Full Stack Web Development Internship at **Prodigy InfoTech**.

## 🚀 Features

* **Role-Based Access Control (RBAC):** Distinct permissions for `admin` (full CRUD access) and `user` (read-only access).
* **Secure Authentication:** JSON Web Tokens (JWT) for session management and `bcryptjs` for secure password hashing.
* **Full CRUD Operations:** Seamlessly add, view, edit, and delete employee records from the database.
* **Modern UI/UX:** Custom dark-themed interface with interactive modals, toast notifications, and responsive design.
* **Cloud-Native Architecture:** Backend containerized and deployed on Google Cloud Run, with data hosted securely on MongoDB Atlas.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Axios (API communication)
* Custom CSS (Flexbox/Grid, CSS Variables)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Database & ORM)
* JSON Web Token (JWT) & bcryptjs (Security)
* Cors & Dotenv

**Deployment:**
* **Backend:** Google Cloud Run (Serverless Docker Container)
* **Database:** MongoDB Atlas
* **Frontend:** Vercel

---

## 📋 Prerequisites

Before you clone and attempt to run this project locally, ensure you have the following software installed on your machine:

1.  **[Node.js](https://nodejs.org/)** (v18.0.0 or higher)
2.  **[Git](https://git-scm.com/)**
3.  A **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** account (or a local MongoDB Compass installation) for your database connection.

---

## 💻 Local Development Setup

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name

```

### 2. Backend Setup

Navigate into the backend directory, install the dependencies, and set up your environment variables.

```bash
cd backend
npm install

```

Create a `.env` file in the root of the `backend` folder and add the following variables:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key

```

Start the backend server:

```bash
npm run dev
# or: node server.js

```

*You should see a message confirming the server is running and successfully connected to MongoDB.*

### 3. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install the dependencies.

```bash
cd frontend
npm install

```

Start the Vite development server:

```bash
npm run dev

```

*The application will open in your default browser at `http://localhost:5173`.*

---

## 🔐 Default Roles & Testing

When first booting the application, the database will be empty.

1. Click **Register here** on the login screen.
2. Select the **Administrator (Full Access)** role to create an admin account.
3. Log in with those credentials to unlock the Add, Edit, and Delete action buttons.
4. Registering a standard **User** account will only display the read-only dashboard.

---