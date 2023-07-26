import { Event } from "./event.interface";

export interface Status {
    id: string;
    name: string;
    event: Event[];
    createdAt: Date;
    updatedAt: Date;
  }