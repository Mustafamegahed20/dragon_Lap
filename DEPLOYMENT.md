# Dragon Lap E-commerce Deployment Guide

## Overview
This guide covers how to deploy your Dragon Lap e-commerce application to production using Vercel for the backend and any hosting service for the frontend.

## Current Setup
- **Backend**: Configured for Vercel serverless deployment
- **Frontend**: React app that can be deployed to any static hosting service
- **Database**: MongoDB (already configured)

## 1. Backend Deployment (Vercel)

### Prerequisites
- Vercel account
- MongoDB Atlas account (or any MongoDB provider)

### Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel --prod
   ```

3. **Configure Environment Variables in Vercel**:
   Go to your Vercel dashboard → Your Project → Settings → Environment Variables

   Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NODE_ENV`: production

### Backend API Endpoints
Once deployed, your backend will be available at: `https://your-project-name.vercel.app`

Example endpoints:
- `https://your-project-name.vercel.app/api/products`
- `https://your-project-name.vercel.app/api/auth/login`
- `https://your-project-name.vercel.app/api/categories`

## 2. Frontend Deployment

### Option A: Vercel (Recommended)
1. **Create `.env.production` file in frontend folder**:
   ```env
   REACT_APP_API_URL=https://your-backend-app.vercel.app/api
   ```

2. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Option B: Netlify
1. **Build the project**:
   ```bash
   cd frontend
   REACT_APP_API_URL=https://your-backend-app.vercel.app/api npm run build
   ```

2. **Deploy the `build` folder to Netlify**

### Option C: Other Hosting Services
Build with the production API URL:
```bash
cd frontend
REACT_APP_API_URL=https://your-backend-app.vercel.app/api npm run build
```

Then upload the `build` folder to your hosting service.

## 3. Environment Configuration

### Backend (.env file)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dragonlap?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-here
NODE_ENV=production
PORT=5000
```

### Frontend (.env.production file)
```env
REACT_APP_API_URL=https://your-backend-app.vercel.app/api
```

## 4. Custom Domain Setup (Optional)

### Backend Custom Domain
1. Go to Vercel Dashboard → Your Backend Project → Settings → Domains
2. Add your custom domain (e.g., `api.yourdomain.com`)
3. Configure DNS according to Vercel's instructions

### Frontend Custom Domain
1. Configure your hosting service's custom domain settings
2. Update DNS records to point to your hosting service

### Update Frontend Configuration
If using custom domains, update the frontend environment variable:
```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

## 5. Testing Production Deployment

### Test Backend API
```bash
curl https://your-backend-app.vercel.app/api/products
```

### Test Frontend
1. Visit your deployed frontend URL
2. Test user registration/login
3. Test product browsing and ordering
4. Test admin functionality (if applicable)

## 6. CORS Configuration

The backend is already configured for production CORS. If you encounter CORS issues, make sure your frontend domain is included in the CORS configuration.

## 7. Database Setup

Make sure your MongoDB database:
1. Has the correct connection string in environment variables
2. Has network access configured for Vercel's IP ranges (or set to 0.0.0.0/0 for simplicity)
3. Has the required collections and data

## 8. SSL/HTTPS

Both Vercel and most modern hosting services provide SSL certificates automatically. Your deployed apps will use HTTPS by default.

## Troubleshooting

### Common Issues

1. **API calls failing**: Check that REACT_APP_API_URL is correctly set
2. **Database connection errors**: Verify MONGODB_URI and network access
3. **Authentication issues**: Check JWT_SECRET is set in backend
4. **CORS errors**: Ensure your frontend domain is allowed in CORS config

### Logs and Debugging

- **Vercel Backend Logs**: Vercel Dashboard → Your Project → Functions tab
- **Frontend Console**: Browser developer tools
- **Network Requests**: Browser developer tools Network tab

## Example Deployment Commands

### Full deployment script:
```bash
# Deploy backend
cd backend
vercel --prod

# Note the backend URL from output
BACKEND_URL="https://your-backend-app.vercel.app"

# Deploy frontend with backend URL
cd ../frontend
REACT_APP_API_URL="$BACKEND_URL/api" vercel --prod
```

## Production Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to hosting service
- [ ] Environment variables configured
- [ ] Database accessible from production
- [ ] Custom domains configured (if needed)
- [ ] SSL certificates working
- [ ] All API endpoints tested
- [ ] Authentication working
- [ ] Admin functionality working
- [ ] Error monitoring set up (optional)

Your Dragon Lap e-commerce site should now be live and accessible to users worldwide!