import { Category } from "./category.interface";
import { Status } from "./status.interface";
import { UserProps } from "./user.interface";
import { Artist } from "./artist.interface";

export interface Event {
  id: string;
  name: string;
  imageUrl?: string;
  description: string;
  location: string;
  venue?: string;
  organizer?: string;
  startedAt: Date;
  finishedAt: Date;
  statusId: string;
  status: Status;
  categoryId: string;
  category: Category;
  artistId: string;
  artist: Artist;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: UserProps;
}