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

// Ceci est ajouté pour satisfaire les exigences d'Expo Router
// qui s'attend à un export default d'un composant React pour chaque fichier
import React from 'react';

/**
 * Ce fichier ne contient que des interfaces TypeScript et n'est pas censé être une route.
 * Cependant, Expo Router l'interprète comme une route, donc nous devons ajouter un composant vide.
 * Ne pas utiliser ce composant, il est uniquement présent pour éviter les avertissements.
 */
const EmptyComponent: React.FC = () => null;

export default EmptyComponent;