// src/HouseForm.tsx

import React, { useState } from 'react';

interface HouseInput {
  name: string;
  address: string;
  coordinate: string;
  start: string;   // Expected format: HH:mm
  end: string;     // Expected format: HH:mm
  priority: number;
}

const HouseForm: React.FC = () => {
  // State to hold the current input and the list of houses.
  const [house, setHouse] = useState<HouseInput>({
    name: '',
    address: '',
    coordinate: '',
    start: '',
    end: '',
    priority: 0,
  });
  const [houses, setHouses] = useState<HouseInput[]>([]);

  // Update state on input change.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHouse(prev => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value
    }));
  };

  // Add the new house to the list.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation: ensure all required fields are filled.
    if (!house.name || !house.address || !house.coordinate || !house.start || !house.end) {
      alert("Please fill in all required fields");
      return;
    }

    setHouses(prev => [...prev, house]);
    // Optionally clear the form after submission.
    setHouse({
      name: '',
      address: '',
      coordinate: '',
      start: '',
      end: '',
      priority: 0,
    });
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add House for Inspection</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
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
        <div>
          <label htmlFor="address">Address:</label><br />
          <input
            type="text"
            id="address"
            name="address"
            value={house.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="coordinate">Coordinate:</label><br />
          <input
            type="text"
            id="coordinate"
            name="coordinate"
            value={house.coordinate}
            onChange={handleChange}
            placeholder="e.g. 37.7749,-122.4194"
            required
          />
        </div>
        <div>
          <label htmlFor="start">Start Time:</label><br />
          <input
            type="time"
            id="start"
            name="start"
            value={house.start}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="end">End Time:</label><br />
          <input
            type="time"
            id="end"
            name="end"
            value={house.end}
            onChange={handleChange}
            required
          />
        </div>
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
      
      <hr style={{ margin: '2rem 0' }} />
      
      <h3>Houses Added:</h3>
      {houses.length === 0 ? (
        <p>No houses added yet.</p>
      ) : (
        <ul>
          {houses.map((h, index) => (
            <li key={index}>
              <strong>{h.name}</strong> – {h.address} – {h.coordinate} – 
              {` ${h.start} to ${h.end}`} – Priority: {h.priority}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HouseForm;
