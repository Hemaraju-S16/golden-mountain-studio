const { createClient } = require('@supabase/supabase-js');

// Debug: Check if env vars are loaded
const url = process.env.SUPABASE_URL;
// Prefer service role key on server; fallback to anon key
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ ERROR: Supabase environment variables not found!');
  console.error('SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
  console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
}

const supabase = createClient(url, key);
console.log('Supabase client initialized using', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY');

exports.handler = async (event) => {
  // Debug logs
  console.log('Function called:', event.httpMethod);
  
  if (event.httpMethod === 'GET') {
    try {
      console.log('GET request to submissions');
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Retrieved', data.length, 'submissions');
      return {
        statusCode: 200,
        body: JSON.stringify(data || [])
      };
    } catch (error) {
      console.error('❌ GET error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }
  
  if (event.httpMethod === 'POST') {
    try {
      const { name, email, city, photoPath } = JSON.parse(event.body);
      
      console.log('POST request - name:', name, 'email:', email, 'city:', city);
      
      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          name,
          email,
          city,
          photo_path: photoPath,
          coins: 500,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }
      
      console.log('✅ Submission saved:', data[0].id);
      return {
        statusCode: 201,
        body: JSON.stringify(data[0])
      };
    } catch (error) {
      console.error('❌ POST error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }
  
  return { statusCode: 405, body: 'Method not allowed' };
};
