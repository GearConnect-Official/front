// Every commented properties are missing fields from the database
export interface EventInterface {
  id: string;
  name: string;
  creatorId: {
    id: string;
    name: string;
  };
  date: Date;
  // category: string;
  description: string;
  // images: string[];
  tags: Array<string | {id: string; name: string; createdAt?: string}>;
  location: string;
  meteo?:
    | {
        condition: string;
        temperature: number | string;
      }
    | string;
  urlTIcket: string;
  finished: boolean;
  createdAt: string;
  // details: {
  //   location: string;
  //   date: string;
  //   time: string;
  // };
  relatedProducts: {
    id: string;
    tag: string;
    image: string;
    name: string;
    price: string;
  }[];
  reviews: {
    id: string;
    note: number;
    description: string;
    avatar: string;
    username: string;
  }[];
}
