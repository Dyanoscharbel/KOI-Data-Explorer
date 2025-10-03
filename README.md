# ExoData Fetcher 🌌

A modern React application for exploring exoplanet data from the NASA Exoplanet Archive. This app allows you to search and filter exoplanets using various criteria and download the results.

## Features

- 🔍 Advanced filtering by discovery facilities, detection methods, and planet types
- 📊 Real-time ADQL query building and display
- 📋 Interactive results table with sortable columns
- 💾 JSON export functionality
- 🌙 Modern dark theme UI
- 🚀 CORS-free API access via proxy server

## Architecture

This application uses a proxy server to bypass CORS restrictions when accessing the NASA Exoplanet Archive API. The proxy server runs on port 3001 and forwards requests to the NASA API.

## Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (includes both frontend and proxy):
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend (React + Vite) on `http://localhost:3000`
   - Proxy server on `http://localhost:3001`

3. Open your browser and navigate to `http://localhost:3000`

## Scripts

- `npm run dev` - Start both frontend and proxy server concurrently
- `npm run server` - Start only the proxy server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build

## CORS Solution

The app uses a custom Express.js proxy server to handle CORS issues with the NASA Exoplanet Archive API. The proxy server:

- Accepts requests from the frontend
- Forwards them to the NASA API
- Returns the response with proper CORS headers
- Handles errors gracefully

## API Usage

The app queries the NASA Exoplanet Archive using ADQL (Astronomical Data Query Language) to filter exoplanets based on:

- **Discovery Facilities**: Kepler, TESS, TRAPPIST, CoRoT, WASP, KELT, HAT
- **Detection Methods**: Transit, Radial Velocity, Imaging, Microlensing
- **Planet Types**: Rocky planets, Super-Earths, Gas giants
- **Host Star Names**: Search by partial name matching
