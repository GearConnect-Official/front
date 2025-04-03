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
  // tags: string[];
  location: string;
  meteo: string;
  urlTIcket: string;
  finished: boolean;
  createdAt: string;
  // details: {
  //   location: string;
  //   date: string;
  //   time: string;
  // };
  // relatedProducts: {
  //   id: string;
  //   tag: string;
  //   image: string;
  //   title: string;
  //   price: string;
  // }[];
  // reviews: {
  //   id: string;
  //   user: string;
  //   comment: string;
  //   avatar: string;
  // }[];
}
