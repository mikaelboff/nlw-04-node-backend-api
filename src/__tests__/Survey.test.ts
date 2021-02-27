import request from "supertest";
import { app } from "../app";
import createConnection from "../database";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new survey", async () => {
    const response = await request(app)
      .post("/surveys")
      .send({
        title: "Campeonato brasileiro",
        description: "Qual a probabilidade do inter ganhar o brasileirao?"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("Should be able to get all surveys", async () => {
    await request(app)
      .post("/surveys")
      .send({
        title: "Campeonato brasileiro",
        description: "Qual a probabilidade do inter perder o brasileirao?"
      });

    const response = await request(app)
      .get("/surveys")
      .send();

    expect(response.body).toHaveLength(2);
  });
});
