import fs from 'fs';
import path from 'path';

// Define the path to our visits data file
const visitsFilePath = path.join(process.cwd(), 'public', 'data', 'visits.json');

// Define the structure of our visits data
interface VisitsData {
  [productId: string]: {
    count: number;
    lastVisited: string;
  };
}

// Ensure the data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    console.log('Creating data directory:', dataDir);
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Initialize the visits file if it doesn't exist
const initializeVisitsFile = () => {
  ensureDataDirectory();
  if (!fs.existsSync(visitsFilePath)) {
    console.log('Creating visits file:', visitsFilePath);
    fs.writeFileSync(visitsFilePath, JSON.stringify({}));
  }
};

// Read the current visits data
const readVisitsData = (): VisitsData => {
  initializeVisitsFile();
  try {
    console.log('Reading visits data from:', visitsFilePath);
    const data = fs.readFileSync(visitsFilePath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log('Current visits data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error reading visits data:', error);
    return {};
  }
};

// Write the updated visits data
const writeVisitsData = (data: VisitsData) => {
  try {
    console.log('Writing visits data to:', visitsFilePath);
    console.log('Data to write:', data);
    fs.writeFileSync(visitsFilePath, JSON.stringify(data, null, 2));
    console.log('Successfully wrote visits data');
  } catch (error) {
    console.error('Error writing visits data:', error);
  }
};

// Increment the visit count for a product
export const incrementVisitCount = (productId: string): number => {
  console.log('Incrementing visit count for product:', productId);
  const visitsData = readVisitsData();
  
  if (!visitsData[productId]) {
    console.log('Creating new entry for product:', productId);
    visitsData[productId] = {
      count: 0,
      lastVisited: new Date().toISOString()
    };
  }
  
  visitsData[productId].count += 1;
  visitsData[productId].lastVisited = new Date().toISOString();
  
  console.log('Updated count for product:', productId, 'is now:', visitsData[productId].count);
  
  writeVisitsData(visitsData);
  
  return visitsData[productId].count;
};

// Get the visit count for a product
export const getVisitCount = (productId: string): number => {
  console.log('Getting visit count for product:', productId);
  const visitsData = readVisitsData();
  const count = visitsData[productId]?.count || 0;
  console.log('Current count for product:', productId, 'is:', count);
  return count;
};

// Get all visits data
export const getAllVisitsData = (): VisitsData => {
  console.log('Getting all visits data');
  return readVisitsData();
}; 