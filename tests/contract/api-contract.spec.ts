import { test, expect } from "@playwright/test";
import { JSONPlaceholderClient } from "../../api/clients/JSONPlaceholderClient";
import { ResponseValidator } from "../../utils/api/ResponseValidator";
import { Logger } from "../../utils/reporting/Logger";

test.describe("Contract Tests - API Schema Validation", () => {
  let apiClient: JSONPlaceholderClient;

  test.beforeAll(async ({ request }) => {
    apiClient = new JSONPlaceholderClient(request);
  });

  test("CON001 - Post schema es correcto", async ({ request }) => {
    Logger.testStart("CON001");

    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts/1",
    );

    await ResponseValidator.validateStatusCode(response, 200);
    await ResponseValidator.validateIsJSON(response);

    const post = await response.json();

    // Validar estructura exacta
    expect(post).toMatchObject({
      userId: expect.any(Number),
      id: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    });

    Logger.testEnd("CON001", "PASSED");
  });

  test("CON002 - User schema es correcto", async ({ request }) => {
    Logger.testStart("CON002");

    const response = await request.get(
      "https://jsonplaceholder.typicode.com/users/1",
    );

    await ResponseValidator.validateStatusCode(response, 200);

    const user = await response.json();

    // Validar estructura completa de usuario
    expect(user).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      username: expect.any(String),
      email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      address: expect.objectContaining({
        street: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
        geo: expect.objectContaining({
          lat: expect.any(String),
          lng: expect.any(String),
        }),
      }),
      phone: expect.any(String),
      website: expect.any(String),
      company: expect.objectContaining({
        name: expect.any(String),
        catchPhrase: expect.any(String),
        bs: expect.any(String),
      }),
    });

    Logger.testEnd("CON002", "PASSED");
  });

  test("CON003 - Comment schema es correcto", async ({ request }) => {
    Logger.testStart("CON003");

    const response = await request.get(
      "https://jsonplaceholder.typicode.com/comments/1",
    );

    await ResponseValidator.validateStatusCode(response, 200);

    const comment = await response.json();

    expect(comment).toMatchObject({
      postId: expect.any(Number),
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.stringMatching(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      body: expect.any(String),
    });

    Logger.testEnd("CON003", "PASSED");
  });

  test("CON004 - Array de posts tiene schema correcto", async ({ request }) => {
    Logger.testStart("CON004");

    const response = await request.get(
      "https://jsonplaceholder.typicode.com/posts",
    );

    await ResponseValidator.validateStatusCode(response, 200);
    await ResponseValidator.validateNonEmptyArray(response);

    const posts = await response.json();

    // Validar que cada elemento del array cumple el contrato
    posts.slice(0, 5).forEach((post: any) => {
      expect(post).toMatchObject({
        userId: expect.any(Number),
        id: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String),
      });
    });

    Logger.testEnd("CON004", "PASSED");
  });

  test("CON005 - POST request acepta estructura correcta", async ({
    request,
  }) => {
    Logger.testStart("CON005");

    const validPost = {
      title: "Contract Test",
      body: "Testing contract",
      userId: 1,
    };

    const response = await request.post(
      "https://jsonplaceholder.typicode.com/posts",
      {
        data: validPost,
      },
    );

    await ResponseValidator.validateStatusCode(response, 201);

    const created = await response.json();

    expect(created).toHaveProperty("id");
    expect(created.title).toBe(validPost.title);
    expect(created.body).toBe(validPost.body);
    expect(created.userId).toBe(validPost.userId);

    Logger.testEnd("CON005", "PASSED");
  });
});
