import express from "express";
import request from "supertest";
import app from "./index";
import { Server } from "http";

let server: Server;

beforeAll(() => {
  server = app.listen(4000); // Start the server before running tests
});

afterAll(() => {
  server.close(); // Close the server after all tests are done
});

describe("API Tests", () => {

  afterEach(async () => {
    await request(app).delete("/messages"); // Use the DELETE endpoint to clear messages after each test
  });

  describe("GET /", () => {
    it("should return a welcome message", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Penis, Express with TypeScript!");
    });
  });

  describe("GET /counter", () => {
    it("should return the current counter value", async () => {
      const response = await request(app).get("/counter");
      expect(response.status).toBe(200);
      expect(response.text).toContain("Counter is currently at");
    });
  });

  describe("POST /counter", () => {
    it("should update the counter when a valid value is provided", async () => {
      const response = await request(app).post("/counter").send({ value: 1 });
      expect(response.status).toBe(201);
      expect(response.text).toContain("Counter Updated to");
    });

    it("should return 400 for invalid values", async () => {
      const response = await request(app).post("/counter").send({ value: 2 });
      expect(response.status).toBe(400);
      expect(response.text).toBe("Value greater than 1");
    });
  });

  describe("POST /message", () => {
    it("should save a valid message", async () => {
      const response = await request(app).post("/message").send({ message: "Hello, World!" });
      expect(response.status).toBe(201);
      expect(response.text).toBe("Message received and saved: Hello, World!");
    });

    it("should return 400 for invalid messages", async () => {
      const response = await request(app).post("/message").send({ message: 123 });
      expect(response.status).toBe(400);
      expect(response.text).toBe("Invalid message. Please provide a valid string.");
    });
  });

  describe("GET /messages", () => {
    it("should return all saved messages", async () => {
      await request(app).post("/message").send({ message: "Test Message 1" });
      await request(app).post("/message").send({ message: "Test Message 2" });

      const response = await request(app).get("/messages");
      expect(response.status).toBe(200);
      expect(response.text).toBe("Test Message 1\nTest Message 2");
    });
  });

  describe("DELETE /messages", () => {
    it("should delete all messages", async () => {
      await request(app).post("/message").send({ message: "Message to delete" });

      const deleteResponse = await request(app).delete("/messages");
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.text).toBe("All messages have been deleted.");

      const getResponse = await request(app).get("/messages");
      expect(getResponse.status).toBe(200);
      expect(getResponse.text).toBe(""); // Messages should be empty
    });
  });

  describe("GET /favicon.ico", () => {
    it("should return the favicon", async () => {
      const response = await request(app).get("/favicon.ico");
      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toBe("image/x-icon");
    });
  });

  describe("GET /*notfound", () => {
    it("should return the not found page", async () => {
      const response = await request(app).get("/random-page");
      expect(response.status).toBe(200);
      expect(response.header["content-type"]).toContain("text/html");
    });
  });
});