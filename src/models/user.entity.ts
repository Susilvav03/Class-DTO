export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: Date;
}
