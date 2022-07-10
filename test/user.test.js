const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../app");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const path = require("path");
const inputPict = path.join(__dirname, "pic", "test.jpg");

let token;
let token1;

beforeEach(async () => {
  const pass = await bcrypt.hash("123", 10);
  await queryInterface.bulkInsert("users", [
    {
      name: "Demo User",
      email: "demouser@gmail.com",
      password: pass,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Demo User 2",
      email: "demouser2@gmail.com",
      password: pass,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  token = jwt.sign(
    {
      id: 1,
    },
    process.env.JWT_SECRET
  );
  token1 = jwt.sign(
    {
      id: 5,
    },
    process.env.JWT_SECRET
  );
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

describe("GET /user/", () => {
  it("Success", (done) => {
    request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Not found", (done) => {
    request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Data user not found");
        done();
      });
  });
});

describe("PUT /user/update", () => {
  it("Success", (done) => {
    request(app)
      .put("/user/update")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "Demo User")
      .field("city_id", 1)
      .field("address", "Jl. Demo")
      .field("no_hp", "081234567890")
      .attach("profile_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Successfully update Users");
        done();
      });
  }, 10000);
  it("Not found", (done) => {
    request(app)
      .put("/user/update")
      .set(
        "Authorization",
        `Bearer ${jwt.sign({ id: 5 }, process.env.JWT_SECRET)}`
      )
      .field("name", "Demo User")
      .field("city_id", 1)
      .field("address", "Jl. Demo")
      .field("no_hp", "081234567890")
      .attach("profile_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("User not found");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .put("/user/update")
      .set("Authorization", `Bearer ${token}`)
      .field("city_id", 1)
      .field("address", "Jl. Demo")
      .field("no_hp", "081234567890")
      .attach("profile_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Name is required");
        done();
      });
  });
});
