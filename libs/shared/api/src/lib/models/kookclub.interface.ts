
export interface IKookclub {
    _id: string;
    naam: string;
    beschrijving: string;
    categorieen: string[];
    eigenaar: { _id: string; name: string } | string; 
    leden: string[];
    recepten: { title: string; description: string; _id: string }[]; // Verfijnd type

    createdAt: Date;
  }
  