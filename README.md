# 🏙️ Civic Issue Tracker

A **robust backend system** for a civic issue reporting platform that allows citizens to report local problems like potholes, garbage issues, and streetlight failures, while tracking their resolution status in **real time**. 
The system is designed to help local authorities manage and resolve public issues efficiently using a **structured workflow**.

---

## 🚀 Key Features

* 👥 **Role-Based Workflows:** Secure user registration and login system featuring **role-based access control** optimized for **3 distinct roles**.
* 🔄 **Issue Lifecycle Management:** Citizens can report detailed civic issues, enabling authorities to seamlessly transition issue statuses through a structured workflow (**Pending ➔ In Progress ➔ Resolved**).
* ⚡ **High-Performance Architecture:** Designed high-throughput RESTful APIs with **MongoDB schema optimization and indexing** to handle **50+ concurrent users**, sustaining **345+ requests/sec** across **20,900+ requests** with a **0% error rate** during rigorous load testing.
* 🔒 **Bulletproof Security:** Implemented **JWT-based authentication** and a **modular middleware architecture**, securing **10+ critical API endpoints** with **bcrypt.js** for industry-standard password encryption.
* ☁️ **Cloud Deployment:** Orchestrated production readiness by deploying and hosting the scalable backend infrastructure securely on **AWS**.

---

## 🛠️ Tech Stack

* 🟢 **Runtime:** **Node.js**
* 🚂 **Framework:** **Express.js** 
* 🍃 **Database:** **MongoDB** (with Mongoose ORM)
* 🔑 **Security:** **JSON Web Tokens (JWT)** & **bcrypt.js**
* ☁️ **Cloud & Tools:** **AWS**, **Git / GitHub**
* ⚙️ **Environment Management:** **dotenv**
