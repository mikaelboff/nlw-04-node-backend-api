import request from "supertest";
import { app } from "../../app";
import createConnection from "../../database";

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

  it("Should be able to create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: "mikael@gmail.com", name: "Mikael Boff" });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new user that already exists", async () => {
    await request(app)
      .post("/users")
      .send({ email: "mikael@gmail.com", name: "Mikael Boff" });

    const response = await request(app)
      .post("/users")
      .send({ email: "mikael@gmail.com", name: "Mikael Boff" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists!");
  });

  it("Should not be able to create a new user with invalid name", async () => {
    const response = await request(app)
      .post("/users")
      .send({ email: "mikael@gmail.com" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name is not valid");
  });

  it("Should not be able to create a new user with invalid email", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "Mikael Boff" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail is not valid");
  });

  it("Should not be able to create a new user with invalid payload", async () => {
    const response = await request(app)
      .post("/users")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Name is not valid,E-mail is not valid");
  });
});
