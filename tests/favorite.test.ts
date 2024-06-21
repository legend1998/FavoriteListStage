import request from "supertest";
import mongoose from "mongoose";

import app from "../index";
import server from "../server";

const userId = "666dbcd805052a0673aeddcb";
const movieId = "666dbc47d973977242b614c8";
const contentType = "Movie";

// beforeAll(async () => {
//   await mongoose.connect(
//     "mongodb+srv://suman:xFtw06WwOPMq8Ppd@cluster0.09rmyvy.mongodb.net/stage"
//   );
// });

afterAll((done) => {
  server.close(done);
});

// unit testing

describe("GET /favorite/asdf", () => {
  it(`should return 400 if userId parameter is invalid`, async () => {
    const res = await request(app)
      .get("/favorite/asdf")
      .set("Authorization", "suman mypass");

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return mylist for ther user ${userId} `, async () => {
    const res = await request(app)
      .get("/favorite/" + userId)
      .set("Authorization", "suman mypass");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(2);
  });
});

describe("PUT /favorite", () => {
  it(`should return 400 if userId query parameter is missing`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ userId: userId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return 400 if contentId query parameter is missing`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ userId: userId, type: contentType });

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return 400 if type query parameter is missing`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ userId: userId, contentId: movieId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return 200 with objectId add this item - Movie, id-  ${movieId} ,userId - ${userId}`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ userId: userId, contentId: movieId, type: contentType });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchSnapshot({
      id: expect.any(String),
      exists: expect.any(Boolean),
    });
  });
});

describe("DELETE /favorite ", () => {
  it(`should return 400 if id query parameter is missing`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ userId: userId });
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return 400 if userId query parameter is missing`, async () => {
    const res = await request(app)
      .put("/favorite")
      .set("Authorization", "suman mypass")
      .query({ id: movieId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchSnapshot({ error: expect.any(String) });
  });

  it(`should return 200 for userid ${userId} & itemId ${movieId}`, async () => {
    const res = await request(app)
      .delete("/favorite")
      .set("Authorization", "suman mypass")
      .query({ id: movieId, userId: userId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchSnapshot({ deleted: expect.any(Number) });
  });
});
