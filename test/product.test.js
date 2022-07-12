const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const jwt = require("jsonwebtoken");
const app = require("../app");
require("dotenv").config();
const path = require("path");

const inputPict = path.join(__dirname, "pic", "test.jpg");

let token;
let token1;
let token2;

beforeEach(async () => {
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
  await queryInterface.bulkInsert("product_tags", [
    {
      category_id: 1,
      product_id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category_id: 2,
      product_id: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category_id: 3,
      product_id: 3,
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
    {
      name: "Baju",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Elektronik",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Kesehatan",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  await queryInterface.bulkInsert("offers", [
    {
      buyer_id: 2,
      product_id: 1,
      price_offer: 200,
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
    process.env.JWT_SECRET
  );
  token1 = jwt.sign({ id: 2 }, process.env.JWT_SECRET);
  token2 = jwt.sign({ id: 3 }, process.env.JWT_SECRET);
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
    "product_tags",
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

describe("GET /product", () => {
  it("Success", (done) => {
    request(app)
      .get("/product?page=1")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("List Products");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Success query parameter", (done) => {
    request(app)
      .get("/product?category=Hobi&page=1")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("List Products");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Success search parameter", (done) => {
    request(app)
      .get("/product?search=prod")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("List Products");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Not found", (done) => {
    queryInterface
      .bulkDelete("products", {}, { truncate: true, restartIdentity: true })
      .then(() => {
        request(app)
          .get("/product?search=prod")
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
            done();
          });
      })
      .catch((err) => err);
  });
});

describe("GET /product/:id", () => {
  it("Success", (done) => {
    request(app)
      .get("/product/1")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Detail Product");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .get("/product/asd")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product id must be a number");
        done();
      });
  });
  it("Not found", (done) => {
    request(app)
      .get("/product/100")
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
        done();
      });
  });
});

describe("POST /product", () => {
  it("Success", (done) => {
    request(app)
      .post("/product")
      .set("Authorization", `Bearer ${token}`)
      .field("name", "product 1")
      .field("price", 100)
      .field("description", "description 1")
      .field("categories", [1, 2, 3])
      .attach("product_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("Success add new product");
        done();
      });
  }, 10000);
  it("Field violation", (done) => {
    request(app)
      .post("/product")
      .set("authorization", `Bearer ${token}`)
      .field("price", 100)
      .field("description", "description 1")
      .field("categories", [1, 2, 3])
      .attach("product_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product name is required");
        done();
      });
  });
});

describe("PUT /product/:id", () => {
  it("Success", (done) => {
    request(app)
      .put("/product/1")
      .set("authorization", `Bearer ${token}`)
      .field("name", "product 1")
      .field("price", 100)
      .field("description", "description 1")
      .field("categories", [1, 2, 3])
      .attach("product_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success update product");
        done();
      });
  }, 10000);
  it("Field violation", (done) => {
    request(app)
      .put("/product/1")
      .set("authorization", `Bearer ${token}`)
      .field("price", 100)
      .field("description", "description 1")
      .field("categories", [1, 2, 3])
      .attach("product_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Product name is required");
        done();
      });
  });
  it("Unauthorized", (done) => {
    request(app)
      .put("/product/2")
      .set("authorization", `Bearer ${token}`)
      .field("name", "product 1")
      .field("price", 100)
      .field("description", "description 1")
      .field("categories", [1, 2, 3])
      .attach("product_pict", inputPict)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("The product is not yours");
        done();
      });
  }, 10000);
});

describe("DELETE /product/:id", () => {
  it("Success", (done) => {
    request(app)
      .delete("/product/1")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Success delete product");
        done();
      });
  });
  it("Field violation", (done) => {
    request(app)
      .delete("/product/asd")
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
      .delete("/product/100")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
        done();
      });
  });
  it("Unauthorized", (done) => {
    request(app)
      .delete("/product/1")
      .set("Authorization", `Bearer ${token1}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
        done();
      });
  });
});

describe("GET /product/user", () => {
  it("Success", (done) => {
    request(app)
      .get("/product/user")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Product by user");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Not found", (done) => {
    request(app)
      .get("/product/user")
      .set("Authorization", `Bearer ${token2}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Product not found");
        done();
      });
  });
});

describe("GET /product/histories", () => {
  it("Success", (done) => {
    request(app)
      .get("/product/histories")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Not found", (done) => {
    queryInterface
      .bulkDelete(
        "products",
        {},
        {
          truncate: true,
          restartIdentity: true,
        }
      )
      .then(() => {
        request(app)
          .get("/product/histories")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
            done();
          });
      })
      .catch((err) => err);
  });
});

describe("GET /product/offer", () => {
  it("Success", (done) => {
    request(app)
      .get("/product/offered")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        if (err) done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Offered products");
        expect(res.body).toHaveProperty("data");
        done();
      });
  });
  it("Not found", (done) => {
    queryInterface
      .bulkDelete(
        "offers",
        {},
        {
          truncate: true,
          restartIdentity: true,
        }
      )
      .then(() => {
        request(app)
          .get("/product/offered")
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) done(err);
            expect(res.status).toBe(404);
            expect(res.body.message).toBe("Product not found");
            done();
          });
      })
      .catch((err) => err);
  });
});
