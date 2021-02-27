import request from "supertest";
import { app } from "../../app";
import createConnection from "../../database";

describe("SendMail", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should not be able to send mail with invalid email", async () => {
    const response = await request(app)
      .post("/sendMail")
      .send({
        survey_id: "dasdad-dasdd-dsa"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail is not valid");
  });

  it("Should not be able to send mail with invalid survey identifier", async () => {
    const response = await request(app)
      .post("/sendMail")
      .send({
        email: "mikael@gmail.com"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Survey identifier is not valid");
  });

  it("Should not be able to send mail with invalid payload", async () => {
    const response = await request(app)
      .post("/sendMail")
      .send();

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Survey identifier is not valid,E-mail is not valid"
    );
  });

  it("Should not be able to send mail if user does not exists", async () => {
    const response = await request(app)
      .post("/sendMail")
      .send({ email: "mikael@gmail.com", survey_id: "dasdad-dasdd-dsa" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User does not exists!");
  });

  it("Should not be able to send mail if survey does not exists", async () => {
    await request(app)
      .post("/users")
      .send({ email: "mikaelteste@gmail.com", name: "Mikael Boff" });

    const response = await request(app)
      .post("/sendMail")
      .send({ email: "mikaelteste@gmail.com", survey_id: "dasdad-dasdd-dsa" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Survey does not exists!");
  });
});
