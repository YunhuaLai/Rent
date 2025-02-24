// backend/src/index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

interface HouseInput {
  name: string;
  inputType: string;
  unitNumber: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  state: string;
  postcode: string;
  coordinate: string;
  start: string;
  end: string;
  priority: number;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/auto-import', async (req: Request, res: Response): Promise<void> => {
  const domainUrl = req.query.url;
  if (!domainUrl || typeof domainUrl !== 'string') {
    res.status(400).json({ error: 'Missing or invalid URL parameter' });
    return;
  }
  
  // Extract the listing ID from the URL using regex.
  const regex = /-(\d+)$/;
  const match = domainUrl.match(regex);
  if (!match) {
    res.status(400).json({ error: 'Could not extract listing ID from the URL.' });
    return;
  }
  const listingId = match[1];

  try {
    const response = await fetch(`https://api.domain.com.au/sandbox/v1/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-Api-Key': process.env.DOMAIN_API_KEY || '',
        'X-Api-Call-Source': 'your-identifier'
      }
    });
    if (!response.ok) {
      res.status(response.status).json({ error: response.statusText });
      return;
    }
    const data: any = await response.json();

    // Map the response to your HouseInput type.
    if (typeof data !== 'object' || data === null) {
      res.status(500).json({ error: 'Invalid data format received from API' });
      return;
    }
    const addr = (data as Record<string, any>).addressParts || {};
    const newHouse: HouseInput = {
      name: data.headline || 'Unnamed Property',
      inputType: 'address',
      unitNumber: addr.unitNumber || '',
      streetNumber: addr.streetNumber || '',
      streetName: addr.street || '',
      suburb: addr.suburb || '',
      state: addr.stateAbbreviation ? addr.stateAbbreviation.toUpperCase() : '',
      postcode: addr.postcode || '',
      coordinate: data.geoLocation 
        ? `${data.geoLocation.latitude},${data.geoLocation.longitude}`
        : '',
      start: '', // these can be filled in manually by the user later
      end: '',
      priority: 0,
    };

    res.json(newHouse);
  } catch (error) {
    console.error('Auto-import error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
