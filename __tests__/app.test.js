const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET:200 sends an array of topics", () => {});
});
