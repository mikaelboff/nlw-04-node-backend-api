import { Request, Response } from "express";
import { IsNull, Not, getCustomRepository } from "typeorm";
import * as yup from "yup";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
export class NpsController {
  /**
   * Cálculo NPS
   * Detratores=> 0-6
   * Passivos=> 7-8
   * Promotores=> 9-10
   *
   * (número de promotores - número de detratores) / (número de respostas) x 100
   */
  async calculate(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const answersResponse = await surveysUsersRepository.findAndCount({
      survey_id,
      value: Not(IsNull())
    });

    const [surveys, answersCount] = answersResponse;

    if (!answersCount) {
      throw new AppError("Survey User does not exists!");
    }

    const detractors = surveys.filter(
      survey => survey.value >= 0 && survey.value <= 6
    ).length;

    const passives = surveys.filter(survey => [7, 8].includes(survey.value))
      .length;

    const promoters = surveys.filter(survey => [9, 10].includes(survey.value))
      .length;

    const nps = Number(
      (((promoters - detractors) / answersCount) * 100).toFixed(2)
    );

    return res.json({
      detractor: detractors,
      passive: passives,
      promoter: promoters,
      nps
    });
  }
}
