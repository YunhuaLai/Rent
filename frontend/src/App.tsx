// src/App.tsx

import React from 'react';
import HouseForm from './HouseForm';

const App: React.FC = () => {
  return (
    <div>
      <h1>Inspection Scheduler</h1>
      <HouseForm />
      {/* Later, you can add a section that displays the top three chains by fetching from your backend */}
    </div>
  );
};

export default App;
