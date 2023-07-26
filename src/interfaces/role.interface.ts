import { UserProps } from "./user.interface";

  export interface Role {
    id: string;
    name: string;
    user: UserProps[];
    createdAt: Date;
    updatedAt: Date;
  }