
# 📘 DTO 

## 🔹 ¿Qué es un DTO?
Un **DTO (Data Transfer Object)** es un objeto que se usa para **transportar datos** entre capas de una aplicación  
- No contiene lógica de negocio  
- Sirve como **contrato de datos** claro y seguro (Que se pide o que se devuelve sanitizando y validando los datos)

---

## 🔹 ¿Por qué usar DTOs?
- ✅ **Seguridad** → Se evita que sean expuestas propiedades indebidas (ej. `passwordHash`)
- ✅ **Claridad** → Se define exactamente qué campos se esperan y devuelven
- ✅ **Mantenibilidad** → Se hacen cambios internos no rompen el contrato externo (Interfaces DTO)
- ✅ **Validación** → Los datos se revisan antes de usarse
- ✅ **Escalabilidad** → Permite versionar y adaptar la API

---

## 🔹 Diferencia con otros conceptos
| Concepto     | Propósito |
|--------------|-----------|
| **Entidad/Modelo** | Cómo guardas datos en la BD (incluye `id`, `createdAt`, etc) |
| **DTO** | Qué datos la API acepta o devuelve |
| **View Model** | Cómo los datos se muestran en la UI (user interface) |

---

## 🔹 Tipos de DTOs
- **Input DTO** → Lo que recibes en una petición (`req.body`)
- **Output DTO** → Lo que respondes al cliente (`res.json`) 

Ejemplo:  
- Input: `{ name, email, password }`  
- Output: `{ id, name, email, createdAt }`

---

## 🔹 Ejemplo de Input DTO
```ts
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
```

---

## 🔹 Validación (manual)
```ts
export function validateCreateUserDTO(body: any): CreateUserDTO {
  if (!body.name) throw new Error("Name is required"); // Nombre requerido
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) { // Validar el formato del correo
    throw new Error("Invalid email");
  }
  if (!body.password || body.password.length < 8) { // Validar largo de contraseña
    throw new Error("Password too short");
  }
  return { // Se devuelve un objeto ya validado
    name: body.name.trim(),
    email: body.email.toLowerCase(),
    password: body.password,
    phone: body.phone,
  };
}
```

---

## 🔹 Ejemplo de Entidad (interna)
```ts
export interface UserEntity {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
}
```

---

## 🔹 Ejemplo de Output DTO
```ts
export interface UserOutputDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
}

// Mapear para pasar de entidad a *Output DTO*
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
```
⚠️ Nota: **Nunca devolver `password` ni `passwordHash`.**

## 🔹 Ejemplo de Servicio
```ts
export const userService = {
  async create(dto: CreateUserDTO): Promise<UserEntity> { // A partir del DTO CreateUser se mapea y se devuleve la entidad
    const entity: UserEntity = {
      id: randomUUID(), // Se genera número random
      name: dto.name, // Se trae la información del DTO
      email: dto.email, // Se trae la información del DTO
      passwordHash: await hashPassword(dto.password), // Se guardará la contraseña en el objeto entidad ya hasheada
      phone: dto.phone, // Se trae la información del DTO
      role: "user", // Por default se crea con role "user"
      createdAt: new Date(), // Se pone automaticamente una vez se manda la petición
    };
    // Aquí iría la lógica para persistir en la base de datos
    return entity;
  },
};

```

## 🔹 Ejemplo de Ruta
```ts
router.post("/", async (req: Request, res: Response) => {
  try {
    const dto = validateCreateUserDTO(req.body); // Se valida que los datos tengan el tipo y forma correcta, y se guarda validada en dto
    const created = await userService.create(dto); // Usar el dto para mapearlo a entidad y guardarlo en la base de datos
    res.status(201).json(mapUserToOutputDTO(created)); // Se mapea la entidad creada a Output DTO y se devuelve como respuesta
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
```

---

## 🔹 Alternativa con librerías (Validaciones)
Ejemplo usando **Zod**:

```ts
import { z } from "zod";

export const CreateUserZod = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

export type CreateUserZDTO = z.infer<typeof CreateUserZod>;
```

---

## 🔹 Buenas prácticas ✅
- Usar **DTOs separados** por caso (`CreateUserDTO`, `UpdateUserDTO`, `UserOutputDTO`)   
- **Sanitizar:** limpiar/normalizar datos (ej. `.trim()`, `.toLowerCase()`)
- **Validar:** Asegurar que los datos tienen el tipo/forma correcta (ej. `email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/`, `typeof x == string`)
- **Mapeadores:** Transformar de entidad a DTO o de DTO a entidad de manera dedicada (`mapEntityToDTO`)  
- **Ocultar sensibles:** no mostrar datos sensibles o guardarlos en la base de datos hasheados (`password`, `tokens`)  
- **Versionar:** DTOs por version cuando cambie el contrato (ej. `UserV1`, `UserV2`)  

---

## 🔹 Errores comunes ❌
- Usar la **Entidad directamente** como request/response.  
- Confiar solo en TypeScript (no valida en runtime).  
- No separar DTOs de **entrada** y **salida**.  
- Exponer datos sensibles.  
- No actualizar DTOs al cambiar la API.  
