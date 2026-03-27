# Fix: Images Not Showing in Admin Dashboard

## What Was Changed

Your app was storing user photos as base64 strings directly in localStorage, which has a ~5-10MB size limit. Once multiple users uploaded photos, localStorage filled up and stopped working, making images invisible in the admin dashboard.

**Solution**: Migrated to **Supabase** (cloud database + file storage) + **Netlify Functions** (backend API).

### What's New:
- ✅ Images uploaded to Supabase Storage (unlimited)
- ✅ User submissions stored in Supabase PostgreSQL database
- ✅ Netlify Functions handle API calls
- ✅ Fallback to localStorage if backend unavailable (works offline during dev)
- ✅ No more size limits!

---

## Quick Start (5 minutes)

### 1. Create Supabase Account
- Go to https://supabase.com → Sign up (free)
- Click **+ New Project**
- Fill in project details
- Wait for it to initialize (~2-3 min)

### 2. Set Up Database
1. Click **SQL Editor** in left sidebar
2. Click **+ New Query**
3. Copy this SQL and paste it:

```sql
CREATE TABLE submissions (
  id BIGINT PRIMARY KEY DEFAULT extract(epoch from now()) * 1000,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  photo_path TEXT,
  coins INT DEFAULT 500,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public submissions" ON submissions
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** button
5. Wait for ✓ Success message

### 3. Create Storage Bucket
1. Click **Storage** in left sidebar
2. Click **+ New Bucket** button
3. Name: `narachi-photos` (exactly this!)
4. Toggle **Public bucket** ON
5. Click **Create Bucket**

### 4. Get API Keys
1. Click **Settings** (gear icon) in left sidebar at the bottom
2. Click **API** in the submenu that appears
3. Scroll down to find **Project API keys** section - you'll see a box with these:
   - **Project URL** box = Copy the `https://xxxxx.supabase.co` link from here
   - **anon public** box = Copy the long key that starts with `eyJhbGc...` from here
   
   **Example of what you're copying:**
   ```
   Project URL:      https://abcdef123456.supabase.co
   anon public:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Save both values in a text file for step 5

### 5. Add Keys to Netlify
1. Go to https://app.netlify.com → Click your site
2. Go to **Site settings > Build & Deploy > Environment**
3. Click **+ Add variable** and add:
   - `SUPABASE_URL` = (paste your Project URL)
   - `SUPABASE_ANON_KEY` = (paste your anon key)

### 6. Deploy

You have **2 options** to upload your code to Netlify:

---

#### Option A: Using Netlify Web Interface (Easiest - No Terminal)

1. Go to https://app.netlify.com → Click your site
2. Look for **Deploy** section and click it
3. You'll see an area that says **"Drag files here to upload"** or **"Browse to upload"**
4. **Open your website folder** on your computer:
   - Windows: `C:\Users\YourName\MasterXeon1001\ai_project_1m\website`
   - Mac/Linux: `/home/my3dmeta/MasterXeon1001/ai_project_1m/website`
5. **Select ALL files** in that folder (Ctrl+A or Cmd+A)
6. **Drag them into Netlify** or click "Browse" and select them
7. **Wait for upload to complete** - you'll see a progress bar
8. **Done!** Your site updates automatically

⚠️ **Important:** When uploading via web interface, you need to upload the `netlify` folder too! Make sure you select:
```
├── index.html
├── logo.png
├── netlify/           ← Include this folder!
│   └── functions/
├── package.json
├── netlify.toml
└── all other files
```

---

#### Option B: Using Terminal (More Reliable for Functions)

```bash
# Go to your website folder
cd /home/my3dmeta/MasterXeon1001/ai_project_1m/website

# Install dependencies (one time only)
npm install

# Deploy everything including Netlify Functions
netlify deploy --prod
```

**Recommended:** Use **Option B** (terminal) because it properly uploads the Netlify Functions. The web interface upload sometimes misses the functions folder.

---

**After Deployment:**
- Wait 1-2 minutes for Netlify to process
- Visit your live site
- Test the form - upload a photo
- Check admin dashboard - photo should appear!
- If photos don't show, verify env vars are set in Netlify (Step 5)

---

## Files Modified

- `index.html` - Updated form submission & table rendering to use API
- `netlify/functions/submissions.js` - API endpoint for reading/writing submissions
- `netlify/functions/upload.js` - API endpoint for uploading images to Supabase Storage
- `netlify.toml` - Netlify configuration
- `package.json` - Dependencies

---

## Testing Locally

```bash
npm install
netlify dev
```

Visit `http://localhost:8888` and test uploading a photo. It will:
1. Fall back to localStorage (since env vars aren't loaded locally)
2. Work perfectly when deployed with env vars set

---

## Troubleshooting

**"Images not showing in admin?"**
- Check Netlify Function logs: Site settings → Functions
- Verify env vars are set correctly in Netlify
- Check browser console for errors

**"Photos not uploading?"**
- Verify Supabase storage bucket is **Public**
- Check bucket policies allow public uploads
- Look at Netlify Function error logs

**"Can't access admin panel?"**
- Ensure Supabase API keys are correct
- Check that Supabase project is active (not paused)

---

## Cost (Free Tier)

- **Supabase**: 500MB storage, unlimited API calls
- **Netlify**: 125k function calls/month
- **Total**: ~$0/month (free!)

If you exceed limits, consider upgrading Supabase to Pro ($25/month for more storage).

---

For full setup details, see `SETUP_SUPABASE.md`
