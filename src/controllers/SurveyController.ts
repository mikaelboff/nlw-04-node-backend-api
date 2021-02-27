import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import * as yup from "yup";
import { AppError } from "../errors/AppError";
import { SurveyRepository } from "../repositories/SurveyRepository";

export class SurveyController {
  async create(req: Request, res: Response) {
    const { title, description } = req.body;

    const schema = yup.object().shape({
      title: yup.string().required("Title is not valid"),
      description: yup.string().required("Description is not valid")
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (e) {
      throw new AppError(e.errors);
    }

    const surveyRepository = getCustomRepository(SurveyRepository);

    const survey = surveyRepository.create({ title, description });

    await surveyRepository.save(survey);

    return res.status(201).json(survey);
  }

  async show(req: Request, res: Response) {
    const surveyRepository = getCustomRepository(SurveyRepository);

    const all = await surveyRepository.find();

    return res.json(all);
  }
}
