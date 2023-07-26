import { Comment } from "./comment.interface";

export interface Thread {
    id: string;
    title: string;
    content: string;
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
  }