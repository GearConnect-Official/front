export interface EventInterface {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  tags: string[];
  details: {
    location: string;
    date: string;
    time: string;
  };
  relatedProducts: {
    id: string;
    tag: string;
    image: string;
    title: string;
    price: string;
  }[];
  reviews: {
    id: string;
    user: string;
    comment: string;
    avatar: string;
  }[];
}