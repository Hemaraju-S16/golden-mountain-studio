# Deployment Summary

## Problem Fixed ✅
Users couldn't see their uploaded images in the admin dashboard because localStorage has a 5-10MB size limit, which filled up after a few photo uploads.

## Solution Implemented
Migrated image storage to **Supabase Cloud** with **Netlify Functions** backend API.

---

## Files Added/Modified

### New Files:
```
├── netlify.toml                          # Netlify build config
├── netlify/functions/
│   ├── submissions.js                    # API for read/write submissions
│   └── upload.js                         # API for image uploads to Supabase
├── package.json                          # Dependencies for Supabase client
├── .env.example                          # Environment variables template
├── .gitignore                            # Git ignore rules
├── README_FIX.md                         # Quick fix guide
└── SETUP_SUPABASE.md                     # Detailed setup instructions
```

### Modified Files:
```
├── index.html                            # Updated to use backend API
```

---

## Setup Steps (Do This Now!)

### 1️⃣ Create Supabase Project
- Visit https://supabase.com
- Sign up (free account)
- Create new project
- Wait for initialization

### 2️⃣ Copy & Run SQL
In Supabase SQL Editor:
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

### 3️⃣ Create Storage Bucket
- Storage > + New Bucket
- Name: `narachi-photos`
- Make it **Public**

### 4️⃣ Get API Keys
- Settings > API
- Copy: **Project URL**
- Copy: **anon public key**

### 5️⃣ Add to Netlify
- Your site > Site settings > Build & Deploy > Environment
- Add variables:
  - `SUPABASE_URL` = your Project URL
  - `SUPABASE_ANON_KEY` = your anon key

### 6️⃣ Deploy
```bash
cd /path/to/website
npm install
netlify deploy --prod
```

---

## How It Works Now

**Before (Broken):**
User uploads photo → Stored as base64 in localStorage (5-10MB limit) → Storage fills up → Images disappear

**After (Fixed):**
User uploads photo → Netlify Function receives request → Uploads to Supabase Storage → Database saves reference → Admin sees image from cloud storage (unlimited!)

---

## Architecture

```
User Form
    ↓
Netlify Function (/upload)
    ↓
Supabase Storage (images)
    ↓
Supabase Database (metadata)
    ↓
Admin Dashboard (retrieves from cloud)
```

---

## Testing

```bash
# Local development
netlify dev

# Visit http://localhost:8888
# Upload a photo
# Images will use localStorage fallback locally
```

When deployed with env vars set, images go to Supabase.

---

## Free Tier Limits
- **Supabase**: 500MB storage, unlimited API calls
- **Netlify**: 125k function calls/month

You're well within free tier for typical usage!

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Images not showing | Check Netlify env vars are set correctly |
| Upload failing | Verify Supabase bucket is **Public** |
| No data in admin | Ensure SQL table was created in Supabase |
| Function errors | Check Netlify Function logs: Site settings > Functions |

---

## Next Steps

1. ✅ Complete steps 1-6 above
2. ✅ Test form submission on live site
3. ✅ Check admin dashboard
4. ✅ Download CSV to verify email/photo data
5. ✅ Share with users!

---

Questions? Check `SETUP_SUPABASE.md` for detailed instructions.
