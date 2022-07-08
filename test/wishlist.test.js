const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../app");
const bcrypt = require("bcryptjs");
require("dotenv").config();

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
  await queryInterface.bulkInsert("products", [
    {
      user_id: 1,
      name: "product 1",
      price: 100,
      description: "description 1",
      status: "available",
      product_pict: ["pict 1", "pict 2"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 2,
      name: "product 2",
      price: 200,
      description: "description 2",
      status: "available",
      product_pict: ["pict 2", "pict 3"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 1,
      name: "product 3",
      price: 300,
      description: "description 3",
      status: "sold",
      product_pict: ["pict 2", "pict 3"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("wishlists", [
    {
      user_id: 1,
      product_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 1,
      product_id: 2,
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
  await queryInterface.bulkDelete(
    "products",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
  await queryInterface.bulkDelete(
    "wishlists",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("GET /wishlist", () => {
  it("Success", (done) => {
    request(app)
      .get("/wishlist")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Wishlist by user");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
});

describe("POST /wishlist/:id", () => {
  it("Success", (done) => {
    request(app)
      .post("/wishlist/3")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Success add to wishlist");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .post("/wishlist/asd")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product id must be a number");
        done();
      });
  });
  it("Not found", (done) => {
    request(app)
      .post("/wishlist/4")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
        done();
      });
  });
  it("Already in wishlist", (done) => {
    request(app)
      .post("/wishlist/1")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product already in wishlist");
        done();
      });
  });
});
