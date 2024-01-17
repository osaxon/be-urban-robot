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

describe("/api/topics/:slug", () => {
    test("GET:200 sends a single topic matching the given slug from params", () => {
        return request(app)
            .get("/api/topics/cats")
            .expect(200)
            .then(({ body }) => {
                const { topic } = body;
                expect(topic.slug).toBe("cats");
                expect(topic.description).toBe("Not dogs");
            });
    });
    test("GET:404 sends a suitable error when given a valid but non-existent slug", () => {
        return request(app)
            .get("/api/topics/soccer")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("slug not found");
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
    test("POST:201 inserts a new article and responds with the newly added article which includes additional properties", () => {
        const newArticle = {
            author: "lurker",
            title: "top 5 alien abductions of 2023",
            body: "do you believe???",
            topic: "cats",
            article_img_url:
                "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette3.wikia.nocookie.net%2Faliens%2Fimages%2Fe%2Fec%2FCartmanGetsanAnalProbe23.png%2Frevision%2Flatest%3Fcb%3D20111105211802&f=1&nofb=1&ipt=dc8582097ce70a65eac8a98e743e6a5fe503c124e7850eb2b448b3ce9a68731b&ipo=images",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                const { article } = body;
                expect(article.article_id).toBe(14);
                expect(article.votes).toBe(0);
                expect(article.created_at).toEqual(expect.any(String));
                expect(article.comment_count).toBe(0);
            });
    });
    test("POST:201 adds a default article image if a url isn't given", () => {
        const newArticle = {
            author: "lurker",
            title: "top 5 alien abductions of 2023",
            body: "do you believe???",
            topic: "cats",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                const { article } = body;
                expect(article.article_img_url).toBe(
                    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
                );
            });
    });
    test("POST:400 sends a suitable error when the article body is invalid", () => {
        const newArticle = {
            author: "lurker",
            description: "top 5 alien abductions of 2023",
            content: "do you believe???",
            topic: "cats",
        };
        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe("/api/articles?p=X&limit=Y", () => {
    test("GET:200 returns an array of articles paginated to the defult limit of 10 articles per page", () => {
        return request(app)
            .get("/api/articles?p=1")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(10);
            });
    });
    test("GET:200 returns articles offset to the correct page", () => {
        return request(app)
            .get("/api/articles?p=2")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                // page 2 has 5 articles because the limit is 10 per page and 15 in total
                expect(articles).toHaveLength(5);
            });
    });
    test("GET:200 returns a total_count property which is the total number of articles discounting the limit", () => {
        return request(app)
            .get("/api/articles?p=1")
            .expect(200)
            .then(({ body }) => {
                const { articles, total_count } = body;
                expect(articles).toHaveLength(10);
                expect(total_count).toBe("15");
            });
    });
    test("GET:200 returns an array of articles up to the limit specified as a query param", () => {
        return request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(5);
            });
    });
    test("GET:200 defaults to 10 if no value is given to the limit query", () => {
        return request(app)
            .get("/api/articles?limit")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toHaveLength(10);
            });
    });
    test("GET:400 defaults to 10 if no value is given to the limit query", () => {
        return request(app)
            .get("/api/articles?limit=twelve")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("invalid limit value");
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

describe("/api/articles?sort_by=", () => {
    test("GET:200 responds with an array of articles ordered by the given query column passed as query parameters", () => {
        return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSortedBy("votes", { descending: true });
            });
    });
    test("GET:404 responds a suitable error when given an invalid column to sort the table", () => {
        return request(app)
            .get("/api/articles?sort_by=dogs")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
            });
    });
});

describe("/api/articles?order=", () => {
    test("GET:200 responds with an array of articles ordered by created date in ascending order", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(articles).toBeSortedBy("created_at");
            });
    });
    test("GET:400 responds with a suitable error when given invalid order direction", () => {
        return request(app)
            .get("/api/articles?order=up")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("bad request");
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

describe("/api/users/:username", () => {
    test("GET:200 sends a single user matching the given username from params", () => {
        return request(app)
            .get("/api/users/lurker")
            .expect(200)
            .then(({ body: user }) => {
                expect(user.username).toBe("lurker");
                expect(user.name).toBe("do_nothing");
                expect(user.avatar_url).toBe(
                    "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
                );
            });
    });
    test("GET:404 sends a suitable error when given a valid but non-existent user", () => {
        return request(app)
            .get("/api/users/olisax")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("user not found");
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
    test("PATCH:200 updates the votes on a comment and returns the updated comment", () => {
        return request(app)
            .patch("/api/comments/17")
            .send({ inc_votes: 1 })
            .expect(200)
            .then((addOneResponse) => {
                return request(app)
                    .patch("/api/comments/17")
                    .send({ inc_votes: 1 })
                    .expect(200)
                    .then((addAnotherOneResponse) => {
                        expect(addOneResponse.body.comment.votes).toBe(21);
                        expect(addAnotherOneResponse.body.comment.votes).toBe(
                            22
                        );
                    });
            });
    });
    test("PATCH:404 responds with a suitable error when given a valid but non-existent comment_id", () => {
        return request(app)
            .patch("/api/comments/101")
            .send({ inc_votes: 1 })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe("comment_id not found");
            });
    });
    test("PATCH:400 responds with a suitable error when given an invalid comment_id", () => {
        return request(app)
            .patch("/api/comments/my-comment")
            .send({ inc_votes: 2 })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request");
            });
    });
    test("PATCH:400 responds with a suitable error when given an invalid newVotes object", () => {
        return request(app)
            .patch("/api/comments/5")
            .send({ inc_votes: "two" })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe("bad request");
            });
    });
});
