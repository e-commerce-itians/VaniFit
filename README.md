# Modern E-Commerce Web App

A modern, responsive, and feature-rich e-commerce web application built with JavaScript, Firebase, and Vite. This project demonstrates best practices in SPA navigation, UI/UX, and modular frontend architecture.

---

## 🚀 Features

- **Modern UI/UX**: Clean, animated, and responsive design for all major pages (Home, Shop, Cart, Login, Register, Profile, Account, etc.)
- **SPA Navigation**: Seamless client-side routing for a fast, app-like experience
- **Authentication**: Secure login, registration, and account management with Firebase Auth
- **Product Catalog**: Browse, search, and filter products with real-time updates
- **Cart & Checkout**: Persistent cart, quantity management, and checkout flow
- **User Profile**: View and edit profile, manage orders, and account settings
- **Admin Dashboard**: Product management (add, edit, delete), order management, and analytics (if enabled)
- **Mobile Friendly**: Fully responsive layouts and touch-friendly components

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3 (with custom and Bootstrap classes)
- **Backend/DB**: Firebase (Firestore, Auth)
- **Build Tool**: Vite
- **Other**: FontAwesome, Cloudinary (for image uploads)

---

## 📦 Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/e-commerce-itians/repo-name.git
cd your-repo
```

### 2. **Install Dependencies**

```bash
npm install
```

### 3. **Firebase Setup**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable **Authentication** (Email/Password)
- Create a **Firestore** database
- (Optional) Set up **Cloudinary** for image uploads
- Copy your Firebase config to `src/utils/firebase.js` (see example in file)

### 4. **Run the App Locally**

```bash
npm run dev
```

- Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 🧑‍💻 Project Structure

```
├── public/                # Static assets (images, favicon, etc.)
├── src/
│   ├── components/        # Reusable UI components (Navbar, Footer, etc.)
│   ├── pages/             # Page components (Home, Shop, Cart, etc.)
│   ├── utils/             # Utility functions (Firebase, API, helpers)
│   ├── globals.js         # Global variables and config
│   ├── main.js            # App entry point
│   └── router.js          # SPA router
├── index.html             # Main HTML file
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
└── README.md              # Project documentation
```

---
