const { createClient } = require('@supabase/supabase-js');

// Debug: Check if env vars are loaded
const url = process.env.SUPABASE_URL;
// Prefer service role key for server-side operations; fall back to anon if not set
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ ERROR: Supabase environment variables not found!');
  console.error('SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
}

const supabase = createClient(url, key);
console.log('Supabase client initialized using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  console.log('Upload function called:', event.httpMethod);
  console.log('Event body length:', event.body?.length);
  
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  try {
    // Parse the request body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (e) {
      console.error('JSON parse error:', e.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }
    
    const { file, bucket, path } = parsedBody;
    
    if (!file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing file data' })
      };
    }
    if (!bucket) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing bucket name' })
      };
    }
    if (!path) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing file path' })
      };
    }
    
    console.log(`Uploading to bucket: ${bucket}, path: ${path}, file size: ${file.length}`);
    
    // Convert base64 to buffer
    let buffer;
    try {
      // Remove data:image/png;base64, prefix if present
      const base64String = file.includes(',') ? file.split(',')[1] : file;
      buffer = Buffer.from(base64String, 'base64');
      console.log('Buffer created, size:', buffer.length, 'bytes');
    } catch (e) {
      console.error('Buffer creation error:', e.message);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid base64 data: ' + e.message })
      };
    }
    
    console.log('Calling Supabase storage upload...');
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: 'image/png',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log('✅ Upload successful:', data.path);
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    const publicUrl = urlData?.publicUrl || `https://${url.split('//')[1]}/storage/v1/object/public/${bucket}/${path}`;
    console.log('Public URL:', publicUrl);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        url: publicUrl, 
        path: data.path,
        success: true 
      })
    };
  } catch (error) {
    console.error('❌ Upload function error:', error);
    console.error('Error message:', error.message);
    console.error('Error type:', error.constructor.name);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Unknown error',
        type: error.constructor.name
      })
    };
  }
};
