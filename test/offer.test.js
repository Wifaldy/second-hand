const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../app");

let token;
let token1;

beforeEach(async () => {
  await queryInterface.bulkInsert("products", [
    {
      user_id: 2,
      name: "Product 1",
      price: 5000,
      description: "Ini adalah product 1",
      status: "available",
      product_pict: ["pict1", "pict2"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 1,
      name: "Product 1",
      price: 5000,
      description: "Ini adalah product 1",
      status: "available",
      product_pict: ["pict1", "pict2"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      user_id: 3,
      name: "Product 1",
      price: 5000,
      description: "Ini adalah product 1",
      status: "available",
      product_pict: ["pict1", "pict2"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("offers", [
    {
      buyer_id: 1,
      product_id: 1,
      price_offer: 3000,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      buyer_id: 3,
      product_id: 3,
      price_offer: 3000,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  token = jwt.sign(
    {
      id: 1,
      email: "test@test.com",
    },
    "secondhandsecretsecretkey"
  );
  token1 = jwt.sign(
    {
      id: 2,
      email: "test2@test.com",
    },
    "secondhandsecretsecretkey"
  );
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "products",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
  await queryInterface.bulkDelete(
    "offers",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("POST /offer/:id", () => {
  it("Success", (done) => {
    request(app)
      .post("/offer/1")
      .set("authorization", `Bearer ${token}`)
      .send({
        price_offer: 3000,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Offering Success");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .post("/offer/1")
      .set("authorization", `Bearer ${token}`)
      .send({})
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Price is required");
        done();
      });
  });
  it("Product not found", (done) => {
    request(app)
      .post("/offer/100")
      .set("authorization", `Bearer ${token}`)
      .send({
        price_offer: 3000,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
        done();
      });
  });
  it("Cannot offer your own product", (done) => {
    request(app)
      .post("/offer/2")
      .set("authorization", `Bearer ${token}`)
      .send({
        price_offer: 3000,
      })
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("You can't offer your own product");
        done();
      });
  });
});

describe("GET /offer/is-offering/:id", () => {
  it("Success", (done) => {
    request(app)
      .get("/offer/is-offering/1")
      .set("authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.message).toBe("Offering is valid");
        expect(res.status).toBe(200);
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .get("/offer/is-offering/asd")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product id must be a number");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .get("/offer/is-offering/1")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("You already offered this product");
        done();
      });
  });
});

describe("GET /offer/:id", () => {
  it("Success", (done) => {
    request(app)
      .get("/offer/1")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Detail Offer");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .get("/offer/asd")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product id must be a number");
        done();
      });
  });
  it("Unauthorized", (done) => {
    request(app)
      .get("/offer/1")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
        done();
      });
  });
  it("Not found", (done) => {
    request(app)
      .get("/offer/5")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Offer not found");
        done();
      });
  });
});

describe("POST offer/:id/:status", () => {
  it("Success accepted", (done) => {
    request(app)
      .post("/offer/1/accepted")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Offer status updated");
        done();
      });
  });
  it("Success rejected", (done) => {
    request(app)
      .post("/offer/1/rejected")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Offer status updated");
        done();
      });
  });
  it("Success cancelled", (done) => {
    request(app)
      .post("/offer/1/cancelled")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Offer status updated");
        done();
      });
  });
  it("Success success", (done) => {
    request(app)
      .post("/offer/1/success")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Offer status updated");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .post("/offer/1/test")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe(
          "Status must be accepted, rejected, success or cancelled"
        );
        done();
      });
  });
  it("Offer not found", (done) => {
    request(app)
      .post("/offer/5/success")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Offer not found");
        done();
      });
  });
  it("Unauthorized", (done) => {
    request(app)
      .post("/offer/2/success")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
        done();
      });
  });
});
