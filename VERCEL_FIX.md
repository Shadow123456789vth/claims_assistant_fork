# Fix Vercel Not Recognizing Vite Project

## Problem
Vercel is not detecting the project as a Vite application because the Vite app is in a subdirectory (`claims-portal/`) instead of the root.

## Solution: Configure Vercel Dashboard Settings

### Step 1: Go to Vercel Project Settings

1. Open your project in Vercel dashboard
2. Go to **Settings** → **General**

### Step 2: Update Build & Development Settings

Set these **EXACT** values:

#### Framework Preset
```
Vite
```

#### Root Directory
```
claims-portal
```
⚠️ **IMPORTANT**: Set this to `claims-portal` (not root)

#### Build Command
```
npm run build
```
(No need for `cd claims-portal` when Root Directory is set)

#### Output Directory
```
dist
```
(Relative to Root Directory)

#### Install Command
```
npm install
```

#### Development Command (optional)
```
npm run dev
```

### Step 3: Node.js Version

Scroll to **Node.js Version** section and set:
```
20.x
```

### Step 4: Environment Variables (Optional)

These are only needed if you're integrating with ServiceNow:

```
VITE_SERVICENOW_URL = https://nextgenbpmnp1.service-now.com
VITE_SERVICENOW_USERNAME = (leave empty)
VITE_SERVICENOW_PASSWORD = (leave empty)
```

For demo purposes, you can skip this entirely.

### Step 5: Save & Redeploy

1. Click **Save** at the bottom
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment

## Alternative: Use vercel.json (Already Done)

I've updated your `vercel.json` to include:
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "cd claims-portal && npm install && npm run build",
  "outputDirectory": "claims-portal/dist",
  "installCommand": "npm install --prefix claims-portal"
}
```

However, **Dashboard settings override vercel.json**, so make sure to set the Root Directory in the dashboard.

## Testing the Fix

### Option A: Local Build Test
```bash
cd claims-portal
npm install
npm run build
```

If this succeeds, Vercel should work with proper configuration.

### Option B: Vercel CLI Test
```bash
npm install -g vercel
cd claims-portal
vercel build
```

## Common Errors & Fixes

### Error: "No framework detected"
**Fix**: Set Root Directory to `claims-portal` in Vercel dashboard

### Error: "Command not found: vite"
**Fix**: Make sure Install Command runs `npm install` in the correct directory

### Error: "Could not find package.json"
**Fix**: Set Root Directory to `claims-portal`

### Error: "Build exceeded maximum duration"
**Fix**: Your bundle is large (1.1MB). Consider code splitting, but this is not blocking.

### Error: "Buffer is not defined"
**Fix**: This should not affect the build, only runtime. The build should still succeed.

## Expected Build Output

You should see something like:
```
[Build] Running build command: npm run build
[Build] vite v6.4.1 building for production...
[Build] transforming...
[Build] ✓ 290 modules transformed.
[Build] rendering chunks...
[Build] dist/index.html                     0.96 kB
[Build] dist/assets/index-xxx.css          29.89 kB
[Build] dist/assets/index-xxx.js        1,178.60 kB
[Build] ✓ built in 13.32s
[Deployment] Build completed successfully
```

## Verification Checklist

After configuration:
- [ ] Framework Preset = "Vite"
- [ ] Root Directory = "claims-portal"
- [ ] Build Command = "npm run build"
- [ ] Output Directory = "dist"
- [ ] Node.js Version = 20.x
- [ ] Saved settings
- [ ] Triggered redeploy
- [ ] Build succeeded
- [ ] Deployment succeeded
- [ ] Site loads correctly

## Still Having Issues?

1. **Check Build Logs**: Look for the specific error message
2. **Share the Error**: Copy the exact error from Vercel logs
3. **Verify Git Push**: Make sure latest code is on GitHub
4. **Clear Vercel Cache**: In Deployments, click "..." → "Redeploy" → Check "Use existing build cache" = OFF

## Quick Reference

**Correct Vercel Configuration:**
- Root: `claims-portal`
- Framework: `Vite`
- Build: `npm run build`
- Output: `dist`
- Node: `20.x`

**File Structure:**
```
claims_assistant/          (GitHub repo root)
├── vercel.json           (Vercel config)
├── package.json          (Root package with scripts)
└── claims-portal/        (Vite app - SET AS ROOT DIRECTORY)
    ├── package.json      (Vite dependencies)
    ├── vite.config.js    (Vite configuration)
    ├── index.html
    └── src/
```

---

**Need more help?** Share the exact error message from the Vercel build logs.
