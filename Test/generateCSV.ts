import * as fs from 'fs';

interface House {
  name: string;
  address: string;
  coordinate: string;  // "latitude,longitude"
  start: number;       // in minutes after midnight
  end: number;         // in minutes after midnight
  priority: number;    // lower number means higher priority
}

// Generate a random coordinate within a bounding box around Sydney
function randomCoordinateSydney(): string {
  // Approximate bounding box for Sydney (customize as needed)
  const latMin = -34.0;
  const latMax = -33.6;
  const lonMin = 150.5;
  const lonMax = 151.4;

  const lat = Math.random() * (latMax - latMin) + latMin;
  const lon = Math.random() * (lonMax - lonMin) + lonMin;
  return `${lat.toFixed(6)},${lon.toFixed(6)}`;
}

// Generate random start and end times between 9:00 AM (540) and 6:00 PM (1080)
function randomTimeBetween(startMin: number, endMax: number): { start: number; end: number } {
  const start = Math.floor(Math.random() * (endMax - startMin + 1)) + startMin;
  const end = Math.floor(Math.random() * (endMax - start + 1)) + start;
  return { start, end };
}

// Create one random House object
function generateRandomHouse(index: number): House {
  const name = `House_${index + 1}`;
  const address = `Some Address ${index + 1}`;
  const coordinate = randomCoordinateSydney();
  
  const { start, end } = randomTimeBetween(540, 1080); // 540 = 9 AM, 1080 = 6 PM
  const priority = Math.floor(Math.random() * 5) + 1;   // 1 to 5

  return {
    name,
    address,
    coordinate,
    start,
    end,
    priority
  };
}

// Generate N houses and write to CSV
function generateHousesCSV(count: number, fileName: string) {
  const houses: House[] = [];

  for (let i = 0; i < count; i++) {
    houses.push(generateRandomHouse(i));
  }

  // CSV header
  const header = 'name,address,coordinate,start,end,priority\n';
  // CSV rows
  const rows = houses
    .map(h => `${h.name},${h.address},${h.coordinate},${h.start},${h.end},${h.priority}`)
    .join('\n');

  fs.writeFileSync(fileName, header + rows, { encoding: 'utf-8' });
}

// Generate 10 houses as an example:
generateHousesCSV(10, 'houses.csv');
