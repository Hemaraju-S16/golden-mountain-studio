# Quick Reference - Image Upload Fix

## What Changed
- Images now upload to **Supabase Cloud Storage** (unlimited)
- User data saved to **Supabase Database** (PostgreSQL)
- Backend API via **Netlify Functions**
- No more localStorage size limits!

## Your Action Items

### Must Do (15 min):

1. **Create Supabase Account** → https://supabase.com
2. **Create Database Table** → Run SQL in Supabase Editor
3. **Create Storage Bucket** → `narachi-photos` (Public)
4. **Get API Keys** → Settings > API
5. **Add to Netlify** → Site Settings > Environment Variables
6. **Deploy** → `netlify deploy --prod`

### Code Changes Made:

✅ Added email field to form (required)
✅ Updated submission handler to upload images to cloud
✅ Converted all async operations to use backend API
✅ Added fallback to localStorage (works offline during dev)
✅ Created Netlify Functions for image & data handling
✅ Added API endpoints for admin dashboard

## Environment Variables Needed

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
```

Get these from Supabase → Settings > API

## Database Schema (SQL)

```sql
Table: submissions
├── id (BIGINT, primary key)
├── name (TEXT)
├── email (TEXT)
├── city (TEXT)
├── photo_path (TEXT) ← cloud URL
├── coins (INT)
└── created_at (TIMESTAMP)
```

## API Endpoints

### GET /.netlify/functions/submissions
Returns all user submissions with photos

### POST /.netlify/functions/submissions
Creates new submission with photo URL

### POST /.netlify/functions/upload
Uploads image to Supabase Storage bucket

## Files to Deploy

```
index.html                    (modified)
netlify/functions/
  ├── submissions.js         (new)
  └── upload.js              (new)
netlify.toml                  (new)
package.json                  (new)
```

## Testing Checklist

- [ ] Supabase project created
- [ ] SQL table created
- [ ] Storage bucket created
- [ ] API keys copied to Netlify
- [ ] npm install completed
- [ ] netlify deploy --prod completed
- [ ] Form submission works on live site
- [ ] Image appears in admin dashboard
- [ ] Email field is required and shows in table
- [ ] CSV export includes email

## Support Docs

- `README_FIX.md` - Quick start guide
- `SETUP_SUPABASE.md` - Detailed setup instructions
- `DEPLOYMENT_SUMMARY.md` - Full overview

## Common Issues

**Images not loading in admin?**
→ Check Netlify env vars are set
→ Verify Supabase bucket is Public

**Upload fails?**
→ Check function logs: Site Settings > Functions
→ Verify Supabase URL & key are correct

**No data showing?**
→ Ensure SQL table exists in Supabase
→ Check RLS policies allow public access

---

**Ready to deploy? Follow README_FIX.md in your project!**
