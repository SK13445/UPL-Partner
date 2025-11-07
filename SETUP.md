# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**

- Install MongoDB locally
- Start MongoDB service
- Connection string: `mongodb://localhost:27017/upl-partner`

**Option B: MongoDB Atlas (Cloud)**

- Create account at https://www.mongodb.com/cloud/atlas
- Create cluster and get connection string
- Use connection string in `.env` file

### 3. Configure Environment

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/upl-partner
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Create Initial Users

```bash
cd server
node scripts/seed.js
```

This creates:

- Admin: `admin@upl.com` / `admin123`
- HR: `hr@upl.com` / `hr123`
- Operational Head: `ophead@upl.com` / `ophead123`

### 5. Start Development Servers

**Option A: Run both together (recommended)**

```bash
# From root directory
npm run dev
```

**Option B: Run separately**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 6. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Testing the Workflow

## After Setup:

1. **Update `.env` file** with your MongoDB connection string
2. **Run the seed script**:

   ```powershell
   cd server
   node scripts/seed.js
   ```

3. **Start the server**:
   ```powershell
   npm run dev
   ```

---

## Quick Test:

After setting up MongoDB, test the connection:

```powershell
cd server
node scripts/seed.js
```

You should see:

```
Connected to MongoDB
Created user: admin@upl.com (admin)
Created user: hr@upl.com (hr)
Created user: ophead@upl.com (operational_head)

Seed completed successfully!

1. **Submit Enquiry**:
   - Go to http://localhost:3000/enquiry
   - Fill and submit the form

2. **HR Review**:
   - Login as HR (`hr@upl.com` / `hr123`)
   - Go to `/hr` dashboard
   - Review and approve the enquiry

3. **Operational Head Review**:
   - Login as Operational Head (`ophead@upl.com` / `ophead123`)
   - Go to `/operational` dashboard
   - Review and final approve
   - This automatically creates franchise account

4. **Franchise Onboarding**:
   - Login with the franchise email (from enquiry)
   - Password will be auto-generated (check server logs for temp password)
   - Or use the set-password endpoint to set a new password
   - Complete profile form
   - Accept agreement
   - Print agreement PDF

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in `.env` is correct
- For Atlas, ensure IP is whitelisted

### Port Already in Use
- Change PORT in `server/.env`
- Update FRONTEND_URL if needed

### CORS Errors
- Ensure FRONTEND_URL in `.env` matches your frontend URL
- Check that backend is running on correct port

### Module Not Found
- Run `npm install` in the respective directory
- Delete `node_modules` and reinstall if needed

## Production Deployment Notes

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Use MongoDB Atlas or managed database
4. Set up proper CORS for your domain
5. Build frontend: `cd client && npm run build`
6. Use PM2 or similar for process management
7. Set up reverse proxy (nginx) if needed



```
