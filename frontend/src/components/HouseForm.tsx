// src/components/HouseForm.tsx

import React, { useState, useRef, ChangeEvent } from 'react';
import { HouseInput } from '../types';

interface HouseFormProps {
  onHouseAdded: (house: HouseInput) => void;
}

const HouseForm: React.FC<HouseFormProps> = ({ onHouseAdded }) => {
  // State for the manual house form values.
  const [house, setHouse] = useState<HouseInput>({
    name: '',
    inputType: 'address',
    unitNumber: '',
    streetNumber: '',
    streetName: '',
    suburb: '',
    state: '',
    postcode: '',
    coordinate: '',
    start: '',
    end: '',
    priority: 0,
  });
  
  // For showing address validation status.
  const [addressCheckStatus, setAddressCheckStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Given a start datetime-local string, return a new string 15 minutes later.
  const computeDefaultEnd = (start: string): string => {
    if (!start) return '';
    const date = new Date(start);
    date.setMinutes(date.getMinutes() + 15);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Update the manual form state on change.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'start') {
      const newStart = value;
      const newEnd = computeDefaultEnd(newStart);
      setHouse(prev => ({
        ...prev,
        start: newStart,
        end: newEnd
      }));
    } else {
      setHouse(prev => ({
        ...prev,
        [name]: name === 'priority' ? Number(value) : value
      }));
    }
  };

  // Change the input type (address vs. coordinate)
  const handleInputTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as 'address' | 'coordinate';
    setHouse(prev => ({
      ...prev,
      inputType: newType,
      ...(newType === 'address'
        ? { coordinate: '' }
        : { unitNumber: '', streetNumber: '', streetName: '', suburb: '', state: '', postcode: '' })
    }));
  };

  // Function to auto-check address based on suburb and postcode.
  const autoCheckAddress = () => {
    const { suburb, postcode } = house;
    if (!suburb || !postcode) {
      setAddressCheckStatus('Suburb and postcode are required.');
      return;
    }
    const postcodeRegex = /^\d{4}$/;
    setAddressCheckStatus(postcodeRegex.test(postcode) ? 'Address verified.' : 'Invalid postcode format.');
  };

  // Manual add: Append the current manual house to the list.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!house.name || !house.start || !house.end) {
      alert('Please fill in all required fields.');
      return;
    }
    if (house.inputType === 'address') {
      if (!house.streetNumber || !house.streetName || !house.suburb || !house.state || !house.postcode) {
        alert('Please provide street number, street name, suburb, state, and postcode.');
        return;
      }
    }
    if (house.inputType === 'coordinate' && !house.coordinate) {
      alert('Please provide the coordinate.');
      return;
    }
    // Call the prop function to add the house.
    onHouseAdded(house);
    // Reset the form.
    setHouse({
      name: '',
      inputType: 'address',
      unitNumber: '',
      streetNumber: '',
      streetName: '',
      suburb: '',
      state: '',
      postcode: '',
      coordinate: '',
      start: '',
      end: '',
      priority: 0,
    });
    setAddressCheckStatus('');
  };

  // (Optional) Functions for CSV import/export can be added here.

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Add House for Inspection</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        {/* House Name */}
        <div>
          <label htmlFor="name">House Name:</label><br />
          <input
            type="text"
            id="name"
            name="name"
            value={house.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Input Type Selector */}
        <div>
          <span>Input Type:</span><br />
          <label>
            <input
              type="radio"
              name="inputType"
              value="address"
              checked={house.inputType === 'address'}
              onChange={handleInputTypeChange}
            />
            Address
          </label>
          {' '}
          <label>
            <input
              type="radio"
              name="inputType"
              value="coordinate"
              checked={house.inputType === 'coordinate'}
              onChange={handleInputTypeChange}
            />
            Coordinate
          </label>
        </div>

        {/* Address Fields */}
        {house.inputType === 'address' && (
          <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
            <h4>Address Details</h4>
            <div>
              <label htmlFor="unitNumber">Unit Number (optional):</label><br />
              <input
                type="text"
                id="unitNumber"
                name="unitNumber"
                value={house.unitNumber}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="streetNumber">Street Number:</label><br />
              <input
                type="text"
                id="streetNumber"
                name="streetNumber"
                value={house.streetNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="streetName">Street Name:</label><br />
              <input
                type="text"
                id="streetName"
                name="streetName"
                value={house.streetName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="suburb">Suburb:</label><br />
              <input
                type="text"
                id="suburb"
                name="suburb"
                value={house.suburb}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="state">State:</label><br />
              <select
                id="state"
                name="state"
                value={house.state}
                onChange={handleChange}
                required
              >
                <option value="">Select State</option>
                <option value="New South Wales">New South Wales</option>
                <option value="Victoria">Victoria</option>
                <option value="Queensland">Queensland</option>
                <option value="Western Australia">Western Australia</option>
                <option value="South Australia">South Australia</option>
                <option value="Tasmania">Tasmania</option>
                <option value="Australian Capital Territory">Australian Capital Territory</option>
                <option value="Northern Territory">Northern Territory</option>
              </select>
            </div>
            <div>
              <label htmlFor="postcode">Postcode:</label><br />
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={house.postcode}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <button type="button" onClick={autoCheckAddress}>Validate Address</button>
              {addressCheckStatus && <span style={{ marginLeft: '0.5rem' }}>{addressCheckStatus}</span>}
            </div>
          </div>
        )}

        {/* Coordinate Field */}
        {house.inputType === 'coordinate' && (
          <div>
            <label htmlFor="coordinate">Coordinate:</label><br />
            <input
              type="text"
              id="coordinate"
              name="coordinate"
              value={house.coordinate}
              onChange={handleChange}
              placeholder="e.g. -33.8688,151.2093"
              required
            />
          </div>
        )}

        {/* Date & Time Fields */}
        <div>
          <label htmlFor="start">Start Date &amp; Time:</label><br />
          <input
            type="datetime-local"
            id="start"
            name="start"
            value={house.start}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end">End Date &amp; Time (default is 15 mins after start):</label><br />
          <input
            type="datetime-local"
            id="end"
            name="end"
            value={house.end}
            onChange={handleChange}
            required
          />
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority">Priority (0 is highest):</label><br />
          <input
            type="number"
            id="priority"
            name="priority"
            value={house.priority}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <button type="submit">Add House</button>
      </form>
    </div>
  );
};

export default HouseForm;
