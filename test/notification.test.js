const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../app");

let token;

beforeEach(async () => {
  await queryInterface.bulkInsert("notifications", [
    {
      user_id: 1,
      product_id: 1,
      offer_id: 1,
      title: "Penawaran produk",
      status: "unread",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
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
  ]);
  token = jwt.sign(
    {
      id: 1,
      email: "test@test.com",
    },
    "secondhandsecretsecretkey"
  );
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "notifications",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("GET /notification", () => {
  it("Success", (done) => {
    request(app)
      .get("/notification")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success get all notification");
        expect(res.body).toHaveProperty("findNotification");
        done();
      });
  });
  it("Is empty", (done) => {
    queryInterface
      .bulkDelete(
        "notifications",
        {},
        {
          truncate: true,
          restartIdentity: true,
        }
      )
      .then(() => {
        request(app)
          .get("/notification")
          .set("authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Notification data is empty");
            done();
          });
      })
      .catch((err) => err);
  });
});

describe("PUT /notification/:id", () => {
  it("Success", (done) => {
    request(app)
      .put("/notification/1")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success update notification");
        done();
      });
  });
  it("Notification not found", (done) => {
    request(app)
      .put("/notification/5")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Notification not found");
        done();
      });
  });
  it("Param violation", (done) => {
    request(app)
      .put("/notification/asd")
      .set("authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("id must be a number");
        done();
      });
  });
});
