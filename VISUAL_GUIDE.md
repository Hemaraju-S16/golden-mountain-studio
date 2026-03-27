# Visual Setup Guide - Step by Step Screenshots

## Getting Your API Keys from Supabase

### Step 1: Open Supabase Dashboard
- Go to https://app.supabase.com
- Log in with your account
- Click on your project name

### Step 2: Find Settings
Look at the **LEFT SIDEBAR** - at the very bottom you'll see:
```
⚙️ Settings  ← Click here (gear icon)
```

### Step 3: Click API
Once in Settings, on the LEFT SIDEBAR you'll see:
```
Settings
├─ General
├─ Auth
├─ API          ← Click here
├─ Database
...
```

### Step 4: Find Your Keys
Once in API section, scroll down to find:

```
╔════════════════════════════════════════╗
║ PROJECT API KEYS                       ║
╠════════════════════════════════════════╣
║                                        ║
║ Service role (DO NOT USE)              ║
║ [sk_service_role_key...]               ║
║                                        ║
║ Anon public                            ║
║ [eyJhbGciOi...]  ← COPY THIS ONE       ║
║                                        ║
║ Project URL                            ║
║ [https://xxxxx.supabase.co]  ← COPY    ║
║                                        ║
╚════════════════════════════════════════╝
```

### What to Copy:
1. **Project URL** (the https://... link)
   - Should look like: `https://abcdef123456.supabase.co`
   
2. **anon public** (the long key)
   - Should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJz...`

---

## Adding Keys to Netlify

### Step 1: Open Netlify Site Dashboard
- Go to https://app.netlify.com
- Click your site name
- You should see your site's main dashboard

### Step 2: Go to Environment Variables
In the top menu bar, look for:
```
Deploys  Analytics  Logs  Access Control  Deploy Settings  Build & Deploy
                                                          ↑ Click this dropdown
```

Or in left sidebar:
```
Deploy settings
├─ Build & deploy
├─ Build function settings
├─ Environment          ← Should be in left sidebar
```

### Step 3: Add Environment Variables
You should see a button that says **"+ Add variable"** or **"Edit variables"**

Click it and add TWO variables:

**Variable 1:**
```
Key:   SUPABASE_URL
Value: https://abcdef123456.supabase.co
       (paste your Project URL here)
```

**Variable 2:**
```
Key:   SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
       (paste your anon public key here)
```

### Step 4: Save
After adding both, they should appear in a table:
```
╔════════════════════════════════════════╗
║ Environment variables                  ║
╠════════════════════════════════════════╣
║ SUPABASE_URL           (value)          ║
║ SUPABASE_ANON_KEY      (value)          ║
╚════════════════════════════════════════╝
```

---

## Creating Storage Bucket in Supabase

### Step 1: Go to Storage
In Supabase left sidebar, click:
```
⬜ Storage  ← Click here
```

### Step 2: Create New Bucket
Click the **"+ New Bucket"** button (top right)

### Step 3: Fill in Details
A dialog will appear:
```
╔════════════════════════════════════════╗
║ Create a new bucket                    ║
╠════════════════════════════════════════╣
║                                        ║
║ Bucket name *                          ║
║ [narachi-photos]   ← Type exactly this ║
║                                        ║
║ [ ] Public bucket  ← TOGGLE THIS ON ✓  ║
║                                        ║
║              [Create Bucket]           ║
╚════════════════════════════════════════╝
```

### Important: 
- Bucket name: **`narachi-photos`** (exact spelling!)
- **PUBLIC bucket toggle: MUST be ON** ✓

### Step 4: Verify
After creating, you should see in the Storage section:
```
📁 narachi-photos (Public)
```

---

## Creating Database Table in Supabase

### Step 1: Go to SQL Editor
In Supabase left sidebar:
```
🔤 SQL Editor  ← Click here
```

### Step 2: Create New Query
Click **"+ New Query"** button

### Step 3: Paste SQL
Copy the entire SQL code block from `SETUP_SUPABASE.md` and paste it:

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

### Step 4: Run It
Click the **Run** button (blue play icon on right side)

### Step 5: Success!
You should see:
```
✓ Success. 0 rows inserted
```

That means the table was created!

---

## Common Mistakes

❌ **"I can't find the API keys"**
→ Make sure you're in Settings (gear icon) > API section

❌ **"I created the bucket but it says Private"**
→ You need to toggle "Public bucket" ON before creating

❌ **"SQL is showing an error"**
→ Make sure you copied the ENTIRE code block with all 3 CREATE statements

❌ **"Environment variables aren't working"**
→ After adding to Netlify, you must deploy with `netlify deploy --prod`

---

## Need Help?

1. Check `SETUP_SUPABASE.md` for text instructions
2. Check `START_HERE.md` for the quick checklist
3. Check browser console (F12 > Console) for error messages
4. Check Netlify Function logs if upload fails

**Still stuck? The error message in your browser console usually tells you exactly what's wrong!**
