import React from 'react';
import { HouseInput } from '../types/index';

interface HouseListProps {
  houses: HouseInput[];
}

const HouseList: React.FC<HouseListProps> = ({ houses }) => (
  <ul>
    {houses.map((h, index) => (
      <li key={index}>
        <strong>{h.name}</strong> – {h.inputType === 'address'
          ? `${h.unitNumber ? h.unitNumber + ', ' : ''}${h.streetNumber} ${h.streetName}, ${h.suburb}, ${h.state} ${h.postcode}`
          : h.coordinate
        } – {h.start} to {h.end} – Priority: {h.priority}
      </li>
    ))}
  </ul>
);

export default HouseList;
