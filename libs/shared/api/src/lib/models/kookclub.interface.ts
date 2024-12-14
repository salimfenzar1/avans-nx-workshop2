
export interface IKookclub {
    _id: string;
    naam: string;
    beschrijving: string;
    categorieen: KookclubCategorie[];
    eigenaar: { _id: string; name: string } | string; 
    leden: string[];
    recepten: { title: string; description: string; _id: string; imageUrl:string }[]; // Verfijnd type

    createdAt: Date;
  }
  export enum KookclubCategorie {
    VEGETARISCH = 'Vegetarisch',
    VEGANISTISCH = 'Veganistisch',
    GLUTENVRIJ = 'Glutenvrij',
    LACTOSEVRIJ = 'Lactosevrij',
    ITALIAANS = 'Italiaans',
    FRANS = 'Frans',
    MEXICAANS = 'Mexicaans',
    JAPANS = 'Japans',
    INDIAS = 'Indiaas',
    MIDDEN_OOSTERS = 'Midden-Oosters',
    MEDITERRAAN = 'Mediterraan',
    DESSERTS = 'Desserts',
    BBQ = 'BBQ',
    COMFORT_FOOD = 'Comfort Food',
    GEZOND = 'Gezond',
  }
  