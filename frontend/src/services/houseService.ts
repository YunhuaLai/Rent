import { HouseInput } from '../types';

const API_BASE = 'http://localhost:4000/api'; // Adjust as needed

export const autoImportHouse = async (domainUrl: string): Promise<HouseInput | null> => {
  // Send the Domain URL to the backend, which handles the extraction and API call.
  try {
    const response = await fetch(`${API_BASE}/auto-import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: domainUrl }),
    });
    if (!response.ok) {
      console.error('Backend error', response.statusText);
      return null;
    }
    const data = await response.json();
    return data; // Assuming data matches the HouseInput type.
  } catch (error) {
    console.error('Error in auto-import service', error);
    return null;
  }
};

export const saveHouse = async (house: HouseInput): Promise<void> => {
  try {
    await fetch(`${API_BASE}/houses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(house),
    });
  } catch (error) {
    console.error('Error saving house', error);
  }
};
