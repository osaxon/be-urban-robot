# NC News API

This is REST API built with Node.JS, Express and Postgres.

Live endpoint: <https://be-urban-robot-production.up.railway.app/>

## Pre-requisites

In order to clone this project and create a local working copy, you must have the following installed:

- Node JS v18+
- PostgreSQL v16+

## Installation

Clone the repo and install all dependencies

```bash
git clone https://github.com/osaxon/be-urban-robot.git
cd be-news
npm install
```

Create two environment variables files in the project root

.env.development:

```json
PGDATABASE=nc_news
```

.env.test:

```json
PGDATABASE=nc_news_test
```

Create the databases locally

```bash
npm run setup-dbs
```

Seed the development database

```bash
npm run seed
```

## API Endpoints

### GET /api

Serves up a JSON representation of all the available endpoints of the API.

### GET /api/topics

Serves an array of all topics.

Queries: None

Example Response:

```json
{
    "topics": [
        {
            "slug": "football",
            "description": "Footie!"
        }
    ]
}
```

### GET /api/articles

Serves an array of all articles sorted by date in descending order.

Queries:

- author (coming soon!)
- topic
- sort_by (coming soon!)
- order (coming soon!)

Example Response:

```json
{
    "articles": [
        {
            "title": "Seafood substitutions are increasing",
            "topic": "cooking",
            "author": "weegembump",
            "body": "Text from the article...",
            "created_at": "2018-05-30T15:59:13.341Z",
            "votes": 0,
            "comment_count": 6
        }
    ]
}
```

### GET /api/articles/:article_id

Serves a single article with the given ID passed as params.

Queries: None

Example Response:

```json
{
    "article_id": 1,
    "author": "butter_bridge",
    "title": "Living in the shadow of a great man",
    "body": "I find this existence challenging",
    "topic": "mitch",
    "created_at": "2020-07-09T20:11:00.000Z",
    "votes": 100,
    "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    "comment_count": 11
}
```

### GET /api/articles/:article_id/comments

Serves an array of comments associated with an article.

Queries: None

Example Response:

```json
{
 "comments": [
  {
   "comment_id": 33,
   "votes": 4,
   "created_at": "2019-12-31T21:21:00.000Z",
   "author": "cooljmessy",
   "body": "Explicabo perspiciatis voluptatem sunt tenetur maxime aut. Optio totam modi. Perspiciatis et quia.",
   "article_id": 1
  },
  // ...
 ]
}
```

### POST /api/articles/:article_id/comments

Inserts a new comment to the associated article and responds with the new comment.

Queries: None

Example Response:

```json
{
    "comment_id": 5,
    "username": "lurker",
    "body": "your mum",
    "created_at": "2020-07-09T20:11:00.000Z",
    "article_id": 2
}
```

### DELETE /api/comments/:comment_id

Deletes the comment passed as params. Does not return any content.

Queries: None
