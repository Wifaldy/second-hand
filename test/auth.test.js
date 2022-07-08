const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcryptjs");
const app = require("../app");

beforeEach(async () => {
  const hash = await bcrypt.hash("123", 12);
  await queryInterface.bulkInsert("users", [
    {
      name: "test",
      email: "test@test.com",
      password: hash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "users",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("POST /auth/login", () => {
  it("Success", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email is required");
        done();
      });
  });
  it("User not found", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "test2@test.com",
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
        done();
      });
  });
  it("Email / pass invalid", (done) => {
    request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "12345",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email / Password is incorrect");
        done();
      });
  });
});

describe("POST /auth/sign-up", () => {
  it("Success", (done) => {
    request(app)
      .post("/auth/sign-up")
      .send({
        name: "Andri",
        email: "andriwifaldy@gmail.com",
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Success add new user");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .post("/auth/sign-up")
      .send({
        email: "andriwifaldy@gmail.com",
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Name is required");
        done();
      });
  });
  it("Email already exist", (done) => {
    request(app)
      .post("/auth/sign-up")
      .send({
        name: "test",
        email: "test@test.com",
        password: "123",
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Email already exist");
        done();
      });
  });
});
