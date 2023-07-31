import { Status, Artist } from "@prisma/client";

export interface EventData {
  name: string;
  imageUrl: string;
  description: string;
  startedAt: string;
  finishedAt: string;
  price: number;
  status: Status;
  genre: string[];
  artists: Artist[];
  location: {
    venue: string;
    address: string;
    mapsURL: string;
    province: string;
    city: string;
    street: string;
    streetDetails: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
}
