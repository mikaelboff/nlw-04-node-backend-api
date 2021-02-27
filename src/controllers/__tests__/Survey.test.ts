import request from "supertest";
import { app } from "../../app";
import createConnection from "../../database";

describe("Surveys", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able to create a new survey with invalid title", async () => {
    const response = await request(app)
      .post("/surveys")
      .send({
        description: "Qual a probabilidade do inter ganhar o brasileirao?"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Title is not valid");
  });

  it("Should not be able to create a new survey with invalid description", async () => {
    const response = await request(app)
      .post("/surveys")
      .send({
        title: "Campeonato brasileiro"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Description is not valid");
  });

  it("Should not be able to create a new survey with invalid payload", async () => {
    const response = await request(app)
      .post("/surveys")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Title is not valid,Description is not valid"
    );
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
