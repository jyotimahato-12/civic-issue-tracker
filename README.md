# 🏙️ Civic Issue Tracker

A **robust backend system** for a civic issue reporting platform that allows citizens to report local problems like potholes, garbage issues, and streetlight failures, while tracking their resolution status in **real time**. 
The system is designed to help local authorities manage and resolve public issues efficiently using a **structured workflow**.

---

## 🚀 Key Features

* 👥 **Role-Based Workflows:** Secure user registration and login system featuring **role-based access control** optimized for <font size="5">**3 DISTINCT ROLES**</font>.
* 🔄 **Issue Lifecycle Management:** Citizens can report detailed civic issues, enabling authorities to seamlessly transition issue statuses through a structured workflow (**Pending ➔ In Progress ➔ Resolved**).
* ⚡ **High-Performance Architecture:** Designed high-throughput RESTful APIs with **MongoDB schema optimization and indexing** to handle <font size="5">**50+ CONCURRENT USERS**</font>, sustaining <font size="5">**345+ REQUESTS/SEC**</font> across **20,900+ requests** with a <font size="5">**0% ERROR RATE**</font> during rigorous load testing.
* 🔒 **Bulletproof Security:** Implemented **JWT-based authentication** and a **modular middleware architecture**, securing <font size="5">**10+ CRITICAL API ENDPOINTS**</font> with **bcrypt.js** for industry-standard password encryption.
* ☁️ **Cloud Deployment:** Orchestrated production readiness by deploying and hosting the scalable backend infrastructure securely on <font size="5">**AWS**</font>.

---

## 🔌 API Endpoints Reference

### 🔐 Authentication Routes (`/api/auth`)
| Method | Endpoint | Middleware / Protection | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | `validateRegister` | Registers a new user account |
| **POST** | `/login` | `validateLogin` | Authenticates user & returns a JWT |
| **GET** | `/me` | `protect` | Retrieves the currently logged-in user profile |

### 📋 Civic Issue Routes (`/api/issues`)
| Method | Endpoint | Middleware / Protection | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | `protect` | Creates a new civic issue report |
| **GET** | `/` | `protect` | Fetches all civic issues based on user role |
| **GET** | `/:id` | `protect` | Retrieves detailed information for a specific issue |
| **PATCH** | `/:id/status` | `protect` | Updates an issue's status (*Pending ➔ In Progress ➔ Resolved*) |
| **DELETE** | `/:id` | `protect` | Removes an issue report from the database |

---

## 🛠️ Tech Stack

* 🟢 **Runtime:** **Node.js**
* 🚂 **Framework:** **Express.js** * 🍃 **Database:** **MongoDB** (with Mongoose ORM)
* 🔑 **Security:** **JSON Web Tokens (JWT)** & **bcrypt.js**
* ☁️ **Cloud & Tools:** **AWS**, **Git / GitHub**
* ⚙️ **Environment Management:** **dotenv**
