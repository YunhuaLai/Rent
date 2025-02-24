import React, { useState } from 'react';
import HouseForm from './components/HouseForm';
import AutoImport from './components/AutoImport';
import HouseList from './components/HouseList';
import { HouseInput } from './types';

const App: React.FC = () => {
  const [houses, setHouses] = useState<HouseInput[]>([]);

  const addHouse = (house: HouseInput) => {
    setHouses(prev => [...prev, house]);
  };

  return (
    <div>
      <h1>Inspection Scheduler</h1>
      <AutoImport onHouseImported={addHouse} />
      <HouseForm onHouseAdded={addHouse} />
      <HouseList houses={houses} />
    </div>
  );
};

export default App;
