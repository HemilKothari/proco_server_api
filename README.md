# ProCo Server API

The ProCo Server API is the backend for the ProCo platform, built using **Node.js**, **Express**, and **MongoDB**.  
It provides REST APIs for authentication, users, jobs, filters, chats, messages, bookmarks, matches, and swipes.

---

## 🚀 Features

- JWT-based authentication
- Modular routes, controllers, and models structure
- CRUD operations for jobs, filters, bookmarks, and users
- Fully deployment-ready (GitHub → Render)

---

## 📦 Technology Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**

---

## ⚙️ Setup & Installation Guide

Follow these steps to run this backend locally:

### 1. Clone the repository
```bash
git clone https://github.com/HemilKothari/proco_server_api.git
cd proco_server_api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a `.env` file
Add the following environment variables:

```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any other variables your project requires.

### 4. Start the server
```bash
npm run dev
```
or
```bash
node index.js
```

Your server will run on:
```
http://localhost:4000
```

---

## 🛰 Deployment Details

- The backend code is hosted on **GitHub** and linked directly to **Render** for deployment.
- Render automatically builds and hosts the server, making it accessible publicly from anywhere.
- The project currently runs on Render’s **free tier**, which results in **40–50 seconds cold-start time**.
- Any updates pushed to GitHub can be redeployed easily using Render’s deploy button or auto-deploy.

---
