// src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Each inspection takes 10 minutes.
const duration = 10;

// Define the House type based on CSV columns.
interface House {
  name: string;
  address: string;
  coordinate: string;
  start: number;    // start time in minutes since midnight
  end: number;      // end time in minutes since midnight
  priority: number; // lower number means higher priority
}

/**
 * Converts a "HH:mm" time string to minutes since midnight.
 */
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Parses the CSV file into an array of House objects.
 * Expects CSV columns: name, address, coordinate, startTime, endTime, priority.
 */
function parseCSV(filePath: string): House[] {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let startIndex = 0;
  
  // Skip header if present
  if (lines[0].toLowerCase().includes('name')) {
    startIndex = 1;
  }

  const houses: House[] = [];
  for (let i = startIndex; i < lines.length; i++) {
    const fields = lines[i].split(',');
    if (fields.length < 6) continue;
    const name = fields[0].trim();
    const address = fields[1].trim();
    const coordinate = fields[2].trim();
    const startTimeStr = fields[3].trim();
    const endTimeStr = fields[4].trim();
    const priorityStr = fields[5].trim();

    const start = parseTime(startTimeStr);
    const end = parseTime(endTimeStr);
    const priority = parseInt(priorityStr, 10);

    houses.push({ name, address, coordinate, start, end, priority });
  }
  return houses;
}

/**
 * Generates all valid chains of houses that can be inspected.
 * A house can be inspected if starting at max(currentTime, house.start) plus the duration is within its end time.
 */
function findAllChains(houses: House[]): House[][] {
  // Sort houses by end time (earlier deadlines first)
  houses.sort((a, b) => a.end - b.end);
  const results: House[][] = [];

  /**
   * Recursive backtracking function.
   * @param index - current index in the houses array
   * @param currentTime - current time in minutes since midnight
   * @param chain - current chain (list of houses)
   */
  function backtrack(index: number, currentTime: number, chain: House[]) {
    // Save a copy of the current chain.
    results.push([...chain]);
    for (let i = index; i < houses.length; i++) {
      const house = houses[i];
      const scheduledStart = Math.max(currentTime, house.start);
      if (scheduledStart + duration <= house.end) {
        chain.push(house);
        backtrack(i + 1, scheduledStart + duration, chain);
        chain.pop();
      }
    }
  }

  backtrack(0, 0, []);
  return results;
}

// A simple test route.
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend API!');
});

/**
 * API endpoint that returns the top three inspection chains.
 * It reads the CSV, generates all chains, sorts them by length, and returns the top three.
 */
app.get('/api/chains', (req: Request, res: Response) => {
  const csvFilePath = path.join(__dirname, 'houses.csv');
  if (!fs.existsSync(csvFilePath)) {
    res.status(404).json({ error: 'CSV file not found' });
    return;
  }
  const houses = parseCSV(csvFilePath);
  const allChains = findAllChains(houses);
  
  // Filter out empty chains.
  const validChains = allChains.filter(chain => chain.length > 0);
  // Sort chains in descending order of length.
  validChains.sort((a, b) => b.length - a.length);
  
  const topThree = validChains.slice(0, 3);
  res.json({
    bestChainCount: validChains.length > 0 ? validChains[0].length : 0,
    topThree: topThree
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
