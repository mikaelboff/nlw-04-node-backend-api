import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { AppError } from "../errors/AppError";
import { UserRepository } from "../repositories/UserRepository";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required("Name is not valid"),
      email: yup
        .string()
        .email()
        .required("E-mail is not valid")
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (e) {
      throw new AppError(e.errors);
    }

    const usersRepository = getCustomRepository(UserRepository);

    const userAlreadyExists = await usersRepository.findOne({ email });

    if (userAlreadyExists) {
      throw new AppError("User already exists!");
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return res.status(201).json(user);
  }
}
