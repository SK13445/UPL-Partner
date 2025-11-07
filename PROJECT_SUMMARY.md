# Project Summary: UPL Partner Management System

## ✅ Completed Features

### Backend (Node.js + Express + MongoDB)
- ✅ JWT Authentication with role-based access control
- ✅ User management (Admin, HR, Operational Head, Franchise)
- ✅ Franchise enquiry submission API
- ✅ Multi-stage approval workflow (HR → Operational Head)
- ✅ Automatic franchise account creation on approval
- ✅ Franchise onboarding API (profile submission)
- ✅ Agreement acceptance and logging
- ✅ PDF agreement generation using PDFKit
- ✅ Admin dashboard statistics API
- ✅ MongoDB models for Users, Enquiries, Franchises, AgreementLogs

### Frontend (React + Tailwind CSS + Redux)
- ✅ Landing page with enquiry form CTA
- ✅ Public enquiry form
- ✅ Role-based login system
- ✅ Admin Dashboard with statistics and user management
- ✅ HR Dashboard with enquiry approval workflow
- ✅ Operational Head Dashboard with final approval and franchise list
- ✅ Franchise Dashboard with:
  - Profile completion form
  - Agreement acceptance modal
  - Agreement PDF print functionality
- ✅ Responsive design with Tailwind CSS
- ✅ Protected routes with role-based access
- ✅ Toast notifications for user feedback

### Workflow Implementation
- ✅ Enquiry submission → HR approval → Operational approval → Account creation
- ✅ Franchise onboarding: Profile → Agreement → Print
- ✅ Automatic franchise code generation
- ✅ Temporary password generation for new franchise accounts
- ✅ Credentials sharing modal for operational head

## 📁 Project Structure

```
UPL-Partner/
├── server/
│   ├── models/              # MongoDB schemas
│   │   ├── User.js
│   │   ├── FranchiseEnquiry.js
│   │   ├── Franchise.js
│   │   └── AgreementLog.js
│   ├── routes/              # API endpoints
│   │   ├── auth.js
│   │   ├── franchise.js
│   │   ├── user.js
│   │   ├── agreement.js
│   │   └── admin.js
│   ├── middleware/          # Auth & RBAC
│   │   └── auth.js
│   ├── utils/               # Helper functions
│   │   ├── franchiseUtils.js
│   │   └── pdfGenerator.js
│   ├── scripts/             # Utility scripts
│   │   └── seed.js
│   └── index.js            # Server entry
│
├── client/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── PrivateRoute.js
│   │   │   └── DashboardLayout.js
│   │   ├── pages/          # Page components
│   │   │   ├── LandingPage.js
│   │   │   ├── Login.js
│   │   │   ├── EnquiryForm.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── HRDashboard.js
│   │   │   ├── OperationalDashboard.js
│   │   │   ├── FranchiseDashboard.js
│   │   │   ├── AgreementPrint.js
│   │   │   └── Unauthorized.js
│   │   ├── store/          # Redux store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       └── authSlice.js
│   │   ├── utils/          # Utilities
│   │   │   └── axios.js
│   │   ├── App.js
│   │   └── index.js
│   └── public/
│
├── README.md               # Full documentation
├── SETUP.md                # Quick setup guide
└── package.json            # Root package.json
```

## 🔐 Default Credentials (After Seeding)

After running `node server/scripts/seed.js`:

- **Admin**: `admin@upl.com` / `admin123`
- **HR**: `hr@upl.com` / `hr123`
- **Operational Head**: `ophead@upl.com` / `ophead123`

## 🚀 Quick Start

1. Install dependencies: `npm run install-all`
2. Set up MongoDB and create `server/.env`
3. Seed users: `cd server && node scripts/seed.js`
4. Start servers: `npm run dev`
5. Access: http://localhost:3000

## 📋 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/set-password` - Set password (franchise)

### Franchise Management
- `POST /api/franchise/enquiry` - Submit enquiry (public)
- `GET /api/franchise/enquiry/pending` - Get pending enquiries
- `POST /api/franchise/approve` - Approve/reject enquiry
- `GET /api/franchise/list` - List all franchises

### User Operations
- `GET /api/user/franchise/details` - Get franchise details
- `POST /api/user/franchise/submit-details` - Submit onboarding

### Agreement
- `POST /api/agreement/accept` - Accept agreement
- `GET /api/agreement/print/:id` - Generate PDF
- `GET /api/agreement/status` - Get status

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users

## 🎯 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Admin** | View all users, dashboard statistics, system management |
| **HR** | Review and approve/reject enquiries, add notes |
| **Operational Head** | Final approval, create franchise accounts, view all franchises |
| **Franchise** | Complete profile, accept agreement, print agreement PDF |

## 🔄 Complete Workflow

```
1. Visitor → Submit Enquiry Form
   ↓
2. HR → Review & Approve/Reject
   ↓ (if approved)
3. Operational Head → Final Review & Approval
   ↓ (if approved)
4. System → Auto-create Franchise Account
   - Generate franchise code
   - Create user account
   - Generate temp password
   ↓
5. Franchise Partner → Login with temp password
   ↓
6. Franchise Partner → Complete Profile Form
   ↓
7. Franchise Partner → Accept Agreement
   ↓
8. Franchise Partner → Print Agreement PDF
```

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Role-based dashboards with sidebar navigation
- Modal dialogs for approvals and agreements
- Toast notifications for user feedback
- Progress indicators for franchise onboarding
- PDF generation and download

## 📦 Dependencies

### Backend
- express, mongoose, bcryptjs, jsonwebtoken
- pdfkit, cors, dotenv, express-validator

### Frontend
- react, react-router-dom, react-redux, @reduxjs/toolkit
- axios, react-hot-toast, tailwindcss
- react-icons

## 🔧 Configuration

Environment variables needed in `server/.env`:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `FRONTEND_URL` - Frontend URL for CORS

## 📝 Notes

- Franchise accounts are created automatically with temporary passwords
- Temporary passwords are shown to operational head after approval
- Agreement PDFs are generated on-demand
- All routes are protected with JWT authentication
- Role-based access control enforced on all protected routes

## 🚧 Optional Future Enhancements

- Email notifications (SMTP configured, not implemented)
- SMS alerts for status changes
- File upload for ID proof documents
- Advanced analytics and reporting
- Export functionality
- Password reset functionality
- Email verification

