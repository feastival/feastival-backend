import { Thread } from "./thread.interface";
import { UserProps } from "./user.interface";

 export interface Comment {
    id: string;
    userId: string;
    user: UserProps;
    threadId: string;
    thread: Thread;
    createdAt: Date;
    updatedAt: Date;
  }