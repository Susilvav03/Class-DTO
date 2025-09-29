import { Router, type Request, type Response } from "express";
import { validateCreateUserDTO } from "../utils/validators.ts";
import { userService } from "../services/user.service.ts";
import { mapUserToOutputDTO } from "../dto/user-output.dto.ts";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const dto = validateCreateUserDTO(req.body);
    const created = await userService.create(dto);
    res.status(201).json(mapUserToOutputDTO(created));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
