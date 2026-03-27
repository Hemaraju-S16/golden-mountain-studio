# Deploy Fix Guide

## Why Deployment Failed

**Most Common Reason:** You uploaded only HTML/image files without the `netlify/functions/` folder. This breaks the backend API that handles image uploads.

---

## ✅ Fix: Re-Deploy Correctly

### What You Need to Upload to Netlify:

```
website/
├── index.html                    ✅ Upload
├── logo.png                      ✅ Upload
├── netlify.toml                  ✅ Upload
├── package.json                  ✅ Upload
├── netlify/                      ✅ IMPORTANT - Upload this FOLDER
│   └── functions/
│       ├── submissions.js        ✅ Upload
│       └── upload.js             ✅ Upload
├── README_FIX.md                 ✅ Upload
├── START_HERE.md                 ✅ Upload
└── (all other .md files)         ✅ Upload
```

### Do NOT Upload:
- ❌ node_modules/ folder
- ❌ .git/ folder
- ❌ .env file (only .env.example)

---

## Step 1: Make Sure You Have Environment Variables Set

**CRITICAL:** Before deploying, go to Netlify and verify:

1. Go to https://app.netlify.com → Click **golden-mountain-studio**
2. Click **Site settings** (top menu)
3. Click **Build & Deploy** (left sidebar)
4. Click **Environment** (left submenu)
5. You should see **BOTH** variables:
   - `SUPABASE_URL` = https://...supabase.co
   - `SUPABASE_ANON_KEY` = eyJ...

**If they're missing, add them now!** (See SETUP_SUPABASE.md Step 1 for how to get the keys)

---

## Step 2: Delete Old Failed Deploy

1. Go to https://app.netlify.com → Click **golden-mountain-studio**
2. Click **Deploys** tab
3. Find the failed deploy (shows red X)
4. Click **...** menu → **Delete**

---

## Step 3: Re-Upload with netlify Folder

### Method A: Using File Explorer (Easiest)

1. **Open your website folder** in file explorer:
   - Windows: `C:\Users\YourName\MasterXeon1001\ai_project_1m\website`
   - Mac: `/Users/YourName/MasterXeon1001/ai_project_1m/website`
   - Linux: `/home/my3dmeta/MasterXeon1001/ai_project_1m/website`

2. **Select ALL files** in that folder:
   - index.html
   - logo.png
   - netlify/ ← **MAKE SURE THIS FOLDER IS SELECTED**
   - netlify.toml
   - package.json
   - All .md files

3. **Drag them into Netlify**:
   - Go to https://app.netlify.com → Click your site
   - Look for **"Drag to deploy"** or **"Drop site folder here"**
   - Drag the selected files into that area
   - Wait for upload to complete

### Method B: Using ZIP File

1. **Go to your project folder**:
   ```
   /home/my3dmeta/MasterXeon1001/ai_project_1m/website
   ```

2. **Create a ZIP with all files** (excluding node_modules):
   - Right-click the `website` folder
   - Click "Compress" or "Create Archive"
   - Save it as `website-deploy.zip`

3. **Upload to Netlify**:
   - Go to https://app.netlify.com → Click your site
   - Find **"Drag to deploy"**
   - Drag the ZIP file in
   - Netlify will auto-extract it

---

## Step 4: Wait for Deployment

You should see:
- ⏳ "Building..." message
- ✅ "Deployed" when complete
- Green checkmark next to the deploy

---

## Step 5: Test

1. Visit your live site
2. Try uploading a photo in the form
3. Login to admin
4. Click "Submissions" tab
5. **Photos should now appear!** ✅

---

## Still Failing? Here's What to Check

### ❌ "Build failed" error

**Fix:** Check if environment variables are set (Step 1 above). Without them, Netlify Functions can't access Supabase.

### ❌ "Function not found" error

**Fix:** You didn't upload the `netlify/functions/` folder. Try again, making sure the `netlify` folder is included.

### ❌ "Images still not showing"

**Fix:**
1. Verify env vars are set in Netlify
2. Verify Supabase bucket `narachi-photos` is Public
3. Check browser console (F12) for errors
4. Check Netlify Function logs: Site settings > Functions

### ❌ Photos upload but don't appear in admin

**Fix:** 
1. Check admin panel loads (login works)
2. Check browser console for errors
3. Check Netlify Function logs
4. Verify Supabase database table exists

---

## Verify Everything is Deployed

After successful deployment, you should see in Netlify:

```
✅ site is live
✅ Functions are available
✅ Environment variables are set
✅ Deploys tab shows green checkmark
```

Check Netlify Functions tab:
```
Functions
├── submissions       ✅ Should be here
└── upload           ✅ Should be here
```

---

## Quick Checklist Before Deploy

- [ ] Environment variables set in Netlify? (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Supabase database table exists?
- [ ] Supabase storage bucket `narachi-photos` is Public?
- [ ] Uploading the `netlify/` folder (not just HTML files)?
- [ ] Deleted old failed deploy?
- [ ] netlify.toml file exists in root?
- [ ] package.json exists in root?

---

**All set? Try deploying again!**

If it still fails, go to **Deploys** tab and click **"Deploy log"** - that will show the exact error. Share that error message with me!
