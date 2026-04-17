# 🚀 QUICK DEPLOYMENT REFERENCE

## 📍 Account Signup URLs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Render**: https://render.com/
- **Netlify**: https://netlify.com/

---

## 🔑 Key Information to Save

```
┌─────────────────────────────────────────────────────┐
│ MONGODB ATLAS                                       │
├─────────────────────────────────────────────────────┤
│ Username: fusion_user                              │
│ Password: _____________________________ (SET THIS!)  │
│ Connection String:                                  │
│ mongodb+srv://fusion_user:PASSWORD@cluster.mongodb│
│ .net/fusion_dashboard                               │
│ SAVE THIS ⬆️                                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ RENDER (BACKEND)                                    │
├─────────────────────────────────────────────────────┤
│ Service Name: fusion-dashboard-backend             │
│ Deployed URL:                                       │
│ https://fusion-dashboard-backend.onrender.com      │
│ (or YOUR_RENDER_URL)                               │
│ SAVE THIS ⬆️                                        │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ NETLIFY (FRONTEND)                                  │
├─────────────────────────────────────────────────────┤
│ Site Name: ___________________________               │
│ Deployed URL:                                       │
│ https://your-site-name.netlify.app                 │
│ (or YOUR_NETLIFY_URL)                              │
│ SAVE THIS ⬆️                                        │
└─────────────────────────────────────────────────────┘
```

---

## ⚡ 5-Minute Quick Path

### 1️⃣ MongoDB (2 min)
- [ ] Go to: https://www.mongodb.com/cloud/atlas
- [ ] Create cluster (Free)
- [ ] Create user: `fusion_user`
- [ ] Whitelist IP: Allow from Anywhere
- [ ] Get connection string
- [ ] Copy string → **SAVE IT**

### 2️⃣ Render Backend (2 min)
- [ ] Go to: https://render.com/
- [ ] New Web Service → GitHub repo
- [ ] Name: `fusion-dashboard-backend`
- [ ] Env vars:
  - `MONGODB_URI` = *your connection string*
  - `NODE_ENV` = `production`
  - `FRONTEND_URL` = `*`
- [ ] Deploy
- [ ] Get URL → **SAVE IT**

### 3️⃣ Netlify Frontend (1 min)
- [ ] Go to: https://netlify.com/
- [ ] Import GitHub repo
- [ ] Base: `frontend`
- [ ] Build: `npm run build`
- [ ] Env var:
  - `REACT_APP_API_URL` = *your Render URL*
- [ ] Deploy
- [ ] Get URL → **SAVE IT**

---

## 🧪 Test Commands

```bash
# Test backend health
curl https://YOUR_RENDER_URL/health

# Get all data
curl https://YOUR_RENDER_URL/api/data
```

---

## 📱 Share Your Project

Once deployed, share these links:
- **Public Dashboard**: https://YOUR_NETLIFY_URL
- **API Documentation**: https://YOUR_RENDER_URL/api

---

## 🔄 Update Code After Deployment

```bash
cd /path/to/project
git add .
git commit -m "Update feature"
git push origin main
# Sites auto-deploy!
```

---

## 💡 Pro Tips

1. **Testing Locally**: `npm run dev` in backend, `npm start` in frontend
2. **Checking Logs**: Use service dashboard (Render/Netlify)
3. **Adding Features**: Push to GitHub → automatic deployment
4. **Monitoring**: Check dashboards regularly
5. **Free Tier Wake**: Access backend every 15 mins to keep awake

---

## 🆘 Common Issues

| Problem | Check |
|---------|-------|
| "Repository not found" | Push to GitHub first |
| "CORS error" | Update FRONTEND_URL in Render |
| "No data showing" | Check MONGODB_URI correct |
| "Backend 503" | May be waking up (free tier) |
| "Deploy fails" | Check build logs in dashboard |

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **MongoDB Atlas**: https://docs.mongodb.com/atlas/
- **Project README**: `README.md`
- **Detailed Guide**: `DEPLOYMENT.md`
- **Step-by-Step**: `DEPLOYMENT_STEPS.md`

---

**Your deployed dashboard URLs will go here:**

```
Frontend: ___________________________________________________________

Backend:  ___________________________________________________________
```

**Print this page and fill it out! 🖨️**
