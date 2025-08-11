# Dragon Lap Backend - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account (sign up at [mongodb.com](https://mongodb.com))
- Vercel CLI installed: `npm install -g vercel`

### 2. MongoDB Atlas Setup
1. Create a new cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Whitelist all IP addresses (0.0.0.0/0) for Vercel serverless functions
4. Copy your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/dragonlap`)

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Navigate to backend directory
cd backend

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# Redeploy with environment variables
vercel --prod
```

#### Option B: Deploy via GitHub
1. Push this code to GitHub
2. Connect your GitHub repo to Vercel dashboard
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### 4. Environment Variables
Set these in Vercel dashboard or via CLI:

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dragonlap` | MongoDB Atlas connection string |
| `JWT_SECRET` | `your_super_secret_jwt_key_2024` | JWT signing secret |
| `NODE_ENV` | `production` | Environment mode |

### 5. Frontend Configuration
Update your frontend's API URLs to point to your Vercel deployment:

```javascript
// In frontend/src/api.js or wherever you define API endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-app-name.vercel.app/api';
```

Add to your frontend's `.env` file:
```
REACT_APP_API_URL=https://your-vercel-app-name.vercel.app/api
```

## 📁 Project Structure for Vercel

```
backend/
├── api/                          # Serverless functions
│   ├── index.js                 # Root endpoint
│   ├── categories.js            # GET /api/categories
│   ├── products.js              # GET /api/products
│   ├── orders.js                # POST /api/orders
│   ├── products/
│   │   └── [id].js             # GET /api/products/:id
│   ├── auth/
│   │   ├── login.js            # POST /api/auth/login
│   │   └── register.js         # POST /api/auth/register
│   └── admin/
│       ├── orders.js           # GET /api/admin/orders
│       └── orders/
│           └── [id]/
│               └── status.js   # PUT /api/admin/orders/:id/status
├── lib/                         # Shared utilities
│   ├── mongodb.js              # Database connection
│   └── auth.js                 # Authentication helpers
├── models/                      # Mongoose models
│   ├── Category.js
│   ├── Product.js
│   ├── User.js
│   ├── Order.js
│   └── Review.js
├── vercel.json                 # Vercel configuration
├── package.json
└── .vercelignore              # Files to ignore during deployment
```

## 🔗 API Endpoints

Once deployed, your API will be available at:
- `https://your-app-name.vercel.app/api/categories`
- `https://your-app-name.vercel.app/api/products`
- `https://your-app-name.vercel.app/api/products/:id`
- `https://your-app-name.vercel.app/api/auth/login`
- `https://your-app-name.vercel.app/api/auth/register`
- `https://your-app-name.vercel.app/api/orders`
- `https://your-app-name.vercel.app/api/admin/orders`
- `https://your-app-name.vercel.app/api/admin/orders/:id/status`

## 🗄️ Data Migration

If you have existing SQLite data, run the migration script locally before deploying:
```bash
# Make sure MongoDB Atlas is accessible
node migrate-to-mongodb.js
```

## 🔧 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)
   - Ensure database user has proper permissions

2. **CORS Issues**
   - CORS headers are included in all API functions
   - Update frontend URLs to match your Vercel deployment

3. **Function Timeout**
   - Vercel free tier has 10s timeout limit
   - Pro tier allows up to 60s
   - Complex operations might need optimization

4. **Environment Variables Not Working**
   - Redeploy after adding environment variables
   - Use `vercel env ls` to verify variables are set

## 📊 Monitoring

- View logs in Vercel dashboard
- Monitor function execution time
- Check error rates and responses

## 🌟 Production Optimizations

1. **Database Connection Pooling**: Already implemented in `lib/mongodb.js`
2. **CORS Optimization**: Pre-configured for all endpoints
3. **Error Handling**: Comprehensive error handling in all functions
4. **Rate Limiting**: Built-in for auth endpoints

## 🔄 Updates and Maintenance

To update your deployment:
1. Make changes to your code
2. Push to GitHub (if using GitHub integration) or run `vercel --prod`
3. Vercel will automatically redeploy

## 💡 Tips

- Use MongoDB Atlas for production database
- Monitor your usage in Vercel dashboard
- Set up custom domain in Vercel settings
- Use environment variables for all secrets
- Consider upgrading to Vercel Pro for better limits