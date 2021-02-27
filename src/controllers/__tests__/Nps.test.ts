import request from "supertest";
import { app } from "../../app";
import createConnection from "../../database";

describe("Nps", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able to calculate nps if survey user does not exist", async () => {
    const response = await request(app)
      .get("/nps/asdf")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Survey User does not exists!");
  });
});
