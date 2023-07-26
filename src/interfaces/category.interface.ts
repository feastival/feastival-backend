import { Event } from "./event.interface"; 
 
  export interface Category {
    id: string;
    name: string;
    event: Event[];
    createdAt: Date;
    updatedAt: Date;
  }