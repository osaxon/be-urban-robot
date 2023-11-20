const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    test("GET:200 sends an array of topic objects with a slug and description property", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                topics.forEach((topic) => {
                    expect(topic.slug).toEqual(expect.any(String));
                    expect(topic.description).toEqual(expect.any(String));
                });
            });
    });
});

describe("/api", () => {
    test("GET:200 responds with an object describing all available endpoints for this API. The object includes a description, a queries array and an example response", () => {
        return request(app)
            .get("/api/")
            .expect(200)
            .then(({ body: enpointsObject }) => {
                const validPaths = [
                    "GET /api",
                    "GET /api/topics",
                    "GET /api/articles",
                    // TODO update as routes are defined
                ];
                const paths = Object.keys(enpointsObject);
                expect(paths).toEqual(validPaths);
                validPaths.forEach((path) => {
                    expect(enpointsObject[path].description).toEqual(
                        expect.any(String)
                    );
                    // API endpoint does not have queries or example response
                    if (path !== "GET /api") {
                        expect(enpointsObject[path].queries).toEqual(
                            expect.any(Array)
                        );
                        expect(enpointsObject[path].exampleResponse).toEqual(
                            expect.any(Object)
                        );
                    }
                });
            });
    });
});
