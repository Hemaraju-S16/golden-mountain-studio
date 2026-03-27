# Setup Guide for Netlify + Supabase

## Problem
Images stored as base64 in localStorage overflow the size limit (~5-10MB), causing images to not display in the admin dashboard.

## Solution
Using Supabase (free tier) for image storage + database, with Netlify Functions as the backend.

---

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Click **+ New Project** button
3. Fill in:
   - **Project Name**: anything you want (e.g., "narachi-coin")
   - **Database Password**: create a strong password
   - **Region**: pick closest to you
4. Click **Create new project** and wait 2-3 minutes for initialization
5. You'll see a green checkmark when done

### Getting Your API Keys:

1. In the left sidebar, click **Settings** (gear icon)
2. Click **API** in the submenu
3. Look for **Project API keys** section with these fields:
   - **Project URL** (starts with `https://`) - **COPY THIS**
   - **anon public** (long string starting with `eyJ`) - **COPY THIS**
4. Save both in a text file for Step 4 below

**Example:**
```
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 2: Create Database Table

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **+ New Query**
3. Copy and paste this SQL:

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

-- Enable RLS (Row Level Security)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (for development - restrict in production)
CREATE POLICY "Public submissions" ON submissions
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click **Run** button (blue play icon)
5. You should see "✓ Success" message

---

## Step 3: Create Storage Bucket

1. In Supabase, click **Storage** (left sidebar)
2. Click **+ New Bucket** button
3. In the popup:
   - **Name**: `narachi-photos` (exactly this name!)
   - **Public bucket**: Toggle this **ON** (important!)
4. Click **Create Bucket**
5. You should see `narachi-photos` in the bucket list
4. In **Policies**, add:
   - Authenticated users can upload: `INSERT`
   - Anyone can view: `SELECT`

---

## Step 4: Add Environment Variables to Netlify

Now you'll add your Supabase keys to Netlify so your app can connect to the database.

1. Go to your Netlify site dashboard: https://app.netlify.com
2. Click your site name
3. Go to **Site settings** (top menu)
4. Click **Build & Deploy** (left sidebar)
5. Click **Environment** (left submenu)
6. Click **+ Add variable** button
7. Add first variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: paste your Project URL from Step 1
8. Click **+ Add variable** again
9. Add second variable:
   - **Key**: `SUPABASE_ANON_KEY`
   - **Value**: paste your anon key from Step 1
10. Both variables should now show in the list

**Example:**
```
SUPABASE_URL = https://xyzabc123.supabase.co
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 5: Deploy

Now deploy your updated website with all the backend code.

```bash
# Open terminal in your website folder
cd /path/to/your/website

# Install npm packages (one time only)
npm install

# Deploy to Netlify
netlify deploy --prod
```

This uploads your files + Netlify Functions + all code changes.

---

## Step 6: Test It Works

1. **Open your live site** (from Netlify dashboard)
2. **Submit the form** with:
   - Your name
   - Your email
   - Optional city
   - A photo
3. **Login to admin** (bottom of page)
4. **Click "Submissions"** tab
5. **You should see:**
   - Your photo displayed (not just a broken image!)
   - Your email in the email column
   - Your name and city
   - CSV export button works

**If photos don't show:**
- Check Netlify environment variables are set (Step 4)
- Check Supabase bucket `narachi-photos` exists and is Public
- Check browser console for errors (F12 > Console tab)
- Check Netlify Function logs: Site settings > Functions

**Everything working? You're done! 🎉**

---

## Troubleshooting

**Images not showing in admin?**
- Check browser console for errors
- Verify Supabase URL and key are correct in Netlify env vars
- Check Supabase storage permissions

**Functions failing?**
- Check Netlify Functions logs: `Site settings > Functions`
- Verify environment variables are set
- Check that Supabase table exists

**Images uploading but not visible?**
- Ensure storage bucket is **Public**
- Check bucket policies allow public read access

---

## Free Tier Limits
- Supabase: 500MB storage, unlimited API calls
- Netlify: 125k requests/month

For production, consider upgrading Supabase to a paid plan for more storage.
