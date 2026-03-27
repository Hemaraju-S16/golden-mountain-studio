const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '12mb' }));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) console.error('Supabase env vars missing');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('Supabase client initialized (server) using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY');

// Serve static files (the SPA)
app.use(express.static(path.resolve(__dirname, '..')));

// Upload endpoint (expects JSON { file: base64, bucket, path })
app.post('/.netlify/functions/upload', async (req, res) => {
  try {
    const { file, bucket, path: filePath } = req.body || {};
    if (!file || !bucket || !filePath) return res.status(400).json({ error: 'Missing file, bucket or path' });

    const base64 = file.includes(',') ? file.split(',')[1] : file;
    const buffer = Buffer.from(base64, 'base64');

    console.log(`Uploading to bucket=${bucket} path=${filePath} size=${buffer.length}`);

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: false,
    });

    if (error) {
      console.error('Supabase upload error', error);
      return res.status(500).json({ error: error.message, details: error });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl || `https://${SUPABASE_URL.split('//')[1]}/storage/v1/object/public/${bucket}/${filePath}`;

    return res.json({ url: publicUrl, path: data.path });
  } catch (err) {
    console.error('Upload endpoint error', err);
    return res.status(500).json({ error: err.message });
  }
});

// Submissions endpoints
app.get('/.netlify/functions/submissions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('submissions').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase select error', error);
      return res.status(500).json({ error: error.message });
    }
    return res.json(data || []);
  } catch (err) {
    console.error('Submissions GET error', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/.netlify/functions/submissions', async (req, res) => {
  try {
    const { name, email, city, photoPath } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: 'Missing name or email' });

    const { data, error } = await supabase.from('submissions').insert([{
      name,
      email,
      city,
      photo_path: photoPath,
      coins: 500,
      created_at: new Date().toISOString(),
    }]).select();

    if (error) {
      console.error('Supabase insert error', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data[0]);
  } catch (err) {
    console.error('Submissions POST error', err);
    return res.status(500).json({ error: err.message });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
