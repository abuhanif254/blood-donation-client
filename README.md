

# 🩸 Blood Donation Application

A full-stack web application for managing blood donation requests, connecting donors with recipients, and processing donations through secure payment integration.

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email validation
- Secure login with JWT authentication
- Firebase authentication integration
- Role-based access control (User, Admin)
- Protected routes and private pages

### 🩸 Donation Management
- Create blood donation requests
- View all donation requests
- Search donors by blood group, district, and upazila
- Donation request details page
- Update and delete own donation requests
- Change donation status (pending, inprogress, done, cancelled)
- Donate to blood requests through modal confirmation

### 👤 User Features
- User profile management
- Update profile information
- View donation history
- Dashboard with personalized statistics
- My donation requests management

### 👨‍💼 Admin Features
- Admin dashboard with analytics
- User management (view, block, unblock users)
- Promote users to admin role
- View all donation requests
- Donation statistics with charts (daily, weekly, monthly)
- Comprehensive admin controls

### 💳 Payment Integration
- Stripe payment gateway integration
- Secure donation funding
- Payment history tracking
- Tabular fund display
- Transaction management

### 📊 Analytics & Reporting
- Dashboard statistics
- Donation request charts
- PDF export of search results
- Visual data representation with Recharts

### 🎨 UI/UX Features
- Responsive design for all devices
- Modern and intuitive interface
- Smooth animations with Framer Motion
- Beautiful alerts with SweetAlert2
- Form validation with React Hook Form
- Icon library with React Icons
- Mobile-friendly navigation

### 📄 Additional Pages
- Home page with features showcase
- About page
- Contact page
- FAQ page
- Privacy Policy
- Terms & Conditions
- 404 Error page

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React 19.2.0 with Vite
- **Styling**: Tailwind CSS 4.1.17
- **Routing**: React Router DOM 7.10.1
- **State Management**: React Context API
- **Authentication**: Firebase 12.6.0
- **Animations**: Framer Motion 12.23.25
- **Form Handling**: React Hook Form 7.68.0
- **Charts**: Recharts 3.5.1
- **PDF Generation**: jsPDF 3.0.4 + jsPDF-AutoTable 5.0.2
- **HTTP Client**: Axios 1.13.2
- **Payment**: Stripe React 5.4.1 + Stripe.js 8.5.3
- **Alerts**: SweetAlert2 11.26.3
- **Icons**: React Icons 5.5.0

### Backend (Server)
- **Runtime**: Node.js with Express 5.2.1
- **Database**: MongoDB 7.0.0 with Mongoose 9.0.0
- **Authentication**: JSON Web Tokens 9.0.3 + bcryptjs 3.0.3
- **Payment**: Stripe 20.1.0
- **CORS**: cors 2.8.5
- **Environment**: dotenv 17.2.3




## 📁 Project Structure


