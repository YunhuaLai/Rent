export interface HouseInput {
    name: string;
    inputType: 'address' | 'coordinate';
    unitNumber?: string;
    streetNumber: string;
    streetName: string;
    suburb: string;
    state: string;
    postcode: string;
    coordinate?: string;
    start: string;
    end: string;
    priority: number;
  }
  