# 📊 Employee Management System (EMS)

A secure, full-stack containerized web application built to manage organizational employee directories with strict **Role-Based Access Control (RBAC)**. Standard users are granted view-only privileges, while administrative accounts have full authorization to create, modify, and delete employee records.

🔗 **Live Deployment Link:** [https://prodigy-fs-02-murex.vercel.app](https://prodigy-fs-02-murex.vercel.app)  
⚡ **Production API Base:** `https://prodigy-fs-02-v2-133734452521.asia-south1.run.app`

---

## 🚀 Project Overview

This project provides an enterprise-grade solution for managing personnel tracking. It bridges a reactive single-page application with a stateless, cloud-hosted microservice container. 

### Key Features
* 🔒 **Role-Based UI Rendering:** The operational dashboard adapts automatically depending on the token payload (`admin` vs `user`). **Write operations** *are completely stripped from the UI for standard accounts.*
* 🛡️ **Gateway Input Validation:** Advanced backend regular expressions intercept incoming payloads before data operations execute, blocking un-sanitized inputs.
* 📋 **Dynamic Record Control:** Live data manipulation including alphabetical grid rendering, real-time UI state filters, and soft modal confirmation dialogs.
* 📦 **Production Security Architecture:** Complete decoupling of runtime configuration parameters from source files via cloud environment variable injected workflows.

---

## 🛠️ Complete Tech Stack

| Architecture Layer | Technology / Framework | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React.js (v18+) | Component-driven declarative interface architecture |
| **Client Networking** | Axios | Asynchronous HTTP promise-based API fetching |
| **Styling** | Modern CSS3 | Responsive dark-mode interface design |
| **Backend Core** | Node.js | Scalable event-driven JavaScript engine runtime |
| **API Framework** | Express.js | Production RESTful routing middleware pipeline |
| **Database** | MongoDB Atlas | Distributed cloud NoSQL document store cluster |
| **Database ODM** | Mongoose | Schema-enforced object data modeling layer |
| **Containerization** | Docker | Immutable microservice packaging environment |
| **Cloud Hosting** | Google Cloud Run | Stateless, auto-scaling backend container hosting |
| **CI/CD Pipeline** | Vercel | Global edge CDN hosting and automated frontend pipeline |

---

## 🔒 Security Specifications & Core Libraries

### 1. Authentication Lifecycle
* **JSON Web Tokens (`jsonwebtoken`):** Encodes user IDs and role credentials into cryptographically signed state tokens on login. Tokens are set with an explicit `1h` expiration timeframe.
* **Bcrypt.js (`bcryptjs`):** Implements one-way salted processing algorithms to hash registration strings before storing items within database records.

### 2. Validation Constraints
The platform implements an advanced regex lookahead mechanism to ensure all accounts meet global security compliance standards:
* **Email Rule:** `^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$` (Enforces standard structure syntax validation).
* **Password Policy:** `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`
    * Must be a minimum of **8 characters** long.
    * Must contain at least **one uppercase** letter.
    * Must contain at least **one lowercase** letter.
    * Must contain at least **one numerical digit**.

### 3. Production Handshake Safeguards
The CORS middleware is refactored with an adaptive parsing system that dynamically allows preflight handshakes originating from any deployment under the project profile while safely terminating foreign origins:
```javascript
origin: function (origin, callback) {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
        return callback(null, true);
    }
    return callback(null, false);
}

```

---

## 💻 Local Environment Setup

Follow these steps to configure and run the development pipeline locally:

### 1. Prerequisites

Ensure you have **Node.js (v16+)** and **npm** installed on your workstation.

### 2. Clone the Repository

```bash
git clone [https://github.com/s1ngh-divyanshi/PRODIGY_FS_02.git](https://github.com/s1ngh-divyanshi/PRODIGY_FS_02.git)
cd PRODIGY_FS_02
```

### 3. Setup the Backend Environment

Navigate to the backend directory, install packages, and establish your secret environment configurations:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/employeeDB
JWT_SECRET=your_super_secure_jwt_token_key_phrase
```

Start the local server:

```bash
npm start
```

### 4. Setup the Frontend Environment

Open a secondary terminal workspace, navigate to the frontend directory, and spin up the development engine:

```bash
cd frontend
npm install
```

Verify the API connection references point to your targeted destination (`localhost:5000` or live cloud production servers), then execute:

```bash
npm run dev
```

---

## 📈 Engineering Evolution

This repository evolved through distinct architectural refinements:

1. **Monolith to Cloud Microservices:** Decoupled tight local execution roots to build a cloud-native API capable of orchestrating server-side actions across separate hosting platforms.
2. **Preflight Failure Remediation:** Overhauled strict backend array evaluation loops into non-crashing adaptive dynamic origin handlers to bypass browser preflight exceptions (`500/CORS Mismatch`).
3. **Data Path Normalization:** Resolved field remapping conflicts between backend controllers and MongoDB schemas, engineering data handling bridges that allow error parsing down to individual input elements.
