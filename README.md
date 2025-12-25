# 🧑‍💼 User Management System (MERN Stack)

A full-stack **User Management System** built using the **MERN stack**, featuring **JWT authentication**, **Redux state management**, **role-based access control (Admin/User)**, and **profile image upload**.

This project demonstrates real-world authentication, authorization, and admin management workflows.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- User Signup & Login
- JWT-based authentication
- Auto logout on token expiry
- Protected routes
- Role-based access (User / Admin)

### 👤 User Features

- Login / Logout
- View Home Page
- View & Edit Profile
- Update Name & Email with validation
- Upload / Remove Profile Picture
- Secure profile update

### 🛠️ Admin Features

- Admin Login
- View all users
- Search users
- Delete users
- Role-protected admin routes

### 🧠 State Management

- Redux Toolkit for global state
- Persistent auth state using `localStorage`
- Centralized auth handling via middleware

---

## 🧰 Tech Stack

### Frontend

- React (Vite)
- Redux Toolkit
- React Router
- SweetAlert2 (alerts & confirmations)
- React Toastify (notifications)
- Zod (form validation)
- CSS Modules

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (image upload)

---

## 🔑 Admin Access

Admins **do NOT sign up publicly**.

### How to create an admin:

- Insert admin manually in MongoDB
- Or promote a user by updating role to `"admin"`

Example:

```js
{
  role: "admin";
}
```

---

## 🔒 Security Highlights

- Password hashing using bcrypt
- JWT verification middleware
- Backend-only role validation
- Protected admin APIs
- No browser alerts (`SweetAlert2` used)

---

## 🧪 Validation

- Zod used for frontend form validation
- Backend validation for security
- Email uniqueness enforced
- Graceful error handling with toasts

---

## 🧠 Learning Outcomes

This project demonstrates:

- JWT authentication flow
- Role-based authorization
- Redux middleware usage
- Secure file upload handling
- Real-world admin/user separation
- Clean frontend UX patterns

---

## 📌 Future Enhancements

- Refresh token support
- Pagination for admin user list
- Edit users from admin panel
- Cloud image storage (Cloudinary)
- Password reset flow

---

## 👨‍💻 Author

**Sabin VV**
MERN Stack Developer

---

## 📜 License

This project is for **learning and demonstration purposes**.
