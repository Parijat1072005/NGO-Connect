*Admin Credentials*: 
Email: admin@example.com
password: admin123
# NGO-Connect: Transparent Donation Platform
**NGO-Connect** is a full-stack MERN application designed for non-governmental organizations to manage registrations and donations with 100% transparency. It features role-based access for Users and Admins, integrated with the Razorpay Payment Gateway.
##Features
Dual Portal Login: Dedicated entry points for standard Users and Administrators.

Secure Authentication: JWT-based login with role enforcement.

Real-time Dashboard: Track personal donation history or manage global registrations.

Razorpay Integration: Seamless payment flow with automated success/failure status updates.

Data Management: Admin capability to export registration data to CSV for offline reporting.
## Tech Stack
Frontend: React.js, Vite, Tailwind CSS, Axios.

Backend: Node.js, Express.js.

Database: MongoDB Atlas.

Payments: Razorpay API.
## Setup Instructions
### 1. Prerequisites
Node.js installed.

MongoDB Atlas Account.

Razorpay Dashboard Account (Test Mode).

### 2. Backend Setup
#### 2.1 Navigate to the server directory:
cd server.

#### 2.2 Install dependencies: 
npm install.

#### 2.3 Create a .env file in the server root and add:
##### PORT=5000
##### MONGODB_URI=your_mongodb_connection_string
##### JWT_SECRET=your_secret_key
##### RAZORPAY_KEY_ID=your_razorpay_id
##### RAZORPAY_KEY_SECRET=your_razorpay_secret
#### 2.4 Start the server: 
npm start.

### 3. Frontend Setup
#### 3.1 Navigate to the client directory: 
cd client.

#### 3.2 Install dependencies: 
npm install.

#### 3.3 Create a .env file in the client root and add:
VITE_RAZORPAY_KEY_ID=your_razorpay_id
# Usage
Admin: Use the "Admin Login" portal to view metrics, all user registrations, and export CSVs.

User: Register/Login to donate via Razorpay, and track your contribution history.