Assignment 11/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   └── _redirects              # Netlify SPA routing
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   ├── contexts/               # React Context providers
│   │   ├── pages/                  # Page components
│   │   ├── routes/                 # Route configurations
│   │   ├── utils/                  # Utility functions
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Entry point
│   ├── .env                        # Environment variables
│   ├── .env.production.example     # Production env template
│   ├── netlify.toml                # Netlify configuration
│   ├── package.json                # Dependencies
│   ├── tailwind.config.js          # Tailwind configuration
│   ├── vite.config.js              # Vite configuration
│   └── install-dependencies.txt    # Installation guide
│
├── server/                          # Backend application
│   ├── config/                      # Configuration files
│   ├── controllers/                 # Route controllers
│   │   ├── authController.js       # Authentication logic
│   │   ├── donationController.js   # Donation management
│   │   ├── paymentController.js    # Payment processing
│   │   └── userController.js       # User management
│   ├── middlewares/                 # Custom middleware
│   ├── models/                      # Database models
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js           # Auth endpoints
│   │   ├── donationRoutes.js       # Donation endpoints
│   │   ├── locationRoutes.js       # Location endpoints
│   │   ├── paymentRoutes.js        # Payment endpoints
│   │   └── userRoutes.js           # User endpoints
│   ├── .env                        # Environment variables
│   ├── .env.production.example     # Production env template
│   ├── .gitignore                  # Git ignore rules
│   ├── vercel.json                 # Vercel configuration
│   ├── index.js                    # Entry point
│   ├── package.json                # Dependencies
│   └  # Installation guide
│
├      
└── README.md                        # This file
```

--




## 📦 Dependencies

### Client-Side Dependencies

#### Production Dependencies (15)
```json
{
  "@stripe/react-stripe-js": "^5.4.1",      // Stripe React components
  "@stripe/stripe-js": "^8.5.3",            // Stripe JavaScript SDK
  "@tailwindcss/postcss": "^4.1.17",        // Tailwind CSS PostCSS plugin
  "axios": "^1.13.2",                        // HTTP client for API requests
  "firebase": "^12.6.0",                     // Firebase authentication
  "framer-motion": "^12.23.25",             // Animation library
  "jspdf": "^3.0.4",                        // PDF generation
  "jspdf-autotable": "^5.0.2",              // PDF tables
  "react": "^19.2.0",                       // React core
  "react-dom": "^19.2.0",                   // React DOM rendering
  "react-hook-form": "^7.68.0",             // Form validation
  "react-icons": "^5.5.0",                  // Icon library
  "react-router-dom": "^7.10.1",            // Client-side routing
  "recharts": "^3.5.1",                     // Charts and data visualization
  "sweetalert2": "^11.26.3"                 // Beautiful alerts and modals
}
```

#### Development Dependencies (11)
```json
{
  "@eslint/js": "^9.39.1",                  // ESLint core
  "@types/react": "^19.2.5",                // React TypeScript types
  "@types/react-dom": "^19.2.3",            // React DOM TypeScript types
  "@vitejs/plugin-react": "^5.1.1",         // Vite React plugin
  "autoprefixer": "^10.4.22",               // PostCSS autoprefixer
  "eslint": "^9.39.1",                      // JavaScript linter
  "eslint-plugin-react-hooks": "^7.0.1",    // React Hooks linting
  "eslint-plugin-react-refresh": "^0.4.24", // React Refresh linting
  "globals": "^16.5.0",                     // Global variables for ESLint
  "postcss": "^8.5.6",                      // CSS transformation
  "tailwindcss": "^4.1.17",                 // Utility-first CSS framework
  "vite": "^7.2.4"                          // Build tool and dev server
}
```

### Server-Side Dependencies

#### Production Dependencies (8)
```json
{
  "bcryptjs": "^3.0.3",       // Password hashing and encryption
  "cors": "^2.8.5",           // Cross-Origin Resource Sharing
  "dotenv": "^17.2.3",        // Environment variables management
  "express": "^5.2.1",        // Web application framework
  "jsonwebtoken": "^9.0.3",   // JSON Web Token authentication
  "mongodb": "^7.0.0",        // MongoDB native driver
  "mongoose": "^9.0.0",       // MongoDB object modeling
  "stripe": "^20.1.0"         // Stripe payment processing
}
```

#### Development Dependencies (1)
```json
{
  "nodemon": "^3.1.11"        // Auto-restart server on file changes
}
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Firebase account
- Stripe account

## 🔧 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (.env)
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🌐 Deployment

### Production Deployment
- **Server**: Deployed on Vercel
- **Client**: Deployed on Netlify

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `PUT /api/users/:id/status` - Block/unblock user (Admin only)

### Donations
- `GET /api/donations` - Get all donation requests
- `POST /api/donations` - Create donation request (Protected)
- `GET /api/donations/my-requests` - Get user's donations (Protected)
- `GET /api/donations/:id` - Get donation details
- `PUT /api/donations/:id` - Update donation request (Protected)
- `DELETE /api/donations/:id` - Delete donation request (Protected)
- `PUT /api/donations/:id/status` - Update donation status (Protected)
- `GET /api/donations/search` - Search donors
- `GET /api/donations/stats` - Get donation statistics (Admin)

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment (Protected)
- `GET /api/payments/history` - Get payment history (Protected)

### Locations
- `GET /api/locations/districts` - Get all districts
- `GET /api/locations/upazilas/:district` - Get upazilas by district


## 🙏 Acknowledgments

- React team for the amazing framework
- Stripe for payment integration
- Firebase for authentication services
- MongoDB for the database
- All open-source contributors
