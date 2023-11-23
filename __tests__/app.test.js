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
    test("the article object has a comment_count property which is the total comments related to the article", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: article }) => {
                expect(article.comment_count).toBe(11);
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
    test("PATCH:200 updates the given article votes in the database and responds with the updated article. the request body accepts an object with an inc_votes property which increments or decrements the vote count", () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: 10 })
            .expect(200)
            .then((addTenResponse) => {
                return request(app)
                    .patch("/api/articles/5")
                    .send({ inc_votes: -5 })
                    .expect(200)
                    .then((subFiveResponse) => {
                        expect(addTenResponse.body.article.votes).toBe(10);
                        expect(subFiveResponse.body.article.votes).toBe(5);
                    });
            });
    });
    test("PATCH:404 responds with a suitable error when given a valid but non-existent article_id", () => {
        return request(app)
            .patch("/api/articles/101")
            .send({ inc_votes: 25 })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article_id not found");
            });
    });
    test("PATCH:400 responds with a suitable error when given an invalid article_id", () => {
        return request(app)
            .patch("/api/articles/top-10-spider-facts")
            .send({ inc_votes: 2 })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request");
            });
    });
    test("PATCH:400 responds with a suitable error when given an invalid newVotes object", () => {
        return request(app)
            .patch("/api/articles/5")
            .send({ inc_votes: "two" })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe(
                    "bad request - invalid request body"
                );
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
                expect(articles).toHaveLength(13);
                expect(articles).toBeSortedBy("created_at", {
                    descending: true,
                });
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

describe("/api/articles?topic=", () => {
    test("GET:200 responds with a filtered array of articles whose topic matches the query parameter", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(12);
                articles.forEach(({ topic }) => expect(topic).toBe("mitch"));
            });
    });
    test("GET:200 responds with an empty array when given a topic which exists but no articles associated with the given topic", () => {
        return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(0);
                expect(articles).toEqual([]);
            });
    });
    test("GET:404 responds a suitable error when given a valid but non-existent topic", () => {
        return request(app)
            .get("/api/articles?topic=cooking")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("slug not found");
            });
    });
});

describe("api/articles/:article_id/comments", () => {
    test("GET:200 responds with an array of comment objects for the given article_id. The comment objects have the correct properties and are sent with the most recent comment first.", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(comments).toHaveLength(11);
                expect(comments).toBeSortedBy("created_at", {
                    descending: true,
                });
                comments.forEach((comment) => {
                    expect(comment.comment_id).toEqual(expect.any(Number));
                    expect(comment.votes).toEqual(expect.any(Number));
                    expect(comment.created_at).toEqual(expect.any(String));
                    expect(comment.author).toEqual(expect.any(String));
                    expect(comment.body).toEqual(expect.any(String));
                    expect(comment.article_id).toEqual(expect.any(Number));
                });
            });
    });
    test("GET:404 responds with an appropriate status and error message when given a valid but non-existent article_id", () => {
        return request(app)
            .get("/api/articles/99/comments")
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("article does not exist");
            });
    });
    test("GET:400 responds with an appropriate status and message when given an invalid article_id", () => {
        return request(app)
            .get("/api/articles/my-article/comments")
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request");
            });
    });
    test("POST:201 inserts a new comment to the db with the given article_id and responds with the new comment", () => {
        const newComment = {
            username: "lurker",
            body: "your mum...",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment.article_id).toBe(2);
                expect(comment.body).toBe(newComment.body);
                expect(comment.author).toBe(newComment.username);
            });
    });
    test("POST:404 responds with a suitable message and status when given an article_id which does not exist", () => {
        const newComment = {
            username: "lurker",
            body: "lmao this is funny lololol xoxo",
        };
        return request(app)
            .post("/api/articles/99/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("article_id not found");
            });
    });
    test("POST:404 responds with a suitable message and status when the username in the body of the message does not exist", () => {
        const newComment = {
            username: "oli_2023",
            body: "heyy hey",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("username not found");
            });
    });
    test("POST:400 responds with a suitable message and status when the request body is invalid", () => {
        const newComment = {
            user: "lurker",
            comment: "wtf m8 what is this!?",
        };
        return request(app)
            .post("/api/articles/2/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(
                    "bad request - invalid parameters for comment body"
                );
            });
    });
    test("POST:400 responds with a suitable message and status when the article_id is invalid", () => {
        const newComment = {
            username: "lurker",
            body: "whatsupppp",
        };
        return request(app)
            .post("/api/articles/article-1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe("/api/users", () => {
    test("GET:200 sends an array of user objects with username, name and avatar_url properties", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                const { users } = body;
                expect(users).toHaveLength(data.userData.length);
                users.forEach((user) => {
                    expect(user.username).toEqual(expect.any(String));
                    expect(user.name).toEqual(expect.any(String));
                    expect(user.avatar_url).toEqual(expect.any(String));
                });
            });
    });
});

describe("/api/comments/:comment_id", () => {
    test("DELETE:204 responds with a suitable status code and no content", () => {
        return request(app)
            .delete("/api/comments/10")
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
    test("DELETE:400 responds with a suitable error if given an invalid comment_id", () => {
        return request(app)
            .delete("/api/comments/my-comment")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toEqual("bad request");
            });
    });
    test("DELETE:404 responds with a suitable error if given a valid but non-existent comment_id", () => {
        return request(app)
            .delete("/api/comments/150")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toEqual("comment_id not found");
            });
    });
});
