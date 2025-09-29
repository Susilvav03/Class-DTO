import { type CreateUserDTO } from "../dto/create-user.dto.ts";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeString(s: unknown): string {
  if (typeof s !== "string") throw new Error("Expected string");
  return s.trim();
}

export function validateCreateUserDTO(body: any): CreateUserDTO {
  const name = sanitizeString(body.name);
  const email = sanitizeString(body.email).toLowerCase();
  const password = sanitizeString(body.password);
  const phone = body.phone ? sanitizeString(body.phone) : undefined;

  if (!name) throw new Error("name is required");
  if (!email || !isEmail(email)) throw new Error("email is invalid");
  if (!password || password.length < 8) {
    throw new Error("password must be at least 8 chars");
  }
  return { name, email, password, phone };
}
