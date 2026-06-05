# SERN Stack Hospital Management System

A comprehensive web-based Hospital Management System built using the SERN stack (SQL, Express.js, React.js, Node.js) that streamlines hospital operations and enhances patient care through modern technology solutions.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### 🏥 Core Functionality
- **User Authentication & Authorization**: Secure login system with role-based access control (Admin, Doctor, Patient)
- **Multiple User Roles**: Separate dashboards and functionalities for different user types
- **Patient Management**: Comprehensive patient registration, medical records, and history tracking
- **Appointment Scheduling**: Online appointment booking with doctor availability management
- **Doctor Management**: Doctor profiles, specializations, and schedule management
- **Admin Dashboard**: Complete administrative control over the system
- **Message System**: Communication channel between patients and hospital staff

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication system
- **Multiple Token Management**: Handle multiple JSON Web Tokens for different user sessions
- **Password Encryption**: Secure password hashing using bcrypt
- **Role-based Access Control**: Different access levels for various user types
- **Data Validation**: Comprehensive input validation and sanitization

### 💻 Technical Features
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Real-time Updates**: Dynamic content updates without page refresh
- **Cloud Storage**: Image upload and storage using Cloudinary
- **RESTful APIs**: Well-structured API endpoints for all operations
- **Error Handling**: Comprehensive error handling and user feedback
- **File Upload**: Support for image and document uploads

## 🛠 Tech Stack

**Frontend:**
- React.js 18+
- CSS3 & Modern Styling
- Axios for API calls
- React Router for navigation
- Responsive design principles

**Backend:**
- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing
- Cloudinary for image storage
- Express File Upload for file handling

**Database:**
- MySQL (Relational database)
- Sequelize for object relational mapping

**Additional Tools:**
- Cookie Parser for cookie management
- CORS for cross-origin requests
- Validator for data validation
- Dotenv for environment variables

## 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── config/
│   │   └── config.env
│   ├── controllers/
│   │   ├── messageController.js
│   │   ├── appointmentController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── database/
│   │   └── dbConnection.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── catchAsyncErrors.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── messageSchema.js
│   │   ├── appointmentSchema.js
│   │   └── userSchema.js
│   ├── routes/
│   │   ├── messageRouter.js
│   │   ├── appointmentRouter.js
│   │   ├── userRouter.js
│   │   └── adminRouter.js
│   ├── utils/
│   │   ├── cloudinary.js
│   │   └── jwtToken.js
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MessageForm.jsx
│   │   │   └── AppointmentForm.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── Context.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── AddNewAdmin.jsx
│   │   │   ├── AddNewDoctor.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Messages.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MySQL** (v8.0.0 or higher)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hospital-management-system.git
cd hospital-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Dashboard Setup

```bash
cd ../dashboard
npm install
```

## 🔧 Environment Variables

Create a `config.env` file in the `backend/config/` directory and add the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=hospital_management
# Or for production:
# DATABASE_URL=mysql://user:password@host:port/database

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

# Frontend URLs
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Setting up Cloudinary

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add these credentials to your environment variables

### Setting up MySQL

**Option 1: Local MySQL**
Ensure MySQL server is running locally and create a database named `hospital_management`.

**Option 2: Cloud Database (PlanetScale / Railway / Aiven)**
1. Create a MySQL database instance.
2. Get the connection URL and add it to `DATABASE_URL` in your environment variables.

## 🎯 Usage

### Development Mode

1. **Start the Backend Server:**
```bash
cd backend
npm run dev
# Server will run on http://localhost:4000
```

2. **Start the Frontend:**
```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:5173
```

3. **Start the Dashboard:**
```bash
cd dashboard
npm run dev
# Dashboard will run on http://localhost:5174
```

### Production Mode

```bash
cd backend
npm start
```

## 🌐 API Endpoints

### Authentication Routes
- `POST /api/v1/user/patient/register` - Register new patient
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/admin/logout` - Admin logout
- `POST /api/v1/user/patient/logout` - Patient logout

### User Management
- `GET /api/v1/user/admin/me` - Get admin details
- `GET /api/v1/user/patient/me` - Get patient details
- `POST /api/v1/user/admin/addnew` - Add new admin
- `POST /api/v1/user/doctor/addnew` - Add new doctor
- `GET /api/v1/user/doctors` - Get all doctors

### Appointment Management
- `POST /api/v1/appointment/post` - Book new appointment
- `GET /api/v1/appointment/getall` - Get all appointments
- `GET /api/v1/appointment/available-slots` - Get available time slots for a doctor on a specific date
- `PUT /api/v1/appointment/update/:id` - Update appointment status
- `DELETE /api/v1/appointment/delete/:id` - Delete appointment

### Message System
- `POST /api/v1/message/send` - Send message
- `GET /api/v1/message/getall` - Get all messages

## 🎨 Key Features Demonstration

### User Roles & Authentication
- **Patients**: Can register, login, book appointments, view medical history
- **Doctors**: Can view appointments, manage patient records, update treatment plans
- **Admins**: Full system access, user management, appointment oversight, system configuration

### Appointment System
- Smart Time-Slot Scheduling (prevents double-booking and shows dynamic available slots)
- Real-time doctor availability checking
- Department-wise doctor filtering
- Appointment status management (Pending, Accepted, Rejected)
- Email notifications for appointment updates

### Security Implementation
- Multiple JWT tokens for different user sessions
- Secure cookie management
- Role-based route protection
- Input validation and sanitization

## 📱 Screenshots

*Add screenshots of your application here showing:*
- Homepage
- User registration/login
- Patient dashboard
- Doctor appointment booking
- Admin dashboard
- Appointment management

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow consistent coding style
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed




**⭐ If you found this project helpful, please give it a star!**

---

*Built with ❤️ using the SERN Stack*
