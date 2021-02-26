import { EntityRepository, Repository } from "typeorm";
import { SurveysUsers } from "../models/SurveysUsers";

@EntityRepository(SurveysUsers)
export class SurveysUsersRepository extends Repository<SurveysUsers> {}
