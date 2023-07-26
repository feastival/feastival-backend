import { Event } from "./event.interface";

export interface Artist {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
  }