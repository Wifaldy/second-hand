const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const app = require("../app");

beforeEach(async () => {
  await queryInterface.bulkInsert("cities", [
    {
      name: "Jakarta",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Bandung",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("categories", [
    {
      name: "Hobi",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Kendaraan",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
});

afterEach(async () => {
  await queryInterface.bulkDelete(
    "cities",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
  await queryInterface.bulkDelete(
    "categories",
    {},
    {
      truncate: true,
      restartIdentity: true,
    }
  );
});

describe("GET /cities", () => {
  it("sucess", (done) => {
    request(app)
      .get("/cities")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success get all cities");
        done();
      });
  });
  it("Is empty", (done) => {
    queryInterface
      .bulkDelete(
        "cities",
        {},
        {
          truncate: true,
          restartIdentity: true,
        }
      )
      .then(() => {
        request(app)
          .get("/cities")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("City data is empty");
            done();
          });
      })
      .catch((err) => err);
  });
});

describe("GET /categories", () => {
  it("sucess", (done) => {
    request(app)
      .get("/categories")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success get all categories");
        done();
      });
  });
  it("Is empty", (done) => {
    queryInterface
      .bulkDelete(
        "categories",
        {},
        {
          truncate: true,
          restartIdentity: true,
        }
      )
      .then(() => {
        request(app)
          .get("/categories")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Category data is empty");
            done();
          });
      })
      .catch((err) => err);
  });
});
