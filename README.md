# UPL Partner Management System

A comprehensive franchise/channel partner management system with multi-role approval workflow, onboarding, and agreement management.

## Features

- **Multi-Role System**: Admin, HR, Operational Head, and Franchise Partner roles
- **Approval Workflow**: HR approval → Operational Head final approval → Auto account creation
- **Franchise Onboarding**: Complete profile form with ID proof upload
- **Agreement Management**: Digital agreement acceptance with PDF generation
- **Dashboard Analytics**: Statistics and overview for each role
- **JWT Authentication**: Secure role-based access control

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- PDFKit for agreement generation
- Express Validator

## Project Structure

```
UPL-Partner/
├── server/                 # Backend Express API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Utility functions
│   └── index.js          # Server entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── utils/        # Utilities
│   └── public/
└── package.json          # Root package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies**:
   ```bash
   npm run install-all
   ```
   Or install separately:
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Set up environment variables**:

   Create `server/.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/upl-partner
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Create initial admin user**:

   Run the seed script:
   ```bash
   cd server
   node scripts/seed.js
   ```
   
   Default admin credentials:
   - Email: admin@upl.com
   - Password: admin123

   Or create manually using MongoDB or create a user through the API.

5. **Start the development servers**:

   From root directory:
   ```bash
   npm run dev
   ```
   
   Or start separately:
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm start
   ```

6. **Access the application**:
   - Frontend: upl client: http://localhost:5713
   - client http://localhost:3000
   - Backend API: http://localhost:5000

## User Roles & Workflow

### 1. Public User
- Can access landing page
- Can submit franchise enquiry form

### 2. HR Role
- Login: `/login` (hr@upl.com / password)
- Dashboard: `/hr`
- Can review and approve/reject pending enquiries
- Adds notes during review

### 3. Operational Head
- Login: `/login` (ophead@upl.com / password)
- Dashboard: `/operational`
- Reviews HR-approved enquiries
- Final approval creates franchise account automatically
- Can view all franchises

### 4. Admin
- Login: `/login` (admin@upl.com / admin123)
- Dashboard: `/admin`
- View all users and system statistics
- Manage system settings

### 5. Franchise Partner
- Receives login credentials after approval
- Dashboard: `/franchise`
- Step 1: Complete profile form (business details, address, ID proof)
- Step 2: Accept agreement terms
- Step 3: Print agreement PDF

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/set-password` - Set password (franchise)

### Franchise Enquiry
- `POST /api/franchise/enquiry` - Submit enquiry (public)
- `GET /api/franchise/enquiry/pending` - Get pending enquiries
- `GET /api/franchise/enquiry/:id` - Get enquiry details
- `POST /api/franchise/approve` - Approve/reject enquiry

### User Management
- `GET /api/user/franchise/details` - Get franchise details
- `POST /api/user/franchise/submit-details` - Submit onboarding form

### Agreement
- `POST /api/agreement/accept` - Accept agreement
- `GET /api/agreement/print/:id` - Generate PDF
- `GET /api/agreement/status` - Get agreement status

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users

## Workflow Flow

```
1. Visitor submits enquiry form
   ↓
2. HR reviews and approves/rejects
   ↓
3. If approved, Operational Head reviews
   ↓
4. If approved, system creates:
   - Franchise user account
   - Franchise record with code
   ↓
5. Franchise logs in and:
   - Completes profile form
   - Accepts agreement
   - Prints agreement PDF
```

## Production Deployment

### Frontend
- Build: `cd client && npm run build`
- Deploy to: Vercel, Netlify, or any static hosting

### Backend
- Set NODE_ENV=production
- Use process manager (PM2)
- Deploy to: Render, Railway, AWS EC2, DigitalOcean

### Database
- Use MongoDB Atlas (cloud) or managed MongoDB service
- Update MONGODB_URI in production .env

### Environment Variables
- Set strong JWT_SECRET
- Configure CORS for production domain
- Set up SMTP for email notifications (optional)

## Optional Enhancements

- Email notifications using Nodemailer (SMTP configured in .env)
- SMS alerts for status changes
- File upload for ID proof documents
- Advanced analytics dashboard
- Export functionality for reports

## License

ISC

## Support

For issues or questions, please contact the development team.

