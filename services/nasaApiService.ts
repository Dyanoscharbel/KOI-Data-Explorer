
import { NASA_TAP_API_URL } from '../constants';
import { Exoplanet } from '../types';

export const fetchExoplanetData = async (adqlQuery: string): Promise<Exoplanet[]> => {
  const url = new URL(NASA_TAP_API_URL);
  url.searchParams.set('query', adqlQuery);
  url.searchParams.set('format', 'json');

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(`API Error (${response.status}): ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Check if the response contains an error
    if (data.error) {
      throw new Error(`API Error: ${data.error}`);
    }
    
    // The API can return an empty array or an array of objects.
    if (!Array.isArray(data)) {
        throw new Error("Unexpected API response format. Expected an array.");
    }
    
    return data as Exoplanet[];
  } catch (error) {
    if (error instanceof Error) {
        console.error("Failed to fetch exoplanet data:", error.message);
        throw new Error(`Failed to fetch data. Please check your query and network connection. Details: ${error.message}`);
    }
    console.error("An unknown error occurred:", error);
    throw new Error("An unknown error occurred while fetching data.");
  }
};
