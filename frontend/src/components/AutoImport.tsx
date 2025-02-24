import React, { useState } from 'react';
import { HouseInput } from '../types';

interface AutoImportProps {
  onHouseImported: (house: HouseInput) => void;
}

const AutoImport: React.FC<AutoImportProps> = ({ onHouseImported }) => {
  const [domainUrl, setDomainUrl] = useState('');

  const handleAutoImport = async () => {
    if (!domainUrl) {
      alert('Please enter a Domain listing URL.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/api/auto-import?url=${encodeURIComponent(domainUrl)}`);
      if (!response.ok) {
        alert(`Error fetching data: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      const addr = data.address || {};
      const newHouse: HouseInput = {
        name: data.propertyName || '',
        inputType: 'address',
        unitNumber: addr.unitNumber || '',
        streetNumber: addr.streetNumber || '',
        streetName: addr.streetName || '',
        suburb: addr.suburb || '',
        state: addr.state || '',
        postcode: addr.postcode || '',
        coordinate: '',
        start: '', // can be filled in manually
        end: '',
        priority: 0,
      };
      onHouseImported(newHouse);
      alert('Auto-import successful!');
      setDomainUrl('');
    } catch (error) {
      console.error('Error during auto-import:', error);
      alert('Error during auto-import.');
    }
  };

  return (
    <div style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #aaa' }}>
      <h3>Auto Import from Domain</h3>
      <input
        type="text"
        placeholder="Enter Domain listing URL"
        value={domainUrl}
        onChange={(e) => setDomainUrl(e.target.value)}
        style={{ width: '100%', padding: '0.5rem' }}
      />
      <button onClick={handleAutoImport} style={{ marginTop: '0.5rem' }}>
        Auto Import from Domain
      </button>
    </div>
  );
};

export default AutoImport;
