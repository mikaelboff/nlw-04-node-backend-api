import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const usersRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({ error: "User already exists!" });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return res.status(201).json(user);
  }
}
