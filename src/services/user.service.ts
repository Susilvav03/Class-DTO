import { type CreateUserDTO } from "../dto/create-user.dto.ts";
import { type UserEntity } from "../models/user.entity.ts";
import { randomUUID } from "crypto";
import { hashPassword } from "../utils/crypto.ts";

export const userService = {
  async create(dto: CreateUserDTO): Promise<UserEntity> {
    const entity: UserEntity = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      passwordHash: await hashPassword(dto.password),
      phone: dto.phone,
      role: "user",
      createdAt: new Date(),
    };
    // Aquí iría la lógica para persistir en la base de datos
    return entity;
  },
};
