import https from 'https';
import { URL } from 'url';

// Helper function to make HTTPS requests
function makeHttpsRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(data);
        } else {
          console.error(`NASA API Error ${response.statusCode}:`, data);
          reject(new Error(`HTTP ${response.statusCode}: ${data || response.statusMessage}`));
        }
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    // Set timeout
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, format = 'json' } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Build the NASA API URL
    const nasaApiUrl = new URL('https://exoplanetarchive.ipac.caltech.edu/TAP/sync');
    nasaApiUrl.searchParams.set('query', query);
    nasaApiUrl.searchParams.set('format', format);

    console.log(`Proxying request to: ${nasaApiUrl.toString()}`);

    // Make the request to NASA API
    const data = await makeHttpsRequest(nasaApiUrl.toString());
    
    // Try to parse JSON response, but handle cases where it might be plain text error
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      // If it's not JSON, it might be a plain text error message
      console.error('Non-JSON response from NASA API:', data);
      return res.status(500).json({ 
        error: 'Invalid response format from NASA API', 
        details: data.substring(0, 500) // Limit error message length
      });
    }
    
    // Send the response back to the client
    res.json(jsonData);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Send appropriate error response
    if (error.message.includes('JSON')) {
      res.status(500).json({ error: 'Invalid JSON response from NASA API' });
    } else if (error.message.includes('404')) {
      res.status(404).json({ error: 'NASA API endpoint not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch data from NASA API' });
    }
  }
}
