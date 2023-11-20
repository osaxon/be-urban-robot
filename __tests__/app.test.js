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
