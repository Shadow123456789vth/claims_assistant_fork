# Vercel Deployment Setup

## Quick Fix for Build Issues

### Issue: Buffer.from() Error
The `vite.config.js` uses `Buffer.from()` for Basic Auth encoding, which works locally but may fail on Vercel.

### Solution Options

#### Option 1: Environment Variables (Recommended)
In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables (optional, only if using ServiceNow integration):
   ```
   VITE_SERVICENOW_URL = https://nextgenbpmnp1.service-now.com
   VITE_SERVICENOW_USERNAME = (leave empty for demo)
   VITE_SERVICENOW_PASSWORD = (leave empty for demo)
   ```

3. **Important**: For the demo, these can be left empty or not added at all. The app will work without them.

#### Option 2: Update Vite Config for Vercel Compatibility

The current config should work, but if it fails, create a simplified version for production builds.

### Vercel Configuration

Your `vercel.json` is already set up correctly:
```json
{
  "buildCommand": "cd claims-portal && npm run build",
  "outputDirectory": "claims-portal/dist",
  "installCommand": "cd claims-portal && npm install"
}
```

### Build Settings in Vercel Dashboard

Make sure these settings match:

- **Framework Preset**: `Vite`
- **Build Command**: `cd claims-portal && npm run build`
- **Output Directory**: `claims-portal/dist`
- **Install Command**: `cd claims-portal && npm install`
- **Node.js Version**: `18.x` or `20.x`

### Troubleshooting

#### If build still fails:

1. **Check Build Logs** in Vercel dashboard
2. **Look for specific errors** related to:
   - Missing dependencies
   - Node version mismatch
   - Environment variable issues
   - Import/export errors

#### Common Fixes:

**Error: Cannot find module 'react-router-dom'**
- The demo uses routes but doesn't require react-router-dom
- If you see this error, you may need to add routing or remove route references

**Error: Buffer is not defined**
- This means the Vercel build environment doesn't have Buffer
- Solution: Update vite.config.js to handle this gracefully

**Error: Build exceeded maximum duration**
- Increase the deployment timeout in Vercel settings
- Or optimize the build by splitting chunks

### Testing Locally Before Deploy

Always test the build locally first:
```bash
cd claims-portal
npm run build
npm run preview
```

If this works locally, the issue is Vercel-specific.

### Deployment Workflow

1. **Commit changes**:
   ```bash
   git add .
   git commit -m "Add commercial claims demo"
   ```

2. **Push to GitHub** (use GitHub Desktop or terminal with credentials)

3. **Vercel auto-deploys** from the main/master branch

4. **Check deployment** in Vercel dashboard

### Demo Mode

For demonstration purposes, the app works perfectly without ServiceNow integration. The commercial demo data is all client-side JSON.

### Production Considerations

For production deployment with ServiceNow:
- Use OAuth 2.0 instead of Basic Auth
- Set proper CORS policies
- Use Vercel environment variables for secrets
- Enable proper security headers

---

## Quick Checklist

- [ ] Vercel project connected to GitHub repo
- [ ] Build command: `cd claims-portal && npm run build`
- [ ] Output directory: `claims-portal/dist`
- [ ] Node version: 18.x or 20.x
- [ ] Environment variables set (optional for demo)
- [ ] Local build test passed
- [ ] Push to GitHub successful
- [ ] Vercel deployment successful

---

**Need Help?** Check the Vercel deployment logs for specific error messages.
