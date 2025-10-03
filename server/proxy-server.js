import express from 'express';
import cors from 'cors';
import https from 'https';
import { URL } from 'url';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint for NASA Exoplanet Archive API
app.get('/api/exoplanets', async (req, res) => {
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
});

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
          // Include the actual response body in the error for debugging
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

// Test endpoint to debug NASA API and get all columns
app.get('/test', async (req, res) => {
  try {
    // Try a simple query first to see if table exists
    const testQuery = 'SELECT kepoi_name FROM cumulative WHERE ROWNUM <= 1';
    const nasaApiUrl = new URL('https://exoplanetarchive.ipac.caltech.edu/TAP/sync');
    nasaApiUrl.searchParams.set('query', testQuery);
    nasaApiUrl.searchParams.set('format', 'json');

    console.log(`Testing simple query: ${nasaApiUrl.toString()}`);
    const data = await makeHttpsRequest(nasaApiUrl.toString());
    
    // Parse to see if it works
    let jsonData;
    try {
      jsonData = JSON.parse(data);
      
      // If simple query works, try getting all columns
      if (jsonData && Array.isArray(jsonData)) {
        const fullQuery = 'SELECT * FROM cumulative WHERE ROWNUM <= 1';
        const fullUrl = new URL('https://exoplanetarchive.ipac.caltech.edu/TAP/sync');
        fullUrl.searchParams.set('query', fullQuery);
        fullUrl.searchParams.set('format', 'json');
        
        const fullData = await makeHttpsRequest(fullUrl.toString());
        const fullJsonData = JSON.parse(fullData);
        const columns = fullJsonData.length > 0 ? Object.keys(fullJsonData[0]) : [];
        
        res.json({ 
          success: true, 
          query: fullQuery, 
          columnCount: columns.length,
          columns: columns.sort(),
          sampleData: fullJsonData[0] || null
        });
      } else {
        res.json({ 
          success: true, 
          query: testQuery, 
          result: jsonData
        });
      }
    } catch (parseError) {
      res.json({ 
        success: false, 
        query: testQuery, 
        parseError: parseError.message,
        rawResponse: data.substring(0, 2000)
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      query: 'SELECT kepoi_name FROM cumulative WHERE ROWNUM <= 1'
    });
  }
});

// Get available tables
app.get('/tables', async (req, res) => {
  try {
    // List all available tables
    const tablesQuery = 'SELECT table_name FROM TAP_SCHEMA.tables';
    const nasaApiUrl = new URL('https://exoplanetarchive.ipac.caltech.edu/TAP/sync');
    nasaApiUrl.searchParams.set('query', tablesQuery);
    nasaApiUrl.searchParams.set('format', 'json');

    console.log(`Getting tables list: ${nasaApiUrl.toString()}`);
    const data = await makeHttpsRequest(nasaApiUrl.toString());
    
    let jsonData;
    try {
      jsonData = JSON.parse(data);
      const tableNames = jsonData.map(row => row.table_name);
      
      res.json({ 
        success: true, 
        query: tablesQuery, 
        tableCount: tableNames.length,
        tables: tableNames.sort()
      });
    } catch (parseError) {
      res.json({ 
        success: false, 
        error: 'Failed to parse tables response',
        rawResponse: data.substring(0, 1000)
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      query: 'SELECT table_name FROM TAP_SCHEMA.tables'
    });
  }
});

// Get schema information for a specific table
app.get('/schema/:tableName', async (req, res) => {
  try {
    const tableName = req.params.tableName;
    // Try to get table schema information
    const schemaQuery = `SELECT column_name FROM TAP_SCHEMA.columns WHERE table_name = '${tableName}'`;
    const nasaApiUrl = new URL('https://exoplanetarchive.ipac.caltech.edu/TAP/sync');
    nasaApiUrl.searchParams.set('query', schemaQuery);
    nasaApiUrl.searchParams.set('format', 'json');

    console.log(`Getting schema info for ${tableName}: ${nasaApiUrl.toString()}`);
    const data = await makeHttpsRequest(nasaApiUrl.toString());
    
    let jsonData;
    try {
      jsonData = JSON.parse(data);
      const columnNames = jsonData.map(row => row.column_name);
      
      res.json({ 
        success: true, 
        tableName: tableName,
        query: schemaQuery, 
        columnCount: columnNames.length,
        columns: columnNames.sort()
      });
    } catch (parseError) {
      res.json({ 
        success: false, 
        error: 'Failed to parse schema response',
        rawResponse: data.substring(0, 1000)
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message,
      query: `SELECT column_name FROM TAP_SCHEMA.columns WHERE table_name = '${req.params.tableName}'`
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to proxy requests to NASA Exoplanet Archive API`);
});
