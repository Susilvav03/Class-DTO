import { type UserEntity } from "../models/user.entity.ts";

export interface UserOutputDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
}

export function mapUserToOutputDTO(user: UserEntity): UserOutputDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
