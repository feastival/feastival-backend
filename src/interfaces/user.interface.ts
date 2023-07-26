import { Role } from './role.interface';
import { Event } from './event.interface';
import { Comment } from './comment.interface';

export interface UserProps {
    id: string;
    email: string;
    username: string;
    imageUrl?: string;
    password: string;
    roleId: string;
    role: Role;
    events: Event[];
    comments: Comment[];
    createdAt: Date;
    updatedAt: Date;
  }
  