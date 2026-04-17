# 🚀 Deployment Guide - Netlify & Render

## Overview
- **Frontend**: Deployed to Netlify
- **Backend**: Deployed to Render
- **Database**: MongoDB Atlas (cloud)

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email
   - Create a free cluster

2. **Get Connection String**
   - In MongoDB Atlas, click "Connect"
   - Select "Connect your application"
   - Copy connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/fusion_dashboard`
   - Replace `<password>` with your database password

### Step 2: Prepare Backend for Render

1. **Update backend/.env for production:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fusion_dashboard
   PORT=5000
   NODE_ENV=production
   ```

2. **Ensure backend/package.json has start script:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```
   ✅ Already configured!

3. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 3: Deploy Backend to Render

1. **Go to Render Dashboard**
   - Visit https://render.com/
   - Sign up with GitHub (recommended)
   - Click "New +" → "Web Service"

2. **Select GitHub Repository**
   - Connect your GitHub account
   - Select `Multi-Source-Intelligence-Fusion-Dashboard`
   - Click "Connect"

3. **Configure Web Service**
   - **Name**: `fusion-dashboard-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or Paid if needed)

4. **Add Environment Variables**
   - Click "Advanced" 
   - Add `MONGODB_URI`: Your Atlas connection string
   - Add `NODE_ENV`: `production`
   - Add `PORT`: `5000`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - Get your backend URL: `https://fusion-dashboard-backend.onrender.com`

### Step 4: Verify Backend Deployment

```bash
curl https://fusion-dashboard-backend.onrender.com/health
```
Expected: `{"status":"Backend is running"}`

---

## Part 2: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend for Netlify

1. **Create netlify.toml in frontend root:**
   ```toml
   [build]
   command = "npm run build"
   publish = "build"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

2. **Update frontend/.env for production:**
   ```
   REACT_APP_API_URL=https://fusion-dashboard-backend.onrender.com
   ```

3. **Update frontend/package.json proxy**
   - Change: `"proxy": "http://localhost:5000"`
   - To: Use environment variable in code (see below)

4. **Update frontend/src/App.js to use environment variable:**
   
   Find this line:
   ```javascript
   const response = await fetch('/api/data');
   ```
   
   Change to:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
   const response = await fetch(`${API_URL}/api/data`);
   ```

5. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for production deployment"
   git push origin main
   ```

### Step 2: Deploy Frontend to Netlify

1. **Go to Netlify**
   - Visit https://netlify.com
   - Sign up with GitHub
   - Click "Add new site" → "Import an existing project"

2. **Select GitHub Repository**
   - Choose your GitHub account
   - Search for `Multi-Source-Intelligence-Fusion-Dashboard`
   - Click to select

3. **Configure Build Settings**
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

4. **Add Environment Variables**
   - Click "Advanced" → "New variable"
   - Key: `REACT_APP_API_URL`
   - Value: `https://fusion-dashboard-backend.onrender.com`
   - Click "Save & deploy"

5. **Deploy**
   - Netlify will automatically build and deploy
   - Wait for green checkmark (2-5 minutes)
   - Get your frontend URL: `https://your-site-name.netlify.app`

### Step 3: Verify Frontend Deployment

- Open the Netlify URL
- Try uploading a file
- Map should load and display markers

---

## Troubleshooting Deployment

### CORS Errors
If you see CORS errors in browser console:

1. **Add CORS headers to backend**
   - Update `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: 'https://your-netlify-url.netlify.app',
     credentials: true
   }));
   ```

2. **Redeploy backend to Render**

### Render App Sleeping (Free Tier)
- Free tier spins down after 15 minutes of inactivity
- Solution: Upgrade to Paid tier OR visit every 15 minutes

### MongoDB Connection Issues
1. Verify connection string in Render environment variables
2. Check MongoDB Atlas whitelist includes Render IPs
   - In MongoDB Atlas: Network Access → Allow from anywhere (0.0.0.0/0)

### "Cannot find module" errors on Render
- Delete `node_modules` and `package-lock.json` locally
- Push to GitHub
- Trigger rebuild on Render

---

## Final Checklist

### Backend (Render)
- [ ] MongoDB Atlas account created
- [ ] Connection string obtained
- [ ] backend/server.js has `npm start` script
- [ ] Repository pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables set
- [ ] Backend URL obtained
- [ ] Health check endpoint working

### Frontend (Netlify)
- [ ] netlify.toml created
- [ ] REACT_APP_API_URL updated to backend URL
- [ ] App.js updated to use environment variable
- [ ] frontend/package.json build script verified
- [ ] Repository pushed to GitHub with changes
- [ ] Netlify site created
- [ ] Environment variables set
- [ ] Frontend URL obtained
- [ ] Upload feature tested

---

## After Deployment

### Monitor Your Apps

**Render Dashboard**: https://dashboard.render.com
- View logs
- Track performance
- Monitor errors

**Netlify Dashboard**: https://app.netlify.com
- View deploy history
- Configure redirects
- Monitor analytics

### Update Code After Deployment

Just push to GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both services auto-redeploy on push to main branch!

---

## Environment Variables Summary

### Backend (Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusion_dashboard
NODE_ENV=production
PORT=5000
```

### Frontend (Netlify)
```
REACT_APP_API_URL=https://fusion-dashboard-backend.onrender.com
```

---

## Useful Links

- [Render Docs](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Logs tab
2. Check Netlify logs: Deploy logs → View deploy log
3. Check browser console for frontend errors (F12)
4. Check MongoDB Atlas connection status

**Happy Deploying! 🚀**
