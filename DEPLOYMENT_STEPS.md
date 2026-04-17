# 📋 DEPLOYMENT CHECKLIST - Step by Step

## ✅ Prerequisites
- GitHub account with repository created
- GitHub repository pushed with all code
- Netlify account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## 🔧 STEP 1: Setup MongoDB Atlas (Cloud Database)

### 1a. Create MongoDB Atlas Cluster
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up with email/Google
3. Create Free Cluster
4. Choose a region (US/EU)
5. Wait for cluster to be ready (5-10 mins)

### 1b. Create Database User
1. Click "Database Access" on left menu
2. Click "Add New Database User"
3. Username: `fusion_user`
4. Password: *Generate and save it!*
5. Click "Add User"

### 1c. Whitelist IP Address
1. Click "Network Access" on left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (easier for testing)
4. Or click "Allow from your current IP"
5. Click "Confirm"

### 1d. Get Connection String
1. Click "Databases" on left menu
2. Click "Connect" button
3. Select "Connect your application"
4. Copy connection string
5. Replace:
   - `<username>` with `fusion_user`
   - `<password>` with your actual password
   - Result: `mongodb+srv://fusion_user:PASSWORD@cluster.mongodb.net/fusion_dashboard`
6. **SAVE THIS STRING** - you'll need it!

✅ **Done with MongoDB!**

---

## 🚀 STEP 2: Deploy Backend to Render

### 2a. Go to Render
1. Visit: https://render.com/
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended)
4. Authorize access to GitHub

### 2b. Create Web Service
1. In Render dashboard, click "+" → "New Web Service"
2. Select your GitHub repository:
   - Search: `Multi-Source-Intelligence-Fusion-Dashboard`
   - Click "Connect"
3. Configure Web Service:
   - **Name**: `fusion-dashboard-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or Paid as needed)
4. Click "Advanced" → Add Environment Variables:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://fusion_user:PASSWORD@cluster.mongodb.net/fusion_dashboard`
   - **IMPORTANT**: Replace password with actual password!
   - Add another variable:
     - Key: `NODE_ENV`
     - Value: `production`
   - Add another variable:
     - Key: `FRONTEND_URL`
     - Value: `*` (we'll update this after Netlify deployment)

### 2c. Deploy
1. Click "Create Web Service"
2. Render will start building (takes 2-5 minutes)
3. Wait for green checkmark ✅
4. Copy the backend URL: `https://your-service-name.onrender.com`
5. **SAVE THIS URL** - important for next step!

### 2d. Test Backend
Open in browser or terminal:
```
https://your-service-name.onrender.com/health
```
Expected response: `{"status":"Backend is running"}`

If you see error, check logs in Render dashboard

✅ **Backend deployed!**

---

## 🌐 STEP 3: Deploy Frontend to Netlify

### 3a. Go to Netlify
1. Visit: https://netlify.com/
2. Click "Sign up" or "Log in"
3. Select "GitHub" as auth method
4. Authorize Netlify to access GitHub

### 3b. Create New Site
1. Click "Add new site" → "Import an existing project"
2. Select your GitHub account
3. Search and select: `Multi-Source-Intelligence-Fusion-Dashboard`
4. Click to import

### 3c. Configure Build Settings
1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `frontend/build`
4. Click "Advanced" → "New variable":
   - Key: `REACT_APP_API_URL`
   - Value: (paste your Render backend URL from Step 2c)
   - Example: `https://fusion-dashboard-backend.onrender.com`

### 3d. Deploy
1. Click "Deploy site"
2. Netlify will build and deploy (takes 3-5 minutes)
3. Wait for green "Published" status ✅
4. Copy your site URL: `https://your-site-name.netlify.app`
5. **SAVE THIS URL**

### 3e. Test Frontend
1. Open your Netlify URL in browser
2. Should see dashboard with map
3. Try uploading sample CSV
4. Should see markers on map

✅ **Frontend deployed!**

---

## 🔗 STEP 4: Update Backend CORS (Optional but Recommended)

### 4a. Back to Render
1. Go to Render dashboard
2. Select your backend service: `fusion-dashboard-backend`
3. Click "Environment" on left menu
4. Add new variable:
   - Key: `FRONTEND_URL`
   - Value: (your Netlify URL from Step 3e)
   - Example: `https://your-site-name.netlify.app`
5. Click "Save" - this triggers a redeploy
6. Wait for green checkmark

### 4b. Test Again
1. Go to your Netlify URL
2. Try upload again
3. Should work smoothly now!

✅ **Deployment complete!**

---

## 📝 Important Notes

### Free Tier Limitations

**Render (Backend)**:
- Free tier auto-spins down after 15 minutes of inactivity
- Takes 30 seconds to wake up on next request
- Solution: Visit regularly OR upgrade to paid

**Netlify (Frontend)**:
- Free tier includes 300 free build minutes/month
- Works great for most projects
- Automatic deploys on push to GitHub

**MongoDB Atlas**:
- Free tier: 512MB storage
- Perfect for demo/testing
- Scale later if needed

### How to Update Code

After deployment, to update your project:

```bash
# Make changes locally
# Test locally
git add .
git commit -m "Update feature"
git push origin main
```

Both Netlify and Render will auto-deploy on push!

---

## 🆘 Troubleshooting

### Issue: "Repository not found" on Render
- **Solution**: Create GitHub repo first, then connect

### Issue: CORS errors in browser
- **Solution**: Update `FRONTEND_URL` in Render environment variables
- Trigger redeploy
- Wait 5 minutes

### Issue: Backend spinning down (Free tier)
- **Solution**: Visit backend health endpoint every 15 mins
- Or upgrade to hobby tier ($7/month)

### Issue: "Cannot find module" on Render
- **Solution**: Delete `package-lock.json` locally, push to GitHub, redeploy

### Issue: Upload not working
- **Solution**: Check browser console (F12)
- Check Render logs
- Verify MONGODB_URI in Render is correct

### Issue: Map not loading
- **Solution**: Check REACT_APP_API_URL in Netlify environment
- Check browser Network tab
- Verify backend is running

---

## ✅ Final Verification Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelist configured
- [ ] Connection string obtained
- [ ] Backend deployed to Render
- [ ] Backend health check working
- [ ] Frontend deployed to Netlify
- [ ] Frontend loads in browser
- [ ] Can upload files
- [ ] Markers appear on map
- [ ] Hover popups work
- [ ] Filters work
- [ ] No console errors

---

## 📊 Useful Links

- Render Dashboard: https://dashboard.render.com/
- Netlify Dashboard: https://app.netlify.com/
- MongoDB Atlas: https://cloud.mongodb.com/
- GitHub: https://github.com/

---

## 🎉 You're Deployed!

Your project is now live on the internet! 

**Frontend**: https://your-site-name.netlify.app
**Backend**: https://your-service-name.onrender.com

Share these links with others!

---

Need help? Check `DEPLOYMENT.md` for detailed technical information.
