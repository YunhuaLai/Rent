import React, { useState } from 'react';
import { autoImportHouse } from '../services/houseService';

const AutoImport: React.FC<{ onHouseImported: (house: any) => void }> = ({ onHouseImported }) => {
  const [domainUrl, setDomainUrl] = useState('');

  const handleAutoImport = async () => {
    if (!domainUrl) {
      alert('Please enter a Domain listing URL.');
      return;
    }
    const importedHouse = await autoImportHouse(domainUrl);
    if (importedHouse) {
      onHouseImported(importedHouse);
      alert('Auto-import successful!');
    } else {
      alert('Error during auto-import.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Paste Domain listing URL here"
        value={domainUrl}
        onChange={e => setDomainUrl(e.target.value)}
      />
      <button onClick={handleAutoImport}>Auto Import from Domain</button>
    </div>
  );
};

export default AutoImport;
