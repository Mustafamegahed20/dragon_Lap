# Same Domain Deployment Guide

## 🌐 **Running Frontend & Backend on Same Domain**

Yes! You can run both on the same domain. Here are the best approaches:

## **Option 1: Vercel Monorepo (Easiest)**

### Structure:
```
yourdomain.com/          → React Frontend
yourdomain.com/api/*     → Backend API
```

### Setup Steps:

1. **Deploy from root directory**:
   ```bash
   # From project root
   vercel --prod
   ```

2. **The root `vercel.json` handles routing**:
   - Frontend: All regular paths (`/`, `/products`, `/admin`)
   - Backend: All `/api/*` paths

3. **Environment Variables**:
   - Frontend automatically uses `/api` (same domain)
   - No CORS issues since same origin

### Advantages:
- ✅ No CORS issues
- ✅ Single domain/SSL certificate  
- ✅ Simplified deployment
- ✅ Better SEO (single domain)
- ✅ Easier to manage

## **Option 2: Reverse Proxy Setup**

### Structure:
```
yourdomain.com/          → Frontend
yourdomain.com/api/*     → Proxied to backend
```

### With Nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (React build files)
    location / {
        root /var/www/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## **Option 3: Subdomain Approach**

### Structure:
```
yourdomain.com           → Frontend
api.yourdomain.com       → Backend API
```

### Setup:
1. Deploy frontend to main domain
2. Deploy backend to subdomain
3. Update frontend environment:
   ```env
   REACT_APP_API_URL=https://api.yourdomain.com/api
   ```

## **Current Configuration**

Your app is already configured for same-domain deployment:

### ✅ **Ready Files:**
- `vercel.json` (root) - Routes `/api/*` to backend
- `.env.production` - Uses `/api` for same domain
- All frontend files use environment variables

### 🚀 **Deploy Command:**
```bash
# From project root directory
vercel --prod
```

### 📋 **Environment Variables (Vercel Dashboard):**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secure-secret
NODE_ENV=production
```

## **Benefits of Same Domain**

1. **No CORS Issues**: Same origin = no cross-origin problems
2. **Single SSL Certificate**: One domain, one certificate
3. **Better Performance**: No additional DNS lookups
4. **Simpler Configuration**: One deployment, one domain
5. **SEO Benefits**: All content under one domain
6. **Cookie Sharing**: Frontend and backend can share cookies easily

## **Testing Same Domain Locally**

To test same-domain setup locally, use a proxy in your React app:

**Add to frontend/package.json:**
```json
{
  "proxy": "http://localhost:5000"
}
```

Then use `/api/...` in your frontend code instead of full URLs.

## **Deployment Result**

After deployment, your app will work like this:
- `https://yourdomain.com` → Your React frontend
- `https://yourdomain.com/products` → Product page
- `https://yourdomain.com/admin` → Admin panel  
- `https://yourdomain.com/api/products` → Backend API
- `https://yourdomain.com/api/auth/login` → Login API

Perfect same-domain setup! 🎉