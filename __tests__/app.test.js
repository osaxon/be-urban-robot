const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const apiEndpoints = require("../endpoints.json");

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
                expect(enpointsObject).toEqual(apiEndpoints);
            });
    });
});

describe("/api/articles/:article_id", () => {
    test("GET:200 responds with the article with the given ID as params with the correct properties", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: article }) => {
                expect(article.article_id).toBe(1);
                expect(article.author).toBe("butter_bridge");
                expect(article.title).toBe(
                    "Living in the shadow of a great man"
                );
                expect(article.body).toBe("I find this existence challenging");
                expect(article.topic).toBe("mitch");
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                expect(article.votes).toBe(100);
                expect(article.article_img_url).toBe(
                    "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                );
            });
    });
    test("GET:404 responds with an appropriate status and error message when given a valid but non-existent article_id", () => {
        return request(app)
            .get("/api/articles/69")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article does not exist");
            });
    });
    test("GET:400 responds with an appropriate status and error message when given an invalid article_id", () => {
        return request(app)
            .get("/api/articles/article-1")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request");
            });
    });
});

describe("/api/articles", () => {
    test("GET:200 responds with an array of all articles sorted sorted by date in descending order.", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                articles.forEach((article) => {
                    expect(article.author).toEqual(expect.any(String));
                    expect(article.title).toEqual(expect.any(String));
                    expect(article.article_id).toEqual(expect.any(Number));
                    expect(article.topic).toEqual(expect.any(String));
                    expect(article.created_at).toEqual(expect.any(String));
                    expect(article.votes).toEqual(expect.any(Number));
                    expect(article.article_img_url).toEqual(expect.any(String));
                    expect(article.comment_count).toEqual(expect.any(Number));
                });
            });
    });
});
